import FirstDashboard from "@/components/first-dashboard";
import FourthDashboard from "@/components/fourth-dashboard";
import SecondDashboard from "@/components/second-dashboard";
import ThirdDashboard from "@/components/third-dashboard";
import React from "react";

export default function dashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-5 ">
      <div className="w-full">
        <FirstDashboard />
      </div>
      <div className="w-full pt-7">
        {/* <h2 className="pb-3 mt-5 text-xl font-bold text-green-800">
          Harakat tarkibining holatlari statistikasi
        </h2> */}
        <SecondDashboard />
      </div>
      <div className="w-full mt-10">
        <ThirdDashboard />
      </div>
      <div className="w-full">
        <FourthDashboard />
      </div>
    </div>
  );
}
