import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCode } from "../contexts/CodeContext";

// Mock contest data per platform
const mockContests = {
  leetcode: [
    {
      id: 1,
      name: "LeetCode Weekly Contest 300",
      startDate: "2025-06-15T12:00:00Z",
      endDate: "2025-06-15T14:00:00Z",
      url: "https://leetcode.com/contest/weekly-contest-300",
    },
    {
      id: 2,
      name: "LeetCode Biweekly Contest 100",
      startDate: "2025-06-22T12:00:00Z",
      endDate: "2025-06-22T14:00:00Z",
      url: "https://leetcode.com/contest/biweekly-contest-100",
    },
  ],
  codeforces: [
    {
      id: 1,
      name: "Codeforces Round #123",
      startDate: "2025-06-18T15:00:00Z",
      endDate: "2025-06-18T18:00:00Z",
      url: "https://codeforces.com/contest/123",
    },
    {
      id: 2,
      name: "Codeforces Educational Round 45",
      startDate: "2025-06-25T15:00:00Z",
      endDate: "2025-06-25T17:00:00Z",
      url: "https://codeforces.com/contest/45",
    },
  ],
  codechef: [
    {
      id: 1,
      name: "CodeChef June Challenge 2025",
      startDate: "2025-06-20T13:00:00Z",
      endDate: "2025-06-30T23:59:59Z",
      url: "https://www.codechef.com/JUNE25",
    },
  ],
  // Add other platforms similarly if needed
};

function formatDateTime(datetimeStr) {
  const options = {
    dateStyle: "medium",
    timeStyle: "short",
  };
  return new Date(datetimeStr).toLocaleString(undefined, options);
}

export default function ContestPlatformPage() {
  const { platform } = useParams();
  // const contests = mockContests[platform] || [];
  const {contests, fetchContestsByPlatform} = useCode();

  useEffect(() => {
    const fetchContests = async (name) => {
      await fetchContestsByPlatform(name);
    }
    fetchContests(platform);
  }, [platform])

  // console.log("contests", contests);

  const [filterDate, setFilterDate] = useState("");
  const [filteredContests, setFilteredContests] = useState(contests);

  useEffect(() => {
    if (!filterDate) {
      setFilteredContests(contests);
    } else {
      setFilteredContests(
        contests.filter((contest) => {
          const contestDate = new Date(contest.startTime).toISOString().slice(0, 10);
          return contestDate === filterDate;
        })
      );
    }
  }, [filterDate, contests]);

  // Reminder notification handler
  function setReminder(contest) {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      scheduleNotification(contest);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") scheduleNotification(contest);
        else alert("Notifications permission denied.");
      });
    } else {
      alert("Notifications permission denied.");
    }
  }

  function scheduleNotification(contest) {
    const startTime = new Date(contest.startDate).getTime();
    const now = Date.now();
    const reminderTime = startTime - 10 * 60 * 1000; // 10 minutes before contest start

    if (reminderTime <= now) {
      alert("Contest is starting soon or already started!");
      return;
    }

    const delay = reminderTime - now;

    alert(
      `Reminder set for contest "${contest.name}" 10 minutes before it starts. Please keep this tab open!`
    );

    setTimeout(() => {
      new Notification(`Reminder: Contest "${contest.name}" starts in 10 minutes!`);
    }, delay);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-black dark:text-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 capitalize">
          {platform} Contests
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-12">
          Explore upcoming contests and  set reminders to never miss them!
        </p>

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
        </div>

        {filteredContests.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No contests found{filterDate ? " on this date" : " for this platform"}.
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
                    <strong>Starts:</strong> {formatDateTime(contest.startTime)} <br />
                    <strong>Ends:</strong> {formatDateTime(contest.endTime)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0 items-start sm:items-center">
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
                  >
                    Register
                  </a>
                  <button
                    onClick={() => setReminder(contest)}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition"
                  >
                    Set Reminder
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
