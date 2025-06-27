// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children, user, loggedIn, setLoggedIn, darkMode, setDarkMode }) {
  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "dark bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <Header
        user={user}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main className="container mx-auto flex-grow px-6 py-10">{children}</main>
      <Footer />
    </div>
  );
}
