# 🚀 CodeRadar

**CodeRadar** is a full-stack web application that tracks upcoming competitive programming contests across multiple platforms, helps users stay prepared through reminders, and analyzes their contest performance — all in one place.

---

## 📌 Features

### 🔎 Contest Tracker
- Fetches and displays upcoming contests from major platforms:
  - ✅ Codeforces (API)
  - ✅ LeetCode (GraphQL API)
  - ✅ AtCoder (scraping)
  - ✅ CodeChef (scraping)
  - ✅ HackerRank (scraping)
  - ✅ HackerEarth (scraping)
  - ✅ GeeksforGeeks (scraping)
  - ✅ CS Academy (scraping)
- Data is updated every 4–6 hours via a scheduled background job.
- Users can filter contests by platform.
- Exposed via secure REST API.

### 🔐 Authentication & Authorization
- User registration and login using JWT-based authentication.
- Protected APIs for personalized features (like favorites, reminders).
- Spring Security integration with BCrypt password encoding.

### ⭐ Favorites & Preferences
- Users can mark favorite contests or platforms.
- Personalize notification settings (email, calendar, etc.).

### 📧 Email Reminder System
- Daily email summaries of upcoming contests.
- Optional pre-contest reminders (e.g., 30 minutes before).
- Built with Spring Boot’s JavaMailSender.

### 🗓 Google Calendar Integration *(Optional & Advanced)*
- Users can link their Google accounts.
- Automatically adds contests to their calendar upon release.

### 📊 Performance Tracking
- Tracks whether a user actually participated in a contest.
- Fetches results via Codeforces API, LeetCode API, etc.
- Stores:
  - Rank
  - Score
  - Rating change
- Shows per-platform statistics:
  - Total contests played
  - Best rank
  - Best rating delta
- Performance bar in frontend dashboard.

### 📚 Student Timetable Notification *(Optional Add-on)*
- Students can upload their timetable.
- CodeRadar avoids scheduling notifications during their class hours.

---

## 🧩 Tech Stack

### Backend:
- Java 17
- Spring Boot
- Spring Security (JWT Auth)
- MongoDB
- JSoup (web scraping)
- JavaMailSender (email)
- Scheduled jobs with `@Scheduled`

### Frontend:
- React
- Tailwind CSS
- Axios
- React Countdown
- Toast notifications

---


