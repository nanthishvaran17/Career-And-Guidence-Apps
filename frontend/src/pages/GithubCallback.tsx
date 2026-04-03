import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export function GithubCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleGithubLogin = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        setError('No authorization code received from GitHub.');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/github/callback?code=${code}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'GitHub Authentication failed');
        }

        // Successfully logged in via GitHub
        const loginAt = new Date().toISOString();
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        localStorage.setItem('userId', String(data.user.id));
        localStorage.setItem('userName', data.user.name || '');
        localStorage.setItem('userEmail', data.user.email || '');
        localStorage.setItem('loginAt', loginAt);

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Github Login Error:', err);
        setError(err.message || 'Something went wrong during GitHub login.');
      }
    };

    handleGithubLogin();
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full h-12 gradient-primary rounded-xl text-white font-semibold"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Authenticating with GitHub...</h2>
        <p className="text-gray-500 mt-2">Setting up your secure session</p>
      </div>
    </div>
  );
}
