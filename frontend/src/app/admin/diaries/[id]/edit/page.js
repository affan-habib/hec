'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import FormikForm from '@/components/forms/FormikForm';
import diaryService from '@/services/diaryService';

const EditDiaryPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [diary, setDiary] = useState(null);
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
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
        } else {
          console.error('Unexpected API response format:', diaryResponse);
          setError('Failed to load diary data. Please try again.');
        }
        
        // Fetch students and tutors for dropdown options
        const studentsResponse = await fetch('/api/students?limit=100');
        const tutorsResponse = await fetch('/api/tutors?limit=100');
        
        const studentsData = await studentsResponse.json();
        const tutorsData = await tutorsResponse.json();
        
        if (studentsData.success && studentsData.data) {
          if (Array.isArray(studentsData.data.students)) {
            setStudents(studentsData.data.students);
          } else if (Array.isArray(studentsData.data)) {
            setStudents(studentsData.data);
          }
        }
        
        if (tutorsData.success && tutorsData.data) {
          if (Array.isArray(tutorsData.data.tutors)) {
            setTutors(tutorsData.data.tutors);
          } else if (Array.isArray(tutorsData.data)) {
            setTutors(tutorsData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const initialValues = {
    title: diary?.title || '',
    description: diary?.description || '',
    student_id: diary?.student_id || '',
    tutor_id: diary?.tutor_id || '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    student_id: Yup.number().required('Student is required'),
    tutor_id: Yup.number().nullable(),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await diaryService.update(id, values);
      
      if (response.success) {
        router.push(`/diaries/${id}`);
      } else {
        setError('Failed to update diary. Please try again.');
      }
    } catch (err) {
      setError('Failed to update diary. Please try again.');
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter diary title',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter diary description',
      rows: 3,
    },
    {
      name: 'student_id',
      label: 'Student',
      type: 'select',
      options: [
        { value: '', label: 'Select a student' },
        ...students.map((student) => ({
          value: student.id,
          label: `${student.first_name} ${student.last_name}`,
        })),
      ],
      required: true,
    },
    {
      name: 'tutor_id',
      label: 'Tutor (Optional)',
      type: 'select',
      options: [
        { value: '', label: 'Select a tutor' },
        ...tutors.map((tutor) => ({
          value: tutor.id,
          label: `${tutor.first_name} ${tutor.last_name}`,
        })),
      ],
    },
  ];

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
              <Link href="/admin/diaries">
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
          <Link href={`/diaries/${id}`}>
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Diary
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

export default EditDiaryPage;
