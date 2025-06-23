// src/pages/POTDPage.jsx
import React, { useState } from "react";

const dummyPOTD = {
  title: "Two Sum",
  platform: "LeetCode",
  platformUrl: "https://leetcode.com/problems/two-sum/",
  tags: ["Array", "HashMap"],
  difficulty: "Easy",
  estimatedTime: "15-20 mins",
};

export default function POTDPage() {
  const [streak, setStreak] = useState(3); // dummy streak count

  return (
    <section className="px-6 py-12 min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-black dark:text-white">
      <div className="max-w-4xl mx-auto text-center animate-fadeIn">
        <h1 className="text-5xl font-bold text-black dark:text-white mb-4">
          🔥 Problem of the Day
        </h1>
        <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
          One question. Every day. Keep the streak alive and sharpen your DSA/CP skills!
        </p>

        <div className="text-green-500 font-semibold mb-6">
          🔥 Streak: {streak} days!
        </div>

        {/* POTD Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg transition hover:scale-[1.01]">
          <h2 className="text-2xl font-bold mb-2 text-purple-600">{dummyPOTD.title}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Platform:{" "}
            <a
              href={dummyPOTD.platformUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              {dummyPOTD.platform}
            </a>
          </div>
          <div className="mb-2">
            Tags:{" "}
            {dummyPOTD.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full mr-2 text-gray-800 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm mb-2">
            Difficulty:{" "}
            <span
              className={`font-semibold ${
                dummyPOTD.difficulty === "Easy"
                  ? "text-green-500"
                  : dummyPOTD.difficulty === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {dummyPOTD.difficulty}
            </span>
          </div>
          <div className="text-sm mb-4">Estimated Time: {dummyPOTD.estimatedTime}</div>

          <a
            href={dummyPOTD.platformUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition"
          >
            Solve
          </a>
        </div>
      </div>
    </section>
  );
}
