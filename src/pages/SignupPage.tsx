import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleButton } from '../components/GoogleButton';
import { StepIndicator } from '../components/StepIndicator';
import { useAuth } from '../context/AuthContext';

type SignupForm = {
	firstName: string;
	lastName: string;
	displayName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const steps = [
	{ id: 1, fields: ['firstName', 'lastName', 'displayName'] as const },
	{ id: 2, fields: ['email', 'password', 'confirmPassword'] as const },
	{ id: 3, fields: [] as const },
];

export function SignupPage() {
	const { registerWithEmail, signInWithGoogle } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		trigger,
		watch,
		getValues,
	} = useForm<SignupForm>({
		defaultValues: {
			firstName: '',
			lastName: '',
			displayName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});
	const navigate = useNavigate();
	const [stepIndex, setStepIndex] = useState(0);
	const [error, setError] = useState('');
	const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>(
		'forward'
	);

	const currentStep = steps[stepIndex];
	const totalSteps = steps.length;
	const preview = watch();

	const nextStep = async () => {
		const valid = await trigger(currentStep.fields);
		if (!valid) return;
		setStepDirection('forward');
		setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
	};

	const prevStep = () => {
		setStepDirection('backward');
		setStepIndex((prev) => Math.max(prev - 1, 0));
	};

	const onSubmit: SubmitHandler<SignupForm> = async (data) => {
		try {
			setError('');
			const displayName = data.displayName
				? data.displayName
				: `${data.firstName} ${data.lastName}`.trim();
			await registerWithEmail({
				email: data.email,
				password: data.password,
				displayName: displayName || undefined,
			});
			navigate('/', {
				replace: true,
				state: {
					verificationPrompt: {
						email: data.email,
						displayName: displayName || data.firstName,
					},
				},
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Sign up failed');
		}
	};

	const handleGoogleSignup = async () => {
		try {
			setError('');
			await signInWithGoogle();
			navigate('/', { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Google sign-in failed');
		}
	};

	const cardClasses =
		'w-full max-w-2xl rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur lg:p-12';
	const containerClasses =
		'flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-slate-100 to-white px-4 py-16';
	const labelClasses = 'grid gap-1 text-base font-semibold text-slate-700';
	const inputClasses =
		'w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200';
	const errorTextClasses = 'text-base text-red-600';
	const secondaryButtonClasses =
		'inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-70';
	const primaryButtonClasses =
		'inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-70';

	const stepAnimationClass =
		stepDirection === 'forward'
			? 'animate-slide-in-right'
			: 'animate-slide-in-left';

	return (
		<div className={containerClasses}>
			<div className={cardClasses}>
				<div className='mb-8 text-center'>
					<h1 className='text-4xl font-semibold text-slate-900'>
						Create your account
					</h1>
					<p className='mt-3 text-base text-slate-600'>
						Complete the steps below to join the platform.
					</p>
				</div>

				<GoogleButton
					className='mb-6 text-base'
					onClick={handleGoogleSignup}
					disabled={isSubmitting}
				>
					Sign up with Google
				</GoogleButton>

				<StepIndicator current={stepIndex + 1} total={totalSteps} />

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='space-y-6'
				>
					<div key={stepIndex} className={`${stepAnimationClass} grid gap-5`}>
						{stepIndex === 0 && (
							<div className='grid gap-5 md:grid-cols-2 md:gap-6'>
								<label className={`${labelClasses} md:col-span-1`}>
									First name
									<input
										type='text'
										placeholder='Ada'
										autoComplete='given-name'
										className={inputClasses}
										{...register('firstName', {
											required: 'First name is required',
										})}
									/>
									{errors.firstName && (
										<span className={errorTextClasses}>
											{errors.firstName.message}
										</span>
									)}
								</label>

								<label className={`${labelClasses} md:col-span-1`}>
									Last name
									<input
										type='text'
										placeholder='Doe'
										autoComplete='family-name'
										className={inputClasses}
										{...register('lastName', {
											required: 'Last name is required',
										})}
									/>
									{errors.lastName && (
										<span className={errorTextClasses}>
											{errors.lastName.message}
										</span>
									)}
								</label>

								<label className={`${labelClasses} md:col-span-2`}>
									Display name (optional)
									<input
										type='text'
										placeholder='John'
										autoComplete='nickname'
										className={inputClasses}
										{...register('displayName')}
									/>
								</label>
							</div>
						)}

						{stepIndex === 1 && (
							<div className='grid gap-5'>
								<label className={labelClasses}>
									Email address
									<input
										type='email'
										placeholder='you@example.com'
										autoComplete='email'
										className={inputClasses}
										{...register('email', {
											required: 'Email is required',
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: 'Enter a valid email address',
											},
										})}
									/>
									{errors.email && (
										<span className={errorTextClasses}>
											{errors.email.message}
										</span>
									)}
								</label>

								<label className={labelClasses}>
									Password
									<input
										type='password'
										placeholder='Create a strong password'
										autoComplete='new-password'
										className={inputClasses}
										{...register('password', {
											required: 'Password is required',
											minLength: {
												value: 6,
												message: 'Password must be at least 6 characters',
											},
										})}
									/>
									{errors.password && (
										<span className={errorTextClasses}>
											{errors.password.message}
										</span>
									)}
								</label>

								<label className={labelClasses}>
									Confirm password
									<input
										type='password'
										placeholder='Re-enter your password'
										autoComplete='new-password'
										className={inputClasses}
										{...register('confirmPassword', {
											validate: (value) =>
												value === getValues('password') ||
												'Passwords must match',
										})}
									/>
									{errors.confirmPassword && (
										<span className={errorTextClasses}>
											{errors.confirmPassword.message}
										</span>
									)}
								</label>
							</div>
						)}

						{stepIndex === 2 && (
							<div className='space-y-5 text-base text-slate-600'>
								<div className='flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700'>
									<span className='mt-1 h-2 w-2 rounded-full bg-emerald-500' />
									<p className='font-medium'>
										Almost there! Review your details before finishing sign up.
									</p>
								</div>
								<div className='rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6'>
									<p className='text-lg font-semibold text-slate-700'>
										Summary
									</p>
									<dl className='mt-4 space-y-3 text-base'>
										<div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
											<dt className='text-slate-500'>Name</dt>
											<dd className='text-slate-800'>
												{`${preview.firstName} ${preview.lastName}`.trim() ||
													'—'}
											</dd>
										</div>
										<div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
											<dt className='text-slate-500'>Email</dt>
											<dd className='text-slate-800'>
												{preview.email || 'Not provided yet'}
											</dd>
										</div>
										<div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
											<dt className='text-slate-500'>Display name</dt>
											<dd className='text-slate-800'>
												{preview.displayName || 'Will use your full name'}
											</dd>
										</div>
									</dl>
								</div>
							</div>
						)}
					</div>

					{error && (
						<div
							className={`${errorTextClasses} rounded-lg border border-red-100 bg-red-50 px-3 py-2`}
						>
							{error}
						</div>
					)}

					<div className='flex items-center justify-between gap-3'>
						{stepIndex > 0 ? (
							<button
								type='button'
								className={secondaryButtonClasses}
								onClick={prevStep}
								disabled={isSubmitting}
							>
								Back
							</button>
						) : (
							<span />
						)}

						{stepIndex + 1 === totalSteps ? (
							<button
								className={primaryButtonClasses}
								type='submit'
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Creating account…' : 'Finish sign up'}
							</button>
						) : (
							<button
								className={primaryButtonClasses}
								type='button'
								onClick={nextStep}
								disabled={isSubmitting}
							>
								Next
							</button>
						)}
					</div>
				</form>

				<div className='mt-10 flex justify-center gap-2 text-base text-slate-600'>
					<span>Already have an account?</span>
					<Link
						to='/login'
						className='font-semibold text-blue-600 hover:text-blue-700'
					>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
