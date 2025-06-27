import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const problems = [
  {
    title: "Two Sum",
    topic: "Array",
    difficulty: "Easy",
    platform: "LeetCode",
    link: "https://leetcode.com/problems/two-sum/",
  },
  {
    title: "Shortest Path in Binary Matrix",
    topic: "Graphs",
    difficulty: "Medium",
    platform: "LeetCode",
    link: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
  },
  {
    title: "Minimum Spanning Tree",
    topic: "Greedy/DSU",
    difficulty: "Hard",
    platform: "GeeksforGeeks",
    link: "https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1",
  },
  {
    title: "Educational Round #150 Div 2",
    topic: "Mixed CP",
    difficulty: "Mixed",
    platform: "Codeforces",
    link: "https://codeforces.com/contest/1862",
  },
  {
    title: "Chef and Easy Problem",
    topic: "Math",
    difficulty: "Easy",
    platform: "CodeChef",
    link: "https://www.codechef.com/problems/EASYP",
  },
  {
    title: "BST Iterator",
    topic: "Trees",
    difficulty: "Medium",
    platform: "LeetCode",
    link: "https://leetcode.com/problems/binary-search-tree-iterator/",
  },
  {
    title: "Coin Change",
    topic: "DP",
    difficulty: "Medium",
    platform: "LeetCode",
    link: "https://leetcode.com/problems/coin-change/",
  },
];

export default function POTDCard() {
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const random = problems[Math.floor(Math.random() * problems.length)];
    setProblem(random);
  }, []);

  if (!problem) return null;

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mb-10 transition hover:shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-purple-600 mb-4">
        🔥 Problem of the Day (POTD)
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Boost your problem-solving skills with daily practice. Here's a handpicked DSA/CP problem to keep your grind going!
      </p>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
          {problem.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Topic:</strong> {problem.topic} | <strong>Difficulty:</strong>{" "}
          {problem.difficulty} | <strong>Platform:</strong> {problem.platform}
        </p>
      </div>
      <a
        href={problem.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
      >
        Go to Problem 🔗
      </a>
    </motion.div>
  );
}
