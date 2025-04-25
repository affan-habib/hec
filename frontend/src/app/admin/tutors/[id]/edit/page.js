'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import tutorService from '@/services/tutorService';

const EditTutorPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await tutorService.getById(id);
        setTutor(response.data);
      } catch (error) {
        console.error('Error fetching tutor:', error);
        setError('Failed to load tutor data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  const initialValues = {
    first_name: tutor?.first_name || '',
    last_name: tutor?.last_name || '',
    profile_image: tutor?.profile_image || '',
    bio: tutor?.tutorProfile?.bio || '',
    specialization: tutor?.tutorProfile?.specialization || '',
    experience: tutor?.tutorProfile?.experience || '',
    hourly_rate: tutor?.tutorProfile?.hourly_rate || '',
  };

  const validationSchema = Yup.object({
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
      await tutorService.update(id, values);
      router.push(`/tutors/${id}`);
    } catch (err) {
      setError('Failed to update tutor. Please try again.');
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
          <Link href={`/tutors/${id}`}>
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Tutor
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

export default EditTutorPage;
