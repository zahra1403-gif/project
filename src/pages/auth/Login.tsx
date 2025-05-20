import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface LoginFormValues {
  identifier: string; // Can be username or email
  password: string;
}

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>();

  // 🧠 Load last used identifier
  useEffect(() => {
    const lastIdentifier = localStorage.getItem('lastIdentifier');
    if (lastIdentifier) {
      setValue('identifier', lastIdentifier);
    }
  }, [setValue]);

  // 🧠 Handle role-based redirect
  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin-dashboard');
    else if (user?.role === 'cashier') navigate('/cashier');
    else if (user?.role === 'assistant') navigate('/assistant');
    else if (user) navigate('/dashboard');
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.identifier, data.password);
      localStorage.setItem('lastIdentifier', data.identifier); // Save for next time
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  // 🎹 Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') handleSubmit(onSubmit)();
  };

  return (
    <div className={`mt-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className={`py-8 px-4 shadow sm:rounded-lg sm:px-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Login to Bikou</h2>
          <button
            className="text-sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyPress}>
          {/* Identifier (username or email) */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
              {...register('identifier', { required: 'This field is required' })}
            />
            {errors.identifier && <p className="text-sm text-red-500">{errors.identifier.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-primary-600 mt-1"
            >
              {showPassword ? 'Hide password' : 'Show password'}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        {/* Future QR Code login (UI Placeholder) */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Or login using </span>
          <button
            className="ml-1 text-primary-600 hover:underline"
            onClick={() => toast('QR Login coming soon!')}
          >
            QR Code
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-6">
          <Link
            to="/register"
            className="block text-center text-sm text-primary-600 hover:underline"
          >
            New to Bikou? Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
