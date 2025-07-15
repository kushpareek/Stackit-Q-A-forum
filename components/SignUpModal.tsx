
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { XIcon, SpinnerIcon } from './icons';

interface SignUpModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup({ name, email, password });
      onClose();
    } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
            setError('A user with this email already exists. Please log in.');
        } else {
            setError(err.message || 'Failed to create an account.');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Sign Up</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
           <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
             <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex justify-center items-center"
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SpinnerIcon className="w-5 h-5"/> : 'Create Account'}
          </button>
          <div className="text-center text-sm text-slate-500">
            <p>
              Already have an account?{' '}
              <button type="button" onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">
                Log In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;