"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from "../lib/firebase";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    setError(null);
    setSuccess(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with first name, last name, and profile picture
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: profilePicturePreview // This would ideally be a URL after uploading the image to storage
      });

      console.log('Account created successfully:', user);
      setSuccess('Account created successfully!');
      // Redirect the user to the /climbs page
      router.push('/climbs');
    } catch (error: any) {
      console.error('Error creating account:', error);
      setError(error.message);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file)); // Create a local URL for preview
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">Create an Account</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Profile Picture Preview */}
      <div className="mb-4 relative flex flex-col items-center">
        {profilePicturePreview ? (
          <img
            src={profilePicturePreview}
            alt="Profile Preview"
            className="rounded-full w-32 h-32 object-cover"
          />
        ) : (
          <div className="rounded-full w-32 h-32 bg-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5c4.694 0 8.5 3.806 8.5 8.5s-3.806 8.5-8.5 8.5-8.5-3.806-8.5-8.5 3.806-8.5 8.5-8.5zM15 12.75L9 18m0-5.25l-3 3M21 12l-1.5-1.5m-6 6l1.5-1.5M15 9l3 3m0 0l1.5-1.5"
              />
            </svg>
          </div>
        )}

        {/* Input field for file upload, aligned below the profile picture */}
        <input
          type="file"
          onChange={handleProfilePictureChange}
          className="mt-2 cursor-pointer"
          accept="image/*"
          style={{ marginLeft: '75px' }} // Adjusts the position of the file input button
        />
      </div>

      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        className="mb-4 p-2 border border-gray-300 rounded w-64 text-black"
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        className="mb-4 p-2 border border-gray-300 rounded w-64 text-black"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mb-4 p-2 border border-gray-300 rounded w-64 text-black"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mb-4 p-2 border border-gray-300 rounded w-64 text-black"
      />
      <button
        onClick={handleSignUp}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
    </div>
  );
}
