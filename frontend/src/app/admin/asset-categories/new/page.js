'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import assetCategoryService from '@/services/assetCategoryService';

const NewAssetCategoryPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: '',
    description: '',
    display_order: 0,
    is_active: true,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    display_order: Yup.number().integer('Display order must be an integer').min(0, 'Display order must be a non-negative number'),
    is_active: Yup.boolean(),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      await assetCategoryService.create(values);
      router.push('/asset-categories');
    } catch (err) {
      setError('Failed to create asset category. Please try again.');
      console.error('Creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter category name',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter category description',
      rows: 3,
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
      checkboxLabel: 'Category is active',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/admin/asset-categories">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add New Asset Category
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
          submitButtonText="Create Category"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default NewAssetCategoryPage;
