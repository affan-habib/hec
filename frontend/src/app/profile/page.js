'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiLock, FiUpload, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import profileService from '@/services/profileService';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
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
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user) {
      fetchProfile();
    }
  }, [loading, user]);

  // Set image preview when profile data is loaded
  useEffect(() => {
    if (profileData?.user?.profile_image) {
      setImagePreview(profileData.user.profile_image);
    }
  }, [profileData]);

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

      // Prepare profile data based on user role
      const updateData = {
        first_name: values.first_name,
        last_name: values.last_name,
        profile_image: profileImageUrl,
      };

      // Add role-specific fields
      if (user.role === 'student') {
        updateData.level = values.level;
        updateData.learning_goals = values.learning_goals;
        updateData.interests = values.interests;
      } else if (user.role === 'tutor') {
        updateData.bio = values.bio;
        updateData.specialization = values.specialization;
        updateData.experience = values.experience;
        updateData.hourly_rate = values.hourly_rate;
      } else if (user.role === 'admin') {
        updateData.department = values.department;
      }

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
    // Add role-specific validation
    ...(user?.role === 'student' && {
      level: Yup.string(),
      learning_goals: Yup.string(),
      interests: Yup.string(),
    }),
    ...(user?.role === 'tutor' && {
      bio: Yup.string(),
      specialization: Yup.string(),
      experience: Yup.number().min(0, 'Experience must be a positive number'),
      hourly_rate: Yup.number().min(0, 'Hourly rate must be a positive number'),
    }),
    ...(user?.role === 'admin' && {
      department: Yup.string(),
    }),
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

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Profile</h1>

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
              // Student fields
              level: profileData.profile?.level || '',
              learning_goals: profileData.profile?.learning_goals || '',
              interests: profileData.profile?.interests || '',
              // Tutor fields
              bio: profileData.profile?.bio || '',
              specialization: profileData.profile?.specialization || '',
              experience: profileData.profile?.experience || '',
              hourly_rate: profileData.profile?.hourly_rate || '',
              // Admin fields
              department: profileData.profile?.department || '',
            }}
            validationSchema={profileValidationSchema}
            onSubmit={handleProfileSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Image */}
                  <div className="md:col-span-2 flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-4xl font-bold">
                          {profileData.user.first_name[0]}
                          {profileData.user.last_name[0]}
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
                  </div>

                  {/* Basic Information */}
                  <div className="mb-4">
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

                  <div className="mb-4">
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

                  <div className="mb-4 md:col-span-2">
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

                  {/* Role-specific fields */}
                  {user.role === 'student' && (
                    <>
                      <div className="mb-4">
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          English Level
                        </label>
                        <Field
                          as="select"
                          name="level"
                          id="level"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Elementary">Elementary</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Upper Intermediate">Upper Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Proficient">Proficient</option>
                        </Field>
                      </div>

                      <div className="mb-4 md:col-span-2">
                        <label htmlFor="learning_goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Learning Goals
                        </label>
                        <Field
                          as="textarea"
                          name="learning_goals"
                          id="learning_goals"
                          rows="3"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="What are your English learning goals?"
                        />
                      </div>

                      <div className="mb-4 md:col-span-2">
                        <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Interests
                        </label>
                        <Field
                          as="textarea"
                          name="interests"
                          id="interests"
                          rows="3"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="What are your interests and hobbies?"
                        />
                      </div>
                    </>
                  )}

                  {user.role === 'tutor' && (
                    <>
                      <div className="mb-4 md:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <Field
                          as="textarea"
                          name="bio"
                          id="bio"
                          rows="4"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Tell students about yourself and your teaching experience"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Specialization
                        </label>
                        <Field
                          type="text"
                          name="specialization"
                          id="specialization"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="e.g., Business English, IELTS Preparation"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Years of Experience
                        </label>
                        <Field
                          type="number"
                          name="experience"
                          id="experience"
                          min="0"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <ErrorMessage name="experience" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hourly Rate ($)
                        </label>
                        <Field
                          type="number"
                          name="hourly_rate"
                          id="hourly_rate"
                          min="0"
                          step="0.01"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <ErrorMessage name="hourly_rate" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                      </div>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <div className="mb-4 md:col-span-2">
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Department
                      </label>
                      <Field
                        type="text"
                        name="department"
                        id="department"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="e.g., Management, IT, Support"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
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
                <div className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <Field
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <Field
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
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
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
