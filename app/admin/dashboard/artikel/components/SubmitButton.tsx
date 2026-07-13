'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  confirmMessage?: string;
}

export default function SubmitButton({ label, loadingLabel = "Saving...", confirmMessage }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      e.preventDefault();
    }
  };

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={handleClick}
      className={`w-full font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
        pending
          ? 'bg-blue-400 text-gray-100 cursor-not-allowed opacity-75'
          : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
      }`}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}