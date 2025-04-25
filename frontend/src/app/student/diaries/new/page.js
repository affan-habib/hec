'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const NewDiaryPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    title: '',
    description: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      // In a real app, this would be an API call to create a diary
      console.log('Creating diary:', values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the diaries page
      router.push('/student/diaries');
    } catch (err) {
      setError('Failed to create diary. Please try again.');
      console.error('Creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/student/diaries">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create New Diary
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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <Field
                    type="text"
                    name="title"
                    id="title"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                    placeholder="Enter diary title"
                  />
                  <ErrorMessage name="title">
                    {(msg) => <div className="mt-1 text-sm text-red-600 dark:text-red-400">{msg}</div>}
                  </ErrorMessage>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <div className="mt-1">
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                    placeholder="Enter diary description"
                  />
                  <ErrorMessage name="description">
                    {(msg) => <div className="mt-1 text-sm text-red-600 dark:text-red-400">{msg}</div>}
                  </ErrorMessage>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/student/diaries">
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
                    'Create Diary'
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

export default NewDiaryPage;
