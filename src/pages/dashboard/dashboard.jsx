import FirstDashboard from "@/components/first-dashboard";
import SecondDashboard from "@/components/second-dashboard";
import ThirdDashboard from "@/components/third-dashboard";
import React from "react";

export default function dashboard() {
  return (
    <div className="w-full h-full flex flex-col items-center p-5  ">
      <div className="w-full">
        <h1 className="text-4xl pb-5 font-bold w-full text-start">Dashboard</h1>
      </div>
      <div className="w-full">
        <FirstDashboard />
      </div>
      <div className="w-full">
        <h2 className="mb-2 mt-5 text-xl font-bold text-green-800">
          Harakat tarkibining holatlari statistikasi
        </h2>
        <SecondDashboard />
      </div>
      <div className="w-full">
        <ThirdDashboard />
      </div>
    </div>
  );
}
