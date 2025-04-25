'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import diaryService from '@/services/diaryService';
import diaryPageService from '@/services/diaryPageService';

const EditDiaryPagePage = ({ params }) => {
  const { id, pageId } = params;
  const router = useRouter();
  const [diary, setDiary] = useState(null);
  const [diaryPage, setDiaryPage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch diary details
        const diaryResponse = await diaryService.getById(id);
        
        if (diaryResponse.success && diaryResponse.data) {
          setDiary(diaryResponse.data);
          
          // Fetch diary page details
          const pageResponse = await diaryPageService.getPageDetails(pageId);
          
          if (pageResponse.success && pageResponse.data) {
            setDiaryPage(pageResponse.data);
          } else {
            console.error('Unexpected API response format:', pageResponse);
            setError('Failed to load diary page data. Please try again.');
          }
        } else {
          console.error('Unexpected API response format:', diaryResponse);
          setError('Failed to load diary data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, pageId]);

  const initialValues = {
    title: diaryPage?.title || '',
    content: diaryPage?.content || '',
    page_number: diaryPage?.page_number || '',
  };

  const validationSchema = Yup.object({
    title: Yup.string(),
    content: Yup.string().required('Content is required'),
    page_number: Yup.number().positive('Page number must be positive').required('Page number is required'),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await diaryService.updateDiaryPage(id, pageId, values);
      
      if (response.success) {
        router.push(`/diaries/${id}/pages/${pageId}`);
      } else {
        setError('Failed to update diary page. Please try again.');
      }
    } catch (err) {
      setError('Failed to update diary page. Please try again.');
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'title',
      label: 'Title (Optional)',
      type: 'text',
      placeholder: 'Enter page title',
    },
    {
      name: 'page_number',
      label: 'Page Number',
      type: 'number',
      placeholder: 'Enter page number',
      min: 1,
      required: true,
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      placeholder: 'Enter page content',
      rows: 10,
      required: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if ((!diary || !diaryPage) && !isLoading) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">Diary page not found</p>
            <div className="mt-4">
              <Link href={`/diaries/${id}`}>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Diary
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href={`/diaries/${id}/pages/${pageId}`}>
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Edit Diary Page
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Diary: {diary.title}
            </p>
          </div>
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

export default EditDiaryPagePage;
