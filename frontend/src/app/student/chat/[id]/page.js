'use client';

import { use } from 'react';
import ChatInterface from '@/components/shared/ChatInterface';

export default function StudentChatDetailPage({ params }) {
  // Use React.use() to unwrap the params promise
  const unwrappedParams = use(params);
  const chatId = unwrappedParams.id;

  console.log('Student Chat Detail Page - Chat ID:', chatId);

  return (
    <div className="h-[calc(100vh-6rem)]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Chat with Tutors</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-[calc(100%-3rem)]">
        <ChatInterface selectedChatId={chatId} userType="student" />
      </div>
    </div>
  );
}
