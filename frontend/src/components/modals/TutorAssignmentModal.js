'use client';

import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiCheck } from 'react-icons/fi';
import tutorService from '@/services/tutorService';
import diaryService from '@/services/diaryService';

const TutorAssignmentModal = ({ isOpen, onClose, diaryId, currentTutorId, onAssign }) => {
  // Initialize tutors as an empty array
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTutorId, setSelectedTutorId] = useState(currentTutorId || null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await tutorService.getAll();
        console.log('Tutor response:', response); // Debug log

        if (response.success) {
          // Handle different response structures
          let tutorData = [];

          if (response.data && response.data.tutors) {
            // If data is nested in a 'tutors' property
            tutorData = response.data.tutors;
          } else if (Array.isArray(response.data)) {
            // If data is directly an array
            tutorData = response.data;
          } else if (response.data) {
            // If data is something else, try to make it an array
            tutorData = [response.data];
          }

          console.log('Processed tutor data:', tutorData);
          setTutors(tutorData);
        } else {
          console.error('Failed to fetch tutors:', response.message);
          setTutors([]);
        }
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setTutors([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTutors();
      setSelectedTutorId(currentTutorId || null);
    }
  }, [isOpen, currentTutorId]);

  const handleAssignTutor = async () => {
    try {
      setIsAssigning(true);
      const response = await diaryService.assignTutor(diaryId, selectedTutorId);
      if (response.success) {
        onAssign(response.data);
        onClose();
      } else {
        console.error('Failed to assign tutor:', response.message);
        alert('Failed to assign tutor. Please try again.');
      }
    } catch (error) {
      console.error('Error assigning tutor:', error);
      alert('An error occurred while assigning the tutor. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  // Initialize tutors as an empty array if it's not already an array
  const tutorArray = Array.isArray(tutors) ? tutors : [];

  const filteredTutors = tutorArray.filter(tutor => {
    if (!tutor || !tutor.first_name || !tutor.last_name) return false;
    const fullName = `${tutor.first_name} ${tutor.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Assign Tutor to Diary
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search tutors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : filteredTutors.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredTutors.map((tutor) => (
                        <li key={tutor.id} className="py-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`tutor-${tutor.id}`}
                              name="tutor"
                              value={tutor.id}
                              checked={selectedTutorId === tutor.id}
                              onChange={() => setSelectedTutorId(tutor.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label
                              htmlFor={`tutor-${tutor.id}`}
                              className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    {tutor.profile_image ? (
                                      <img
                                        src={tutor.profile_image}
                                        alt={`${tutor.first_name} ${tutor.last_name}`}
                                        className="h-10 w-10 rounded-full"
                                      />
                                    ) : (
                                      <span className="text-lg font-medium">
                                        {tutor.first_name.charAt(0)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {tutor.first_name} {tutor.last_name}
                                  </p>
                                  {tutor.tutorProfile && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {tutor.tutorProfile.specialization || 'General Tutor'}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No tutors found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAssignTutor}
              disabled={isAssigning || selectedTutorId === null}
            >
              {isAssigning ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                  Assigning...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiCheck className="mr-2 h-4 w-4" />
                  Assign Tutor
                </span>
              )}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorAssignmentModal;
