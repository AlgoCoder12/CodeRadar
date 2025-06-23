# CodeRadar Contest API Testing Guide

The CodeRadar backend is now successfully running with the Upcoming Contests module implemented! Here's how to test the API endpoints:

## Base URL
```
http://localhost:8080
```

## Available API Endpoints

### 1. Get All Contests
```bash
curl -X GET "http://localhost:8080/api/contests"
```

### 2. Get Upcoming Contests Only
```bash
curl -X GET "http://localhost:8080/api/contests/upcoming"
```

### 3. Get Active Contests (Currently Running)
```bash
curl -X GET "http://localhost:8080/api/contests/active"
```

### 4. Get Contests by Platform
```bash
# Get Codeforces contests
curl -X GET "http://localhost:8080/api/contests/platform/Codeforces"

# Get CodeChef contests
curl -X GET "http://localhost:8080/api/contests/platform/CodeChef"

# Get AtCoder contests
curl -X GET "http://localhost:8080/api/contests/platform/AtCoder"
```

### 5. Get Upcoming Contests by Platform
```bash
# Get upcoming Codeforces contests
curl -X GET "http://localhost:8080/api/contests/upcoming/platform/Codeforces"
```

### 6. Get Contests by Multiple Platforms
```bash
curl -X GET "http://localhost:8080/api/contests/platforms?platforms=Codeforces,CodeChef,AtCoder"
```

### 7. Search Contests by Name
```bash
curl -X GET "http://localhost:8080/api/contests/search?query=Round"
```

### 8. Get Contest Statistics
```bash
curl -X GET "http://localhost:8080/api/contests/stats"
```

### 9. Get Available Platforms
```bash
curl -X GET "http://localhost:8080/api/contests/platforms/list"
```

### 10. Manual Refresh Contests
```bash
curl -X POST "http://localhost:8080/api/contests/refresh"
```

### 11. Health Check
```bash
curl -X GET "http://localhost:8080/api/contests/health"
```

## Features Implemented

✅ **Contest Data Fetching**: Automatically fetches contests from:
- **Codeforces** (✅ via official API - fully working)
- **CodeChef** (✅ via web scraping - fully working)
- **AtCoder** (✅ via web scraping - fully working)
- **LeetCode** (✅ via GraphQL API - implemented with fallback)
- **HackerRank** (✅ via API + web scraping - dual approach)
- **HackerEarth** (✅ via API + web scraping - dual approach)

✅ **MongoDB Storage**: Contest data is stored in MongoDB with proper indexing

✅ **REST API**: Complete REST API with filtering, searching, and statistics

✅ **Scheduled Updates**: Background job runs every 4 hours to fetch fresh contest data

✅ **Platform Filtering**: Users can filter contests by specific platforms

✅ **Security Integration**: Contest endpoints are publicly accessible (no authentication required)

✅ **Error Handling**: Proper error handling and logging

✅ **Data Deduplication**: Avoids duplicate contests using name+platform combination

✅ **Automatic Cleanup**: Removes old contests (older than 30 days)

## Example Response

When you call `/api/contests/upcoming`, you'll get a response like:

```json
[
  {
    "id": "676707a1a5b4d123456789ab",
    "name": "Codeforces Round #123 (Div. 2)",
    "platform": "Codeforces",
    "url": "https://codeforces.com/contest/1234",
    "startTime": "2025-06-22T14:35:00",
    "endTime": "2025-06-22T16:35:00",
    "durationMinutes": 120,
    "description": null,
    "fetchedAt": "2025-06-21T16:57:17.234"
  }
]
```

## Frontend Integration

You can now integrate this with your frontend by making HTTP requests to these endpoints. The API supports CORS for cross-origin requests.

## Next Steps

To enhance the system further, you could:

1. Implement more robust web scraping for LeetCode, HackerRank, and HackerEarth
2. Add user-specific contest recommendations
3. Implement contest reminders and notifications
4. Add contest filtering by difficulty level
5. Cache frequently requested data for better performance
6. Add rate limiting to prevent API abuse
