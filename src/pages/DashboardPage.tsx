import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
	const { user, signOutUser } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const [now, setNow] = useState(() => new Date());
	const [showVerificationPrompt, setShowVerificationPrompt] = useState(() =>
		Boolean(location.state?.verificationPrompt)
	);

	const verificationDetails = location.state?.verificationPrompt as
		| { email: string; displayName?: string }
		| undefined;

	useEffect(() => {
		const interval = window.setInterval(() => setNow(new Date()), 1000);
		return () => window.clearInterval(interval);
	}, []);

	useEffect(() => {
		if (verificationDetails) {
			navigate(location.pathname, { replace: true, state: null });
		}
	}, [verificationDetails, navigate, location.pathname]);

	useEffect(() => {
		if (!showVerificationPrompt && verificationDetails) {
			setShowVerificationPrompt(true);
		}
	}, [showVerificationPrompt, verificationDetails]);

	const formattedDate = useMemo(() => {
		return new Intl.DateTimeFormat(undefined, {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(now);
	}, [now]);

	const formattedTime = useMemo(() => {
		return new Intl.DateTimeFormat(undefined, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		}).format(now);
	}, [now]);

	const displayName =
		user?.displayName?.trim() ||
		verificationDetails?.displayName ||
		user?.email?.split('@')[0] ||
		'Explorer';
	const firstName = displayName.split(' ')[0] || displayName;
	const avatarInitial = displayName.charAt(0).toUpperCase() || 'U';

	const quickStats = [
		{
			title: 'Email status',
			value: user?.emailVerified ? 'Verified' : 'Pending verification',
			tone: user?.emailVerified
				? 'text-emerald-600 bg-emerald-50 border-emerald-200'
				: 'text-amber-600 bg-amber-50 border-amber-200',
			icon: user?.emailVerified ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					fill='currentColor'
					className='h-5 w-5'
				>
					<path
						fillRule='evenodd'
						d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 7.97a.75.75 0 0 0-1.06-1.06L11 13.38l-1.72-1.72a.75.75 0 1 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.75-4.75Z'
						clipRule='evenodd'
					/>
				</svg>
			) : null,
		} as const,
		{
			title: 'Last sign-in',
			value: user?.metadata?.lastSignInTime
				? new Date(user.metadata.lastSignInTime).toLocaleString()
				: 'First session',
			tone: 'text-blue-700 bg-blue-50 border-blue-200',
		} as const,
	];

	return (
		<div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-slate-100 to-white px-4 py-16'>
			<div className='w-full max-w-4xl rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur lg:p-12'>
				<div className='flex flex-col items-center gap-6 text-center'>
					<div className='flex flex-col items-center gap-4'>
						<div className='flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-4xl font-bold text-white shadow-lg sm:h-28 sm:w-28 sm:text-5xl'>
							{avatarInitial}
						</div>
						<div>
							<p className='text-base text-slate-500'>Welcome back</p>
							<h1 className='text-4xl font-semibold text-slate-900 sm:text-5xl'>
								{firstName}
							</h1>
							<div className='mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm md:text-base'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='currentColor'
									className='h-4 w-4 md:h-5 md:w-5'
									aria-hidden
								>
									<path d='M2.25 6.75c0-1.242 1.008-2.25 2.25-2.25h15c1.242 0 2.25 1.008 2.25 2.25v10.5c0 1.242-1.008 2.25-2.25 2.25h-15c-1.242 0-2.25-1.008-2.25-2.25V6.75Zm2.25-.75a.75.75 0 0 0-.75.75v.153l8.25 4.583 8.25-4.583V6.75a.75.75 0 0 0-.75-.75h-15Zm15.75 3.195-7.694 4.278a.75.75 0 0 1-.712 0L4.5 9.195v8.055a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V9.195Z' />
								</svg>
								<span className='break-all text-left'>
									{user?.email ?? 'No email on file'}
								</span>
							</div>
							<p className='mt-2 text-sm text-slate-600 md:text-base'>
								Today is {formattedDate}. The current time is {formattedTime}.
							</p>
						</div>
					</div>

					{showVerificationPrompt && !user?.emailVerified && (
						<div className='w-full max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-left text-amber-700 shadow-sm'>
							<p className='font-semibold'>Verify your email</p>
							<p className='mt-1 text-sm text-amber-700 md:text-base'>
								We sent a confirmation link to{' '}
								<span className='font-semibold'>
									{verificationDetails?.email}
								</span>
								. Please check your inbox (and spam folder) to verify your
								account.
							</p>
						</div>
					)}
				</div>

				<div className='mt-10 grid w-full max-w-3xl gap-5 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-2 xl:max-w-5xl mx-auto'>
					{quickStats.map((stat) => (
						<div
							key={stat.title}
							className={`rounded-2xl border px-5 py-6 text-left shadow-sm ${stat.tone}`}
						>
							<p className='text-sm font-medium uppercase tracking-[0.2em] text-slate-500/80'>
								{stat.title}
							</p>
							<div className='mt-3 flex items-center gap-2'>
								{stat.icon}
								<p className='text-xl font-semibold break-words'>
									{stat.value}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-600 md:flex-row md:text-base'>
					<div>
						<p className='font-semibold text-slate-800'>Need a break?</p>
						<p>Sign out safely and come back whenever you’re ready.</p>
					</div>
					<button
						className='inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
						type='button'
						onClick={signOutUser}
					>
						Sign out
					</button>
				</div>
			</div>
		</div>
	);
}
