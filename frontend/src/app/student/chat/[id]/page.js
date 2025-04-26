'use client';

import { useEffect } from 'react';
import ChatInterface from '@/components/shared/ChatInterface';

export default function StudentChatDetailPage({ params }) {
  const chatId = params.id;

  return (
    <div className="h-[calc(100vh-6rem)]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Chat with Tutors</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-[calc(100%-3rem)]">
        <ChatInterface selectedChatId={chatId} userType="student" />
      </div>
    </div>
  );
}
