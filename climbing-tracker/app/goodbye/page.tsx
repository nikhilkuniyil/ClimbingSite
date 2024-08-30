"use client";

import { useRouter } from 'next/navigation';

export default function Goodbye() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">Goodbye!</h1>
      <p className="mb-4 text-black">Thank you for using our service. We hope to see you again!</p>
      <div className="flex">
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
        >
          Return to Home
        </button>
        <button
          onClick={() => router.push('/contact')}
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
