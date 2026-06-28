import React from "react";
import Loader from "./Loader";

const LoaderWithMessage = ({
  message = "Loading...",
  size = "medium",
  showMessage = true,
  variant = "page", // page | inline
}) => {
  const messageSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  if (variant === "inline") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Loader />
        {showMessage && (
          <p
            className={`font-medium text-gray-600 ${
              messageSizeClasses[size] || messageSizeClasses.medium
            }`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <Loader />
        {showMessage && (
          <span
            className={`font-medium text-slate-700 ${
              messageSizeClasses[size] || messageSizeClasses.medium
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoaderWithMessage;