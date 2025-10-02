import FirstDashboard from "@/components/first-dashboard";
import SecondDashboard from "@/components/second-dashboard";
import React from "react";

export default function dashboard() {
  return (
    <div className="w-full h-full flex flex-col items-center p-5  ">
      <div className="w-full">
        <FirstDashboard />
      </div>
      <div className="w-full">
        <SecondDashboard />
      </div>
    </div>
  );
}
