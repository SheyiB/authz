import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleButton } from '../components/GoogleButton';
import { useAuth } from '../context/AuthContext';

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const redirectTo = () => {
    const state = location.state as { from?: { pathname?: string } } | undefined;
    return state?.from?.pathname ?? '/';
  };

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      setError('');
      await signInWithEmail(data.email, data.password);
      navigate(redirectTo(), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      navigate(redirectTo(), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    }
  };

  const containerClasses =
    'flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-slate-100 to-white px-4 py-16';
  const cardClasses = 'w-full max-w-lg rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur lg:p-12';
  const labelClasses = 'grid gap-1 text-base font-semibold text-slate-700';
  const inputClasses =
    'w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200';
  const errorTextClasses = 'text-base text-red-600';
  const primaryButtonClasses =
    'inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-3 text-base text-slate-600">
            Sign in to manage your account and continue where you left off.
          </p>
        </div>

        <GoogleButton className="mb-6 text-base" onClick={handleGoogleSignIn} disabled={isSubmitting}>
          Continue with Google
        </GoogleButton>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <label className={labelClasses}>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClasses}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className={errorTextClasses}>{errors.email.message}</span>}
          </label>

          <label className={labelClasses}>
            Password
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className={inputClasses}
              {...register('password', { required: 'Password is required', minLength: 6 })}
            />
            {errors.password && <span className={errorTextClasses}>Password must be at least 6 characters</span>}
          </label>

          {error && (
            <div className={`${errorTextClasses} rounded-lg border border-red-100 bg-red-50 px-3 py-2`}>{error}</div>
          )}

          <div className="space-y-4 text-base">
            <button className={primaryButtonClasses} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="flex flex-col items-center justify-between gap-2 text-slate-600 md:flex-row">
              <span>New here?</span>
              <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
