import { ArrowBigLeft } from "lucide-react";
import React from "react";

export default function GoBack() {
  return (
    <div>
      <button
        className="bg-black text-white py-2 px-4 rounded-full flex items-center justify-center hover:bg-gray-800"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft className="w-6 h-6" />
      </button>
    </div>
  );
}
