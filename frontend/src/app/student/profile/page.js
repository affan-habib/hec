'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiEdit, FiSave, FiAlertCircle, FiBook, FiHeart, FiUpload } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import profileService from '@/services/profileService';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile();
        setProfileData(response.data);
        if (response.data?.user?.profile_image) {
          setImagePreview(response.data.user.profile_image);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue('profile_image_file', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      const response = await profileService.uploadProfileImage(file);
      return response.data.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccessMessage('');

      // Upload image if a new one is selected
      let profileImageUrl = values.profile_image;
      if (values.profile_image_file) {
        profileImageUrl = await handleImageUpload(values.profile_image_file);
      }

      // Prepare profile data
      const updateData = {
        first_name: values.first_name,
        last_name: values.last_name,
        profile_image: profileImageUrl,
        level: values.level,
        learning_goals: values.learning_goals,
        interests: values.interests
      };

      // Update profile
      const response = await profileService.updateProfile(updateData);
      setProfileData(response.data);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      setSuccessMessage('');

      await profileService.changePassword(values.currentPassword, values.newPassword);
      setSuccessMessage('Password changed successfully');
      resetForm();
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Validation schemas
  const profileValidationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    level: Yup.string(),
    learning_goals: Yup.string(),
    interests: Yup.string()
  });

  const passwordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
          <button
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Student Profile</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${
                activeTab === 'profile'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-500 dark:border-indigo-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${
                activeTab === 'password'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-500 dark:border-indigo-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
          </li>
        </ul>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span>{error}</span>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && profileData && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <Formik
            initialValues={{
              first_name: profileData.user.first_name || '',
              last_name: profileData.user.last_name || '',
              email: profileData.user.email || '',
              profile_image: profileData.user.profile_image || '',
              profile_image_file: null,
              level: profileData.profile?.level || '',
              learning_goals: profileData.profile?.learning_goals || '',
              interests: profileData.profile?.interests || '',
            }}
            validationSchema={profileValidationSchema}
            onSubmit={handleProfileSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profile Image */}
                  <div className="md:col-span-1 flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-4xl font-bold">
                          {profileData.user.first_name?.[0]}
                          {profileData.user.last_name?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <label
                        htmlFor="profile_image_file"
                        className="cursor-pointer bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg flex items-center"
                      >
                        <FiUpload className="mr-2" />
                        <span>Upload Photo</span>
                        <input
                          id="profile_image_file"
                          name="profile_image_file"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                        />
                      </label>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                      <p>Your profile photo will be visible to your tutor and in the chat.</p>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <Field
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <ErrorMessage name="first_name" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                      </div>

                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <Field
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <ErrorMessage name="last_name" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                          </div>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            disabled
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 shadow-sm bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                      </div>

                      <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          English Level
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiBook className="text-gray-400" />
                          </div>
                          <Field
                            as="select"
                            name="level"
                            id="level"
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Elementary">Elementary</option>
                            <option value="Pre-Intermediate">Pre-Intermediate</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Upper-Intermediate">Upper-Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Proficient">Proficient</option>
                          </Field>
                        </div>
                        <ErrorMessage name="level" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="learning_goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Learning Goals
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                            <FiBook className="text-gray-400" />
                          </div>
                          <Field
                            as="textarea"
                            name="learning_goals"
                            id="learning_goals"
                            rows="3"
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="What are your English learning goals?"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Sharing your goals helps your tutor create a personalized learning plan.
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Interests
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                            <FiHeart className="text-gray-400" />
                          </div>
                          <Field
                            as="textarea"
                            name="interests"
                            id="interests"
                            rows="3"
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="What are your interests and hobbies?"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Your interests help your tutor make lessons more engaging and relevant to you.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting || uploadingImage}
                        className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          (isSubmitting || uploadingImage) && 'opacity-70 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting || uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={passwordValidationSchema}
            onSubmit={handlePasswordSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="p-6">
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <Field
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <Field
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isSubmitting && 'opacity-70 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
