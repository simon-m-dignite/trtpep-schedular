import React from "react";

const DashboardPage = () => {
  return (
    <main
      id="dashboard-main"
      className="h-[calc(100vh-10rem)] overflow-auto px-4 py-10"
    >
      <h1 className="text-2xl font-black text-gray-800">Good Morning!</h1>
      <p className="mb-6 text-gray-600">
        Here's an overview of your monthly transactions.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-8">
        <div className="h-56 w-72 rounded-xl bg-white p-10 shadow-md"></div>
        <div className="h-56 w-72 rounded-xl bg-white p-10 shadow-md"></div>
        <div className="h-56 w-full rounded-xl bg-white p-10 shadow-md"></div>
        <div className="h-56 w-full rounded-xl bg-white p-10 shadow-md"></div>
        <div className="h-56 w-full rounded-xl bg-white p-10 shadow-md"></div>
      </div>
    </main>
  );
};

export default DashboardPage;
