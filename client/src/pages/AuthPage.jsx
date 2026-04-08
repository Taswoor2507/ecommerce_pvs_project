import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { FormField } from '../components/forms';
import Button from '../components/ui/Button';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // We use the appropriate schema depending on the mode
  const methods = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  const { handleSubmit, reset, formState: { isValid } } = methods;

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset({ name: '', email: '', password: '' });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login({ email: data.email, password: data.password });
        navigate(from, { replace: true });
      } else {
        await register(data);
        setIsLogin(true); // Switch to login after successful register
        reset({ ...data, password: '' }); // Clear password
      }
    } catch {
       // Handled by context (toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isLogin 
              ? 'Enter your credentials to access your account'
              : 'Sign up for a new account'}
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!isLogin && (
              <FormField
                name="name"
                label="Name"
                placeholder="John Doe"
                disabled={isLoading}
                required
              />
            )}
            
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              required
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              className="w-full py-3"
              isLoading={isLoading}
              disabled={isLoading || !isValid}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </FormProvider>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            type="button"
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            {isLogin ? 'Register here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
}
