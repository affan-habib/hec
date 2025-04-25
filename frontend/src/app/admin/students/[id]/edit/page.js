'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import studentService from '@/services/studentService';

const EditStudentPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await studentService.getById(id);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
        setError('Failed to load student data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const initialValues = {
    first_name: student?.first_name || '',
    last_name: student?.last_name || '',
    email: student?.email || '',
    profile_image: student?.profile_image || '',
    level: student?.studentProfile?.level || 'beginner',
    native_language: student?.studentProfile?.native_language || '',
    learning_goals: student?.studentProfile?.learning_goals || '',
    interests: student?.studentProfile?.interests || '',
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    profile_image: Yup.string().url('Must be a valid URL').nullable(),
    level: Yup.string().oneOf(['beginner', 'intermediate', 'advanced'], 'Invalid level'),
    native_language: Yup.string(),
    learning_goals: Yup.string(),
    interests: Yup.string(),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      const { 
        first_name, last_name, email, profile_image,
        level, native_language, learning_goals, interests
      } = values;

      // Prepare user data
      const userData = {
        first_name,
        last_name,
        email,
        profile_image,
      };

      // Prepare profile data
      const profileData = {
        level,
        native_language,
        learning_goals,
        interests,
      };

      // Update user and profile
      await studentService.update(id, {
        ...userData,
        studentProfile: profileData,
      });

      router.push('/students');
    } catch (err) {
      setError('Failed to update student. Please try again.');
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
      required: true,
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter last name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
    },
    {
      name: 'profile_image',
      label: 'Profile Image URL',
      type: 'text',
      placeholder: 'Enter profile image URL',
    },
    {
      name: 'level',
      label: 'English Level',
      type: 'select',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ],
      required: true,
    },
    {
      name: 'native_language',
      label: 'Native Language',
      type: 'text',
      placeholder: 'Enter native language',
    },
    {
      name: 'learning_goals',
      label: 'Learning Goals',
      type: 'textarea',
      placeholder: 'Enter learning goals',
      rows: 3,
    },
    {
      name: 'interests',
      label: 'Interests',
      type: 'textarea',
      placeholder: 'Enter interests',
      rows: 3,
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
          <Link href="/admin/students">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Student
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

export default EditStudentPage;
