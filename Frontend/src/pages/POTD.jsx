import React, { useEffect, useState } from "react";
import { fetchPOTDsForPlatforms } from "../lib/potd";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const platforms = ["LeetCode", "CodeForces"];

export default function POTDPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [potds, setPotds] = useState(null); // null = loading

  useEffect(() => {
    const fetchAll = async () => {
      const allPotds = await fetchPOTDsForPlatforms(platforms);
      setPotds(allPotds);
    };
    fetchAll();
  }, []);

  const handleSolveClick = (url) => {
    if (user && user.id) {
      window.open(url, "_blank");
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  return (
    <section className="px-6 py-12 min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-black dark:text-white">
      <div className="max-w-4xl mx-auto text-center animate-fadeIn">
        <h1 className="text-5xl font-bold text-black dark:text-white mb-4">
          🔥 Problem of the Day
        </h1>
        <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
          One challenge a day keeps the fear away. Stay consistent, grow strong!
        </p>

        {/* Loading */}
        {potds === null ? (
          <div className="text-xl py-10">Loading...</div>
        ) : potds.length === 0 ? (
          <div className="text-xl py-10">No POTDs available.</div>
        ) : (
          potds.map((potd, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg transition hover:scale-[1.01] mb-8"
            >
              <h2 className="text-2xl font-bold mb-2 text-purple-600">{potd?.title}</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Platform:{" "}
                <span className="text-blue-500">{potd.platform}</span>
              </div>

              {potd.tags && potd.tags.length > 0 && (
                <div className="mb-2">
                  Tags:{" "}
                  {potd.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full mr-2 text-gray-800 dark:text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm mb-2">
                Difficulty:{" "}
                <span
                  className={`font-semibold ${
                    potd.difficulty === "Easy"
                      ? "text-green-500"
                      : potd.difficulty === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {potd.difficulty || "Unknown"}
                </span>
              </div>
              <div className="text-sm mb-4">
                Estimated Time:{" "}
                {potd.points === 30
                  ? "1Hr"
                  : potd.points === 20
                  ? "45mins"
                  : "25mins"}
              </div>

              <button
                onClick={() => handleSolveClick(potd.problemUrl)}
                className="inline-block bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                Solve
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
