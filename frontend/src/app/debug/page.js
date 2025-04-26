'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function DebugPage() {
  const { user, loading } = useAuth();
  const [cookieUser, setCookieUser] = useState(null);
  
  useEffect(() => {
    try {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        setCookieUser(JSON.parse(userCookie));
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">User from useAuth hook:</h2>
        {user ? (
          <div>
            <pre className="bg-gray-200 p-4 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
            <p className="mt-4 text-lg">
              <strong>Role:</strong> {user.role || 'No role found'}
            </p>
          </div>
        ) : (
          <p>No user is logged in</p>
        )}
      </div>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">User from cookies:</h2>
        {cookieUser ? (
          <div>
            <pre className="bg-gray-200 p-4 rounded overflow-auto">
              {JSON.stringify(cookieUser, null, 2)}
            </pre>
            <p className="mt-4 text-lg">
              <strong>Role:</strong> {cookieUser.role || 'No role found'}
            </p>
          </div>
        ) : (
          <p>No user cookie found</p>
        )}
      </div>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">All cookies:</h2>
        <pre className="bg-gray-200 p-4 rounded overflow-auto">
          {JSON.stringify(Cookies.get(), null, 2)}
        </pre>
      </div>
    </div>
  );
}
