import React, { useState } from "react";

const SuccessPage = () => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="min-w-1/3 border border-red-600 rounded-lg p-10 flex flex-col items-center gap-5">
        <h2 className="font-serif text-xl font-bold text-blue-900">
          Appointment has been scheduled
        </h2>
        <p className="text-sm text-gray-500">
          Copy the link below to access you meeting.
        </p>
        <div className="w-full">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`p-3.5 border rounded-lg text-sm text-gray-500 ${
                isCopied ? "bg-slate-200" : "bg-slate-50"
              }`}
            >
              http://trtpep.com/appointment/121346587
            </span>
            <button
              onClick={() => setIsCopied(!isCopied)}
              className="bg-red-600 text-white text-sm font-medium rounded-lg py-3.5 px-6"
              type="button"
            >
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
