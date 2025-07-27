import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function FAQItem({ question, answer }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mb-4 border border-gray-300 dark:border-gray-700 rounded-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 font-medium text-lg focus:outline-none flex justify-between items-center"
      >
        {question}
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">{answer}</div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  const platforms = [
    {
      name: "LeetCode",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    },
    {
      name: "Codeforces",
      logo: "https://tinyurl.com/mvywhztr",
    },
    {
      name: "CodeChef",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcv_WJfqB-tC3ZFADRoUMMMTtOA6ZzyAA6g&s",
    },
    {
      name: "TopCoder",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8zAQWiyyKXkXygCCWUz_01xvVCxWOCpTsjQ&s",
    },
    // {
    //   name: "CS Academy",
    //   logo: "https://csacademy.com/app/static/round/favicon.png",
    // },
    // {
    //   name: "HackerEarth",
    //   logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxTmatQgSjbS7EcoYLY1dPCjPwqOBmSvEwHg&s",
    // },
    // {
    //   name: "HackerRank",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png",
    // },
    // {
    //   name: "Kick Start",
    //   logo: "https://media.licdn.com/dms/image/v2/C560BAQGXNaIkf2kBwQ/company-logo_200_200/company-logo_200_200/0/1631426665528/kickstartcoding_logo?e=2147483647&v=beta&t=hcOpZAQiqGKmJHi5lo_00B2wX2td6Kb-ZufAMMg5reo",
    // },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-black dark:text-white px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-2 inline-block bg-red-200/70 text-red-700 px-3 py-1 rounded-full text-xs font-medium shadow">
          💻 Track. Code. Win.
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-snug tracking-tight mb-4">
          Master DSA & CP With <br />
          <span className="text-purple-600 dark:text-purple-400">
            Daily Coding Contests
          </span>
        </h1>

        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base sm:text-lg mb-10">
          Stay ahead in your coding journey. Get real-time contest alerts, build
          consistency, and sharpen your problem-solving skills across top
          platforms.
        </p>

        {/* Grid of platforms */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-center mb-10 px-4">
          {platforms.map(({ name, logo }) => (
            <div
              key={name}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-4 flex flex-col items-center justify-center gap-3"
            >
              <img
                src={logo}
                alt={`${name} Logo`}
                className="h-16 w-16 object-contain"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {name}
              </span>
            </div>
          ))}
        </div>

        <Link to= {user ? "/contestinfo":"/login"}>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3  font-bold transitiontext-lg rounded-full shadow-md">
            Start Solving Now 🚀
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto mt-16 px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Choose CodeRadar?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {[
            { emoji: "⏰", title: "Real-Time Contest Alerts", desc: "Never miss a contest again with instant alerts across platforms." },
            { emoji: "📅", title: "Personalized Calendar", desc: "View upcoming contests in one place—organized and clean." },
            { emoji: "📊", title: "Track Daily Progress", desc: "Keep up your coding streaks with automatic problem logging." },
            { emoji: "🏆", title: "Leaderboard & Ranks", desc: "Compete with peers and see where you stand." },
            { emoji: "🧠", title: "Problem of the Day", desc: "Sharpen your skills with a daily curated DSA challenge." },
            { emoji: "📈", title: "Analytics Dashboard", desc: "Visualize your performance with smart graphs and charts." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto mt-20 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">FAQs</h2>
        {[
          {
            q: "How does CodeRadar track contests?",
            a: "We fetch official contest data from various platforms using their APIs or scrapers and update it in real-time."
          },
          {
            q: "Is it free to use?",
            a: "Yes! CodeRadar is completely free for students and coders."
          },
          {
            q: "Do I need to create an account?",
            a: "Creating an account gives you personalized dashboards and saves your progress"
          },
          {
            q: "Which platforms are supported?",
            a: "We support LeetCode, Codeforces, CodeChef, HackerRank, HackerEarth, TopCoder, and more."
          }
        ].map((item, index) => (
          <FAQItem key={index} question={item.q} answer={item.a} />
        ))}
      </section>
    </div>
  );
}
