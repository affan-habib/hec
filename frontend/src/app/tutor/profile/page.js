'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiEdit, FiSave, FiX, FiUpload, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import profileService from '@/services/profileService';

export default function TutorProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    specializations: [],
    education: [],
    experience: []
  });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    specialization: '',
    education: '',
    experience: '',
    hourly_rate: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await profileService.getProfile();

      if (response.success) {
        const { user: userData, profile: profileDetails } = response.data;

        // Parse specializations from string to array if needed
        let specializations = [];
        if (profileDetails?.specialization) {
          // Check if it's already an array
          if (Array.isArray(profileDetails.specialization)) {
            specializations = profileDetails.specialization;
          } else {
            // Try to parse JSON string if it's stored that way
            try {
              specializations = JSON.parse(profileDetails.specialization);
            } catch (e) {
              // If not JSON, split by comma
              specializations = [profileDetails.specialization];
            }
          }
        }

        // Set profile data
        const profileInfo = {
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: profileDetails?.bio || '',
          specializations: specializations,
          experience: profileDetails?.experience || 0,
          hourly_rate: profileDetails?.hourly_rate || 0,
          // These are not in the API but we'll keep them for UI
          education: [],
          experience_list: []
        };

        setProfileData(profileInfo);
        setFormData({
          first_name: profileInfo.first_name,
          last_name: profileInfo.last_name,
          email: profileInfo.email,
          phone: profileInfo.phone,
          bio: profileInfo.bio,
          specialization: '',
          education: '',
          experience: profileInfo.experience.toString(),
          hourly_rate: profileInfo.hourly_rate.toString()
        });

        // Set image preview if available
        if (userData.profile_image) {
          setImagePreview(userData.profile_image);
        }
      } else {
        setError('Failed to load profile data');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear any previous error messages when user starts typing
    if (error) {
      setError('');
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');

      // Prepare data for API
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        specialization: profileData.specializations.length > 0 ? profileData.specializations[0] : '',
        experience: parseInt(formData.experience) || 0,
        hourly_rate: parseFloat(formData.hourly_rate) || 0
      };

      // Upload image if a new one is selected
      if (imageFile) {
        try {
          const imageResponse = await profileService.uploadProfileImage(imageFile);
          if (imageResponse.success) {
            updateData.profile_image = imageResponse.data.profile_image;
          }
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          setError('Failed to upload profile image. Profile update will continue without the new image.');
        }
      }

      // Update profile
      const response = await profileService.updateProfile(updateData);

      if (response.success) {
        // Refresh profile data
        await fetchProfileData();
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSpecialization = () => {
    if (formData.specialization.trim()) {
      // Add to the specializations array
      const newSpecializations = [...profileData.specializations, formData.specialization.trim()];

      setProfileData({
        ...profileData,
        specializations: newSpecializations
      });

      setFormData({
        ...formData,
        specialization: ''
      });
    }
  };

  const handleAddEducation = () => {
    if (formData.education.trim()) {
      const [degree, institution, year] = formData.education.split(',').map(item => item.trim());
      if (degree && institution) {
        setProfileData({
          ...profileData,
          education: [...profileData.education, { degree, institution, year: year || '' }]
        });
        setFormData({
          ...formData,
          education: ''
        });
      }
    }
  };

  const handleAddExperience = () => {
    if (formData.experience.trim()) {
      const [position, company, period] = formData.experience.split(',').map(item => item.trim());
      if (position && company) {
        setProfileData({
          ...profileData,
          experience: [...profileData.experience, { position, company, period: period || '' }]
        });
        setFormData({
          ...formData,
          experience: ''
        });
      }
    }
  };

  const handleRemoveSpecialization = (index) => {
    const newSpecializations = [...profileData.specializations];
    newSpecializations.splice(index, 1);

    setProfileData({
      ...profileData,
      specializations: newSpecializations
    });
  };

  const handleRemoveEducation = (index) => {
    const newEducation = [...profileData.education];
    newEducation.splice(index, 1);
    setProfileData({
      ...profileData,
      education: newEducation
    });
  };

  const handleRemoveExperience = (index) => {
    const newExperience = [...profileData.experience];
    newExperience.splice(index, 1);
    setProfileData({
      ...profileData,
      experience: newExperience
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Profile
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiEdit className="-ml-1 mr-2 h-5 w-5" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="-ml-1 mr-2 h-5 w-5" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <FiX className="-ml-1 mr-2 h-5 w-5" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span>{successMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage('')}
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError('')}
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Basic Information
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="relative">
                <div className="h-40 w-40 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser className="h-20 w-20 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                {isEditing && (
                  <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 cursor-pointer">
                    <FiEdit className="h-4 w-4" />
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="md:w-2/3">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      min="0"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      name="hourly_rate"
                      id="hourly_rate"
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Tell students about yourself and your teaching experience"
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.first_name} {profileData.last_name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        <FiMail className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        {profileData.email}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        <FiPhone className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        {profileData.phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {profileData.experience} {profileData.experience === 1 ? 'year' : 'years'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hourly Rate</h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        ${parseFloat(profileData.hourly_rate).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</h4>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.bio || 'No bio provided yet.'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Specializations
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {isEditing && (
            <div className="mb-4 flex">
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="Add a specialization"
                className="flex-grow border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddSpecialization}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {profileData.specializations.map((specialization, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              >
                {specialization}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveSpecialization(index)}
                    className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {profileData.specializations.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No specializations added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Education
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {isEditing && (
            <div className="mb-4 flex">
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="Degree, Institution, Year (e.g. Master of Education, University of California, 2018)"
                className="flex-grow border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddEducation}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
          )}
          <div className="space-y-4">
            {profileData.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{edu.institution}</p>
                  {edu.year && <p className="text-xs text-gray-500 dark:text-gray-400">{edu.year}</p>}
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveEducation(index)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            {profileData.education.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No education history added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Experience
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {isEditing && (
            <div className="mb-4 flex">
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Position, Company, Period (e.g. English Tutor, Language School, 2018-2020)"
                className="flex-grow border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddExperience}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
          )}
          <div className="space-y-4">
            {profileData.experience.map((exp, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{exp.position}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{exp.company}</p>
                  {exp.period && <p className="text-xs text-gray-500 dark:text-gray-400">{exp.period}</p>}
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExperience(index)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            {profileData.experience.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No experience added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
