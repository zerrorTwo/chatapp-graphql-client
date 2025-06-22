'use client';

import { useLoading } from '../context/loadingContext';

const GlobalLoading = () => {
  const { isLoading } = useLoading();
  if (!isLoading) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50">
      <div className="loader border-t-4 border-b-4 border-[#8d7958] w-12 h-12 rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoading;