// src/components/FileUploader.jsx
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUploader({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600 dark:text-gray-300">
        {isDragActive ? (
          <span>Drop your file here...</span>
        ) : (
          <>
            Drag & drop your timetable file here <br />
            or <span className="text-purple-600 underline">click to browse</span>
          </>
        )}
      </p>
    </div>
  );
}
