'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import tutorService from '@/services/tutorService';

const NewTutorPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    profile_image: '',
    bio: '',
    specialization: '',
    experience: '',
    hourly_rate: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    profile_image: Yup.string().url('Must be a valid URL').nullable(),
    bio: Yup.string(),
    specialization: Yup.string(),
    experience: Yup.number().min(0, 'Experience must be a positive number').nullable(),
    hourly_rate: Yup.number().min(0, 'Hourly rate must be a positive number').nullable(),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Remove confirm_password as it's not needed for the API
      const { confirm_password, ...tutorData } = values;
      
      await tutorService.create(tutorData);
      router.push('/tutors');
    } catch (err) {
      setError('Failed to create tutor. Please try again.');
      console.error('Creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
    },
    {
      name: 'confirm_password',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm password',
      required: true,
    },
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
      name: 'profile_image',
      label: 'Profile Image URL',
      type: 'text',
      placeholder: 'Enter profile image URL',
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Enter tutor bio',
      rows: 3,
    },
    {
      name: 'specialization',
      label: 'Specialization',
      type: 'select',
      options: [
        { value: '', label: 'Select a specialization' },
        { value: 'General English', label: 'General English' },
        { value: 'Business English', label: 'Business English' },
        { value: 'Academic English', label: 'Academic English' },
        { value: 'Conversation', label: 'Conversation' },
        { value: 'Exam Preparation', label: 'Exam Preparation' },
        { value: "Children's English", label: "Children's English" },
      ],
    },
    {
      name: 'experience',
      label: 'Experience (Years)',
      type: 'number',
      placeholder: 'Enter years of experience',
      min: 0,
    },
    {
      name: 'hourly_rate',
      label: 'Hourly Rate ($)',
      type: 'number',
      placeholder: 'Enter hourly rate',
      min: 0,
      step: 0.01,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/admin/tutors">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add New Tutor
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
          submitButtonText="Create Tutor"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default NewTutorPage;
