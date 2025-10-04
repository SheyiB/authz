import { ReactNode } from 'react';

type GoogleButtonProps = {
  onClick: () => void;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function GoogleButton({ onClick, children, disabled, className }: GoogleButtonProps) {
  const baseClasses =
    'inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <button
      type="button"
      className={className ? `${baseClasses} ${className}` : baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 48 48"
        aria-hidden
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.43-5.43C33.89 3.91 29.45 2 24 2 14.82 2 6.94 7.73 3.67 15.44l6.65 5.17C11.85 14.64 17.44 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.5 24c0-1.64-.15-3.22-.43-4.76H24v9.04h12.7c-.55 2.91-2.19 5.38-4.66 7.04l7.27 5.65C43.78 37.64 46.5 31.27 46.5 24z"
        />
        <path
          fill="#FBBC05"
          d="M10.32 28.61a9.02 9.02 0 0 1-.47-2.86c0-.99.17-1.95.47-2.86l-6.65-5.17A21.94 21.94 0 0 0 2 24c0 3.54.85 6.88 2.32 9.86l6-5.25z"
        />
        <path
          fill="#34A853"
          d="M24 46c5.45 0 9.89-1.8 13.19-4.9l-7.27-5.65C28.27 36.49 26.27 37 24 37c-6.56 0-12.15-5.14-13.68-12.11l-6.65 5.17C6.94 40.27 14.82 46 24 46z"
        />
        <path fill="none" d="M2 2h44v44H2z" />
      </svg>
      {children ?? 'Continue with Google'}
    </button>
  );
}
