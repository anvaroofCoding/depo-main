import React from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function GoBack() {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <motion.button
      onClick={handleGoBack}
      className="flex items-center gap-2 
                 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 
                 text-white py-2.5 px-6 
                 rounded-full shadow-md 
                 hover:shadow-lg hover:brightness-110 
                 transition-all duration-300 ease-out"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="text-sm font-medium tracking-wide">Ortga qaytish</span>
    </motion.button>
  );
}
