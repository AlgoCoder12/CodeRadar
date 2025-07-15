import React from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { useAuth } from "../contexts/AuthContext";

const platforms = [
  {
    name: "LeetCode",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
  },
  {
    name: "CodeForces",
    logo: "https://tinyurl.com/mvywhztr",
  },
  {
    name: "CodeChef",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcv_WJfqB-tC3ZFADRoUMMMTtOA6ZzyAA6g&s",
  },
  {
    name: "AtCoder",
    logo: "https://img.atcoder.jp/assets/atcoder.png",
  },
];

export default function ContestInfo() {

  const {user} = useAuth();
  const getHandle = (name) => {
    let handle;
    let platform = name.toLowerCase();
      if (platform === 'codeforces') handle = "codeforcesHandle";
      if (platform === 'leetcode') handle = "leetcodeHandle";
      if (platform === 'codechef') handle = "codechefHandle";
      if (platform === 'atcoder') handle = "atcoderHandle";
      if (platform === 'hackerrank') handle = "hackerrankHandle";
      if (platform === 'hackerearth') handle = "hackerearthHandle";
      return handle;
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-black dark:text-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
          Select a Platform to See Contest Details
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-12">
          Choose your favorite coding platform below and start practicing by
          exploring upcoming contests and challenges.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-center">
          {platforms.map(({ name, logo }) => (
           <Link
           key={name}
           to={user[getHandle(name)] === null ? `/contest-check/${name}` : `/contest-info/${name}`} // changed from `/contest-info/${name}`
          //  to={`/contest-check/${name}`} // changed from `/contest-info/${name}`
           className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:scale-105 hover:shadow-xl transition-transform duration-300"
         >
           <img
             src={logo}
             alt={`${name} Logo`}
             className="h-20 w-20 object-contain"
           />
           <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
             {name}
           </span>
         </Link>
          ))}
        </div>

        {/* Typing animation */}
        <p className="mt-20 text-lg font-mono text-gray-700 dark:text-gray-300 max-w-xl mx-auto min-h-[48px]">
          <Typewriter
            words={[
              "Fetching upcoming contests...",
              "Sharpen your problem-solving skills...",
              "Get ready to compete!",
              "Practice. Compete. Repeat.",
            ]}
            loop={0} // infinite loop
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </p>
      </div>
    </div>
  );
}
