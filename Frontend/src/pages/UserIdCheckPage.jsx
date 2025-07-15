import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

// Platform details with logos
const platforms = [
  {
    name: "leetcode",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
  },
  {
    name: "codeforces",
    logo: "https://tinyurl.com/mvywhztr",
  },
  {
    name: "codechef",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcv_WJfqB-tC3ZFADRoUMMMTtOA6ZzyAA6g&s",
  },
  {
    name: "topcoder",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8zAQWiyyKXkXygCCWUz_01xvVCxWOCpTsjQ&s",
  },
  {
    name: "hackerrank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png",
  },
];

const getPlatformLogo = (platform) => {
  const entry = platforms.find(
    (p) => p.name.toLowerCase() === platform.toLowerCase()
  );
  return entry?.logo || "";
};

export default function UserIdCheckPage() {
  const { platform } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {token, url} = useAuth();
  useEffect(() => {
    // If still loading auth, wait
    if (authLoading) return;

    // If not logged in, show error (form will display the message)
    if (!user) {
      setError("⚠️ Please login first to continue.");
    }
  }, [authLoading, user]);

  // "codeforcesHandle": "abhik_01",
  //   "leetcodeHandle": "dvmnabhi",
  //   "codechefHandle": "dvmnabhi",
  //   "atcoderHandle": null,
  //   "hackerrankHandle": null,
  //   "hackerearthHandle": null,
  
  const validateUserId = async (platformName, username) => {
    try {
      const obj = {}
      const platform = platformName.toLowerCase();
      let handle;
      if (platform === 'codeforces') handle = "codeforcesHandle";
      if (platform === 'leetcode') handle = "leetcodeHandle";
      if (platform === 'codechef') handle = "codechefHandle";
      if (platform === 'atcoder') handle = "atcoderHandle";
      if (platform === 'hackerrank') handle = "hackerrankHandle";
      if (platform === 'hackerearth') handle = "hackerearthHandle";
      if (handle) {
        obj[handle] = username;
      }
      console.log(obj);
      const response = await axios.patch(`${url}/users/update-handles`, obj, {headers: {Authorization: `Bearer ${token}`}})
      const {data} = response;
      
      return data[handle] === username;
    } catch (error) {
      console.log(error)
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("⚠️ Please login first to continue.");
      return;
    }

    setLoading(true);
    const valid = await validateUserId(platform, userId);

    if (valid) {
      // Proceed to next page with the ID (you can also pass userId as query if needed)
      navigate(`/contest-info/${platform}`, { state: { userId } });
    } else {
      setError("❌ Invalid username. Please enter a correct user ID.");
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <img
            src={getPlatformLogo(platform)}
            alt={`${platform} logo`}
            className="h-20 w-20 rounded-full object-contain shadow-md"
          />
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white text-center">
            Enter your <span className="capitalize">{platform}</span> User ID
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            This helps us fetch your contests and track progress.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 animate-fadeIn"
        >
          <input
            type="text"
            placeholder={`${platform} User ID`}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg font-bold transition"
          >
            {loading ? "Validating..." : "Save & Continue 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
