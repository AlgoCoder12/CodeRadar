import { Loader2 } from "lucide-react";
import { useState } from "react";

const FileUploader = ({ onFileUpload, onUpload, onCancel, selectedFile, loading }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
        disabled={loading}
      />
      <label htmlFor="file-upload" className={`cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""}`}>
        <div className="space-y-4">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your timetable here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse files
            </p>
          </div>
        </div>
      </label>
      {selectedFile && (
        <div className="mt-4 flex justify-center gap-4">
          <Button
            onClick={() => onUpload(selectedFile)}
            className="bg-purple-600 text-white flex items-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin h-4 w-4" />}
            Upload
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      )}
      {loading && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-purple-600" />
        </div>
      )}
    </div>
  );
};


export default FileUploader;