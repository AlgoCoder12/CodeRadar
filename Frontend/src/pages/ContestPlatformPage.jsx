import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCode } from "../contexts/CodeContext";
import { useAuth } from "../contexts/AuthContext";

function formatDateTime(datetimeStr) {
  const options = {
    dateStyle: "medium",
    timeStyle: "short",
  };
  return new Date(datetimeStr).toLocaleString(undefined, options);
}

export default function ContestPlatformPage() {
  const { platform } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { contests, fetchContestsByPlatform, registerForContest } = useCode();

  const [filterDate, setFilterDate] = useState("");
  const [filteredContests, setFilteredContests] = useState([]);

  useEffect(() => {
    if (platform) {
      fetchContestsByPlatform(platform);
    }
  }, [platform]);

  useEffect(() => {
    if (!filterDate) {
      setFilteredContests(contests);
    } else {
      setFilteredContests(
        contests.filter((contest) => {
          const contestDate = new Date(contest.startTime)
            .toISOString()
            .slice(0, 10);
          return contestDate === filterDate;
        })
      );
    }
  }, [filterDate, contests]);

  const handleRegister = (contestUrl) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    window.open(contestUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-black dark:text-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 capitalize">
          {platform} Contests
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-12">
          Explore upcoming contests and register to start practicing!
        </p>

        {/* Date Filter
        <div className="mb-10">
          <label
            htmlFor="date-filter"
            className="block mb-3 font-semibold text-lg text-gray-900 dark:text-gray-200"
          >
            Filter contests by date:
          </label>
          <input
            id="date-filter"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            min={new Date().toISOString().slice(0, 10)}
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
            >
              Clear
            </button>
          )}
        </div> */}

        {/* Contest List */}
        {filteredContests.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No contests found
            {filterDate ? " on this date" : " for this platform"}.
          </p>
        ) : (
          <ul className="space-y-8 text-left">
            {filteredContests.map((contest) => (
              <li
                key={contest.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {contest.name}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    <strong>Starts:</strong> {formatDateTime(contest.startTime)}{" "}
                    <br />
                    <strong>Ends:</strong> {formatDateTime(contest.endTime)}
                  </p>
                </div>
                <div className="flex gap-4 mt-4 sm:mt-0 items-start sm:items-center">
                  <button
                    onClick={() => handleRegister(contest.url)}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition"
                  >
                    Register
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-14">
          <Link
            to="/contestinfo"
            className="inline-block text-purple-700 hover:text-purple-500 font-semibold underline"
          >
            ← Back to platform selection
          </Link>
        </div>
      </div>
    </div>
  );
}
