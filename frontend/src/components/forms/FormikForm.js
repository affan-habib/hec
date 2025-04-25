'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FiAlertCircle } from 'react-icons/fi';

const FormikForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitButtonText = 'Submit',
  isSubmitting,
  error,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting: formikSubmitting, errors, touched }) => (
        <Form className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <Field
                  as="textarea"
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  disabled={field.disabled || isSubmitting || formikSubmitting}
                  rows={field.rows || 4}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors[field.name] && touched[field.name]
                      ? 'border-red-500'
                      : ''
                  }`}
                />
              ) : field.type === 'select' ? (
                <Field
                  as="select"
                  id={field.name}
                  name={field.name}
                  disabled={field.disabled || isSubmitting || formikSubmitting}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors[field.name] && touched[field.name]
                      ? 'border-red-500'
                      : ''
                  }`}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              ) : field.type === 'checkbox' ? (
                <div className="mt-1">
                  <Field
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    disabled={field.disabled || isSubmitting || formikSubmitting}
                    className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 ${
                      errors[field.name] && touched[field.name]
                        ? 'border-red-500'
                        : ''
                    }`}
                  />
                  <label
                    htmlFor={field.name}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {field.checkboxLabel}
                  </label>
                </div>
              ) : field.type === 'radio' ? (
                <div className="mt-1 space-y-2">
                  {field.options.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <Field
                        type="radio"
                        id={`${field.name}-${option.value}`}
                        name={field.name}
                        value={option.value}
                        disabled={
                          field.disabled || isSubmitting || formikSubmitting
                        }
                        className={`h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 ${
                          errors[field.name] && touched[field.name]
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                      <label
                        htmlFor={`${field.name}-${option.value}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              ) : field.type === 'file' ? (
                <div className="mt-1">
                  <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    onChange={(event) => {
                      field.onChange(event, field.setFieldValue);
                    }}
                    disabled={field.disabled || isSubmitting || formikSubmitting}
                    accept={field.accept}
                    className={`block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300 ${
                      errors[field.name] && touched[field.name]
                        ? 'border-red-500'
                        : ''
                    }`}
                  />
                </div>
              ) : (
                <Field
                  type={field.type || 'text'}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  disabled={field.disabled || isSubmitting || formikSubmitting}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors[field.name] && touched[field.name]
                      ? 'border-red-500'
                      : ''
                  }`}
                />
              )}

              <ErrorMessage
                name={field.name}
                component="p"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              />

              {field.helpText && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {field.helpText}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || formikSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isSubmitting || formikSubmitting) ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormikForm;
