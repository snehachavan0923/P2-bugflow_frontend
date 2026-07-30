import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        {title && <h2 className="mb-4 text-xl font-semibold text-slate-950">{title}</h2>}
        {children}
        <button
          onClick={onClose}
          className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;