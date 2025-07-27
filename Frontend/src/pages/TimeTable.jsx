// src/pages/TimeTablePage.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FileUploader from "../components/FileUploader";

export default function TimeTablePage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (file) => {
    console.log("Uploaded file:", file);
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-12 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload Your Time Table</h1>
        <h2 className="text-xl font-bold mb-6 text-center">To get the notifaction of your lecture...</h2>

        <FileUploader onFileUpload={handleFileUpload} />

        {selectedFile && (
          <div className="mt-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-lg font-semibold mb-2">File Info:</h2>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> {selectedFile.type}</p>
          </div>
        )}
        <div className="flex justify-center items-center"> 
          <Button className=" mt-10   bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3  font-bold transitiontext-lg rounded-full shadow-md">
          Get Notification 🔔
          </Button>
          </div>
      </div>
    </div>
  );
}
