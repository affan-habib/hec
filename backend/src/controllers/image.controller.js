const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db.config');
const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination.utils');

dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Upload an image locally and save metadata to database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const userId = req.user.id;

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname.replace(/\s+/g, '-')}`;

    // Define the destination path
    const destPath = path.join(uploadsDir, filename);

    // Create a readable stream from the temporary file
    const readStream = fs.createReadStream(file.path);
    // Create a writable stream to the destination path
    const writeStream = fs.createWriteStream(destPath);

    // Copy the file
    readStream.pipe(writeStream);

    // Wait for the file to be copied
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Generate URL for the image (relative to the server)
    const url = `/uploads/images/${filename}`;

    // Save image metadata to database
    const [result] = await pool.query(
      'INSERT INTO images (filename, original_name, mime_type, size, url, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
      [filename, file.originalname, file.mimetype, file.size, url, userId]
    );

    const imageId = result.insertId;

    // Get the saved image data
    const [images] = await pool.query('SELECT * FROM images WHERE id = ?', [imageId]);

    // Delete temporary file
    fs.unlinkSync(file.path);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        image: images[0]
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);

    // Delete temporary file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
};

/**
 * Get all images for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserImages = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get pagination parameters (null if pagination is disabled)
    const pagination = getPaginationParams(req.query);

    // Get total count for pagination metadata
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM images WHERE uploaded_by = ?',
      [userId]
    );
    const totalCount = countResult[0].total;

    // If pagination is disabled, get all images
    if (!pagination) {
      const [images] = await pool.query(
        'SELECT * FROM images WHERE uploaded_by = ? ORDER BY created_at DESC',
        [userId]
      );

      return res.status(200).json({
        success: true,
        data: {
          images,
          pagination: false,
          total: totalCount
        }
      });
    }

    // Get images with pagination
    const [images] = await pool.query(
      'SELECT * FROM images WHERE uploaded_by = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, pagination.limit, pagination.offset]
    );

    // Create response with pagination metadata
    res.status(200).json({
      success: true,
      data: {
        images,
        ...getPaginationMetadata(pagination, totalCount)
      }
    });
  } catch (error) {
    console.error('Get user images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting images',
      error: error.message
    });
  }
};

/**
 * Delete an image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get image data
    const [images] = await pool.query(
      'SELECT * FROM images WHERE id = ?',
      [id]
    );

    if (!images.length) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const image = images[0];

    // Check if user has permission to delete the image
    if (image.uploaded_by !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this image'
      });
    }

    // Delete the file from the local filesystem
    const filePath = path.join(uploadsDir, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.query('DELETE FROM images WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage,
  getUserImages,
  deleteImage
};
