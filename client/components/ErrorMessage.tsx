import React from "react";

interface ErrorMessageProps {
  errors: string | string[];
}

const ErrorMessage = ({ errors }: ErrorMessageProps) => {
  const errorList = Array.isArray(errors) ? errors : [errors];

  return (
    <ul>
      {errorList.map((err, i) => (
        <li key={i} className="text-sm text-red-400 mb-1 text-center">
          {err}
        </li>
      ))}
    </ul>
  );
};

export default ErrorMessage;
