'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import awardService from '@/services/awardService';

const EditAwardPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [award, setAward] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAward = async () => {
      try {
        const response = await awardService.getById(id);
        setAward(response.data);
      } catch (error) {
        console.error('Error fetching award:', error);
        setError('Failed to load award data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAward();
  }, [id]);

  const initialValues = {
    name: award?.name || '',
    description: award?.description || '',
    category: award?.category || '',
    image_url: award?.image_url || '',
    points_required: award?.points_required || '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    category: Yup.string(),
    image_url: Yup.string().url('Must be a valid URL').nullable(),
    points_required: Yup.number().min(0, 'Points must be a positive number').nullable(),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      await awardService.update(id, values);
      router.push(`/awards/${id}`);
    } catch (err) {
      setError('Failed to update award. Please try again.');
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter award name',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter award description',
      rows: 3,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'Select a category' },
        { value: 'Achievement', label: 'Achievement' },
        { value: 'Milestone', label: 'Milestone' },
        { value: 'Participation', label: 'Participation' },
        { value: 'Special', label: 'Special' },
      ],
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text',
      placeholder: 'Enter image URL',
    },
    {
      name: 'points_required',
      label: 'Points Required',
      type: 'number',
      placeholder: 'Enter points required',
      min: 0,
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
          <Link href={`/awards/${id}`}>
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Award
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

export default EditAwardPage;
