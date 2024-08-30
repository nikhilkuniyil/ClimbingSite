"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from '../lib/auth/AuthContext'; // Adjust the path as needed
import Modal from 'react-modal';

export default function UserProfile() {
  const { user } = useAuth(); // Get the current user from context
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = getAuth();

  const handleDeleteAccount = async () => {
    if (user) {
      setShowModal(true);
    } else {
      setError("No user is currently signed in.");
    }
  };

  const confirmDeleteAccount = async () => {
    if (user) {
      try {
        await deleteUser(user);
        setSuccess("Your account has been successfully deleted.");
        setShowModal(false);
        router.push('/goodbye'); // Redirect after account deletion
      } catch (error: any) {
        console.error("Error deleting account:", error);
        if (error.code === "auth/requires-recent-login") {
          setError("To delete your account, please re-authenticate and try again.");
          setShowReauthModal(true);
        } else {
          setError("Failed to delete account. Please try again.");
        }
      }
    }
  };

  const handleReauthenticate = async () => {
    if (user) {
      try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        setShowReauthModal(false);
        setError(null);
        setSuccess('Re-authentication successful. You can now delete your account.');
        handleDeleteAccount();
      } catch (error: any) {
        console.error("Error re-authenticating:", error);
        setError("Failed to re-authenticate. Please check your credentials and try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">User Profile</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <button
        onClick={handleDeleteAccount}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Delete Account
      </button>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Confirm Account Deletion"
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
        <p className="text-black">Are you sure you want to delete your account? This action cannot be undone.</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </Modal>

      {/* Re-authentication Modal */}
      <Modal
        isOpen={showReauthModal}
        onRequestClose={() => setShowReauthModal(false)}
        contentLabel="Re-authenticate"
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4 text-black">Re-authenticate</h2>
        <p className="text-black">For security reasons, please enter your credentials again to delete your account.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 p-2 border border-gray-300 rounded w-full text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-4 p-2 border border-gray-300 rounded w-full text-black"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleReauthenticate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Re-authenticate
          </button>
        </div>
      </Modal>
    </div>
  );
}
