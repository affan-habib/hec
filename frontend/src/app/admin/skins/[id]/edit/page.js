'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import React from 'react';
import FormikForm from '@/components/forms/FormikForm';
import skinService from '@/services/skinService';

const EditSkinPage = ({ params }) => {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [skin, setSkin] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkin = async () => {
      try {
        const response = await skinService.getById(id);

        if (response.success && response.data) {
          setSkin(response.data);
        } else {
          setError('Failed to load skin data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching skin:', error);
        setError('An error occurred while fetching the skin data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkin();
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    is_public: Yup.boolean(),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await skinService.update(id, values);

      if (response.success) {
        router.push(`/admin/skins/${id}`);
      } else {
        setError('Failed to update skin. Please try again.');
      }
    } catch (error) {
      console.error('Error updating skin:', error);
      setError('An error occurred while updating the skin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!skin) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Skin not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The skin you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-6">
          <Link href="/admin/skins">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiArrowLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Back to Skins
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const initialValues = {
    name: skin.name || '',
    description: skin.description || '',
    is_public: skin.is_public || false,
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
          <Link href={`/admin/skins/${id}`}>
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Skin
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
              text: 'Save Changes',
              isSubmitting,
            }}
            cancelButton={{
              text: 'Cancel',
              onClick: () => router.push(`/admin/skins/${id}`),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditSkinPage;
