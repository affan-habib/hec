'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import assetService from '@/services/assetService';
import assetCategoryService from '@/services/assetCategoryService';

const EditAssetPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [asset, setAsset] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await assetCategoryService.getAll({ limit: 100 });
        if (categoriesResponse.success && categoriesResponse.data && Array.isArray(categoriesResponse.data.categories)) {
          setCategories(categoriesResponse.data.categories);
        }

        // Fetch asset
        const assetResponse = await assetService.getById(id);
        if (assetResponse.success && assetResponse.data) {
          setAsset(assetResponse.data);
          if (assetResponse.data.image_url) {
            setUploadedImageUrl(assetResponse.data.image_url);
          }
          if (assetResponse.data.thumbnail_url) {
            setUploadedThumbnailUrl(assetResponse.data.thumbnail_url);
          }
        } else {
          console.error('Unexpected API response format:', assetResponse);
          setError('Failed to load asset data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const initialValues = {
    name: asset?.name || '',
    description: asset?.description || '',
    category_id: asset?.category_id || '',
    image_url: asset?.image_url || '',
    thumbnail_url: asset?.thumbnail_url || '',
    price: asset?.price || 0,
    is_premium: asset?.is_premium || false,
    is_free: asset?.is_free || true,
    points_required: asset?.points_required || 0,
    display_order: asset?.display_order || 0,
    is_active: asset?.is_active !== undefined ? asset.is_active : true,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    category_id: Yup.number().required('Category is required'),
    image_url: Yup.string().url('Must be a valid URL').required('Image URL is required'),
    thumbnail_url: Yup.string().url('Must be a valid URL').nullable(),
    price: Yup.number().min(0, 'Price must be a non-negative number'),
    is_premium: Yup.boolean(),
    is_free: Yup.boolean(),
    points_required: Yup.number().integer('Points must be an integer').min(0, 'Points must be a non-negative number'),
    display_order: Yup.number().integer('Display order must be an integer').min(0, 'Display order must be a non-negative number'),
    is_active: Yup.boolean(),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Validate pricing logic
      if (values.is_free && (values.price > 0 || values.points_required > 0)) {
        setError('Free assets cannot have a price or points requirement');
        setIsSubmitting(false);
        return;
      }

      if (!values.is_free && values.price <= 0 && values.points_required <= 0) {
        setError('Non-free assets must have either a price or points requirement');
        setIsSubmitting(false);
        return;
      }

      await assetService.update(id, values);
      router.push(`/assets/${id}`);
    } catch (err) {
      setError('Failed to update asset. Please try again.');
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event, field, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await assetService.uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success && response.data && response.data.url) {
        setFieldValue(field, response.data.url);
        if (field === 'image_url') {
          setUploadedImageUrl(response.data.url);
        } else if (field === 'thumbnail_url') {
          setUploadedThumbnailUrl(response.data.url);
        }
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter asset name',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter asset description',
      rows: 3,
    },
    {
      name: 'category_id',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'Select a category' },
        ...categories.map((category) => ({
          value: category.id,
          label: category.name,
        })),
      ],
      required: true,
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text',
      placeholder: 'Enter image URL or upload an image',
      required: true,
      customInput: ({ field, form, ...props }) => (
        <div>
          <div className="flex">
            <input
              type="text"
              id={field.name}
              {...field}
              {...props}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md rounded-r-none"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-r-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              <FiUpload className="-ml-1 mr-2 h-5 w-5" />
              Upload
            </label>
            <input
              id="image-upload"
              name="image-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'image_url', form.setFieldValue)}
            />
          </div>
          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
          {uploadedImageUrl && (
            <div className="mt-2">
              <img
                src={uploadedImageUrl}
                alt="Uploaded preview"
                className="h-24 w-24 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      name: 'thumbnail_url',
      label: 'Thumbnail URL (Optional)',
      type: 'text',
      placeholder: 'Enter thumbnail URL or upload an image',
      customInput: ({ field, form, ...props }) => (
        <div>
          <div className="flex">
            <input
              type="text"
              id={field.name}
              {...field}
              {...props}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md rounded-r-none"
            />
            <label
              htmlFor="thumbnail-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-r-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              <FiUpload className="-ml-1 mr-2 h-5 w-5" />
              Upload
            </label>
            <input
              id="thumbnail-upload"
              name="thumbnail-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'thumbnail_url', form.setFieldValue)}
            />
          </div>
          {uploadedThumbnailUrl && (
            <div className="mt-2">
              <img
                src={uploadedThumbnailUrl}
                alt="Thumbnail preview"
                className="h-16 w-16 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      name: 'is_free',
      label: 'Free Asset',
      type: 'checkbox',
      checkboxLabel: 'This asset is free for all users',
    },
    {
      name: 'is_premium',
      label: 'Premium Asset',
      type: 'checkbox',
      checkboxLabel: 'This asset is for premium users only',
    },
    {
      name: 'price',
      label: 'Price ($)',
      type: 'number',
      placeholder: 'Enter price',
      min: 0,
      step: 0.01,
    },
    {
      name: 'points_required',
      label: 'Points Required',
      type: 'number',
      placeholder: 'Enter points required',
      min: 0,
    },
    {
      name: 'display_order',
      label: 'Display Order',
      type: 'number',
      placeholder: 'Enter display order',
      min: 0,
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'checkbox',
      checkboxLabel: 'Asset is active',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href={`/assets/${id}`}>
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Asset
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        <FormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={formFields}
          submitButtonText="Save Changes"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditAssetPage;
