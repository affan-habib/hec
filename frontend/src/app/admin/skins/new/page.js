'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import skinService from '@/services/skinService';

const NewSkinPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    is_public: Yup.boolean(),
  });

  const initialValues = {
    name: '',
    description: '',
    is_public: false,
    theme_data: JSON.stringify({
      version: 1,
      elements: [],
      background: {
        color: '#ffffff',
        image: null
      },
      dimensions: {
        width: 800,
        height: 600
      }
    })
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await skinService.create(values);
      
      if (response.success && response.data && response.data.skin) {
        // Redirect to the skin builder page
        router.push(`/admin/skins/${response.data.skin.id}/builder`);
      } else {
        setError('Failed to create skin. Please try again.');
      }
    } catch (error) {
      console.error('Error creating skin:', error);
      setError('An error occurred while creating the skin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter skin name',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter skin description',
      rows: 4,
    },
    {
      name: 'is_public',
      label: 'Make this skin public',
      type: 'checkbox',
      description: 'Public skins can be used by all users',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/admin/skins">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create New Skin
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <FormikForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            fields={formFields}
            submitButton={{
              text: 'Create & Open Builder',
              isSubmitting,
            }}
            cancelButton={{
              text: 'Cancel',
              onClick: () => router.push('/admin/skins'),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewSkinPage;
