'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import FormikForm from '@/components/forms/FormikForm';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const initialValues = {
    email: 'admin@example.com',
    password: 'Admin123!',
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      const result = await login(values.email, values.password);

      if (!result.success) {
        setError(result.message);
      }
      // No need to redirect here as it's handled in the login function
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
    },
    {
      name: 'rememberMe',
      type: 'checkbox',
      checkboxLabel: 'Remember me',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-xl"
      >
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            헬로 잉글리시
          </h1>
          <h2 className="mt-2 text-center text-xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        <FormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={formFields}
          submitButtonText="Sign in"
          isSubmitting={isSubmitting}
          error={error}
        />

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Forgot your password?
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
