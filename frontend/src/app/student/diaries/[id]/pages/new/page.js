'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft, FiUpload, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const NewDiaryPagePage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [diary, setDiary] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        // Mock data for now - in a real app, this would be fetched from the API
        const mockDiary = {
          id: parseInt(id),
          title: 'My English Journey',
          description: 'A diary about my progress learning English',
          created_at: '2023-08-01T10:30:00Z',
          updated_at: '2023-08-15T10:30:00Z',
          pages_count: 5
        };

        setDiary(mockDiary);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching diary:', error);
        setError('Failed to load diary data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDiary();
  }, [id]);

  const initialValues = {
    title: '',
    content: '',
    page_number: '',
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
      // In a real app, this would be an API call to create a diary page
      console.log('Creating diary page:', values);
      
      // If there's an image, upload it
      if (selectedImage) {
        console.log('Uploading image:', selectedImage);
        // In a real app, this would be an API call to upload the image
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the diary page
      router.push(`/student/diaries/${id}`);
    } catch (err) {
      setError('Failed to create diary page. Please try again.');
      console.error('Creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!diary && !isLoading) {
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
            <p className="text-sm text-yellow-700 dark:text-yellow-400">Diary not found</p>
            <div className="mt-4">
              <Link href="/student/diaries">
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Diaries
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
          <Link href={`/student/diaries/${id}`}>
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Add New Page
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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title (Optional)
                  </label>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="title"
                      id="title"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                      placeholder="Enter page title"
                    />
                    <ErrorMessage name="title">
                      {(msg) => <div className="mt-1 text-sm text-red-600 dark:text-red-400">{msg}</div>}
                    </ErrorMessage>
                  </div>
                </div>

                <div>
                  <label htmlFor="page_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Page Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <Field
                      type="number"
                      name="page_number"
                      id="page_number"
                      min="1"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                      placeholder="Enter page number"
                    />
                    <ErrorMessage name="page_number">
                      {(msg) => <div className="mt-1 text-sm text-red-600 dark:text-red-400">{msg}</div>}
                    </ErrorMessage>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <Field
                    as="textarea"
                    name="content"
                    id="content"
                    rows={10}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                    placeholder="Write your diary entry here..."
                  />
                  <ErrorMessage name="content">
                    {(msg) => <div className="mt-1 text-sm text-red-600 dark:text-red-400">{msg}</div>}
                  </ErrorMessage>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add Image (Optional)
                </label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                    Upload Image
                  </label>
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Link href={`/student/diaries/${id}`}>
                  <button
                    type="button"
                    className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                  className={`inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    (isSubmitting || formikSubmitting) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {(isSubmitting || formikSubmitting) ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Page'
                  )}
                </motion.button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewDiaryPagePage;
