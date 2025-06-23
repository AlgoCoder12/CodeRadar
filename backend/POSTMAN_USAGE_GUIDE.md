# CodeRadar Contest API - Postman Usage Guide

## 🚀 **Quick Setup**

### **Step 1: Import the Collection**
1. **Open Postman**
2. Click **"Import"** in the top left
3. Select **"Upload Files"**
4. Choose the file: `CodeRadar_Contest_API.postman_collection.json`
5. Click **"Import"**

### **Step 2: Set Environment Variables**
1. **Create a new Environment** (optional but recommended)
2. Add these variables:
   - `base_url` = `http://localhost:8080`
   - `contest_id` = `(will be set later when you get actual contest IDs)`

### **Step 3: Start Your CodeRadar Application**
```bash
# In your terminal, navigate to backend directory
cd C:\Test\CodeRadar\backend

# Start the Spring Boot application
mvn spring-boot:run
```

---

## 📋 **Testing Checklist**

### **✅ Essential Tests (Start Here)**

#### **1. Health Check**
- **Endpoint**: `GET /api/contests/health`
- **Purpose**: Verify the service is running
- **Expected Response**: `200 OK` with status information

#### **2. Get All Contests**
- **Endpoint**: `GET /api/contests`
- **Purpose**: See all contests currently in database
- **Expected Response**: Array of contest objects

#### **3. Manual Refresh**
- **Endpoint**: `POST /api/contests/refresh`
- **Purpose**: Trigger immediate fetching from all platforms
- **Expected Response**: Success message with count of fetched contests

#### **4. Get Statistics**
- **Endpoint**: `GET /api/contests/stats`
- **Purpose**: See contest counts by platform
- **Expected Response**: Statistics object with platform counts

---

## 🌐 **Platform-Specific Testing**

### **Fetch Contests from Specific Platforms**

#### **Codeforces**
```
GET /api/contests/platform/Codeforces
```
- **Purpose**: Get all Codeforces contests
- **What to check**: Contest names should contain "Round", "Div", etc.

#### **CodeChef**
```
GET /api/contests/platform/CodeChef
```
- **Purpose**: Get all CodeChef contests
- **What to check**: Contest names should be CodeChef-style

#### **AtCoder**
```
GET /api/contests/platform/AtCoder
```
- **Purpose**: Get all AtCoder contests
- **What to check**: Contest names should contain "ABC", "ARC", "AGC", etc.

#### **LeetCode**
```
GET /api/contests/platform/LeetCode
```
- **Purpose**: Get all LeetCode contests
- **What to check**: Contest names should contain "Weekly", "Biweekly", etc.

#### **HackerRank**
```
GET /api/contests/platform/HackerRank
```
- **Purpose**: Get all HackerRank contests
- **What to check**: Various HackerRank contest formats

#### **HackerEarth**
```
GET /api/contests/platform/HackerEarth
```
- **Purpose**: Get all HackerEarth contests
- **What to check**: HackerEarth competition names

---

## 🎯 **Advanced Testing Scenarios**

### **1. Upcoming Contests Only**
```
GET /api/contests/upcoming
```
**Purpose**: Get only future contests (most important for users)

### **2. Platform-Specific Upcoming**
```
GET /api/contests/upcoming/platform/Codeforces
```
**Purpose**: Get only upcoming contests from Codeforces

### **3. Multiple Platforms**
```
GET /api/contests/platforms?platforms=Codeforces,CodeChef,AtCoder
```
**Purpose**: Get contests from multiple platforms at once

### **4. Search Functionality**
```
GET /api/contests/search?query=Round
```
**Purpose**: Find contests with "Round" in the name

### **5. Date Range Filtering**
```
GET /api/contests/range?startTime=2025-06-21T00:00:00&endTime=2025-06-30T23:59:59
```
**Purpose**: Get contests within a specific date range

---

## 📊 **Expected Response Formats**

### **Single Contest Object**
```json
{
    "id": "676707a1a5b4d123456789ab",
    "name": "Codeforces Round #987 (Div. 2)",
    "platform": "Codeforces",
    "url": "https://codeforces.com/contest/1987",
    "startTime": "2025-06-22T14:35:00",
    "endTime": "2025-06-22T16:35:00",
    "durationMinutes": 120,
    "description": null,
    "fetchedAt": "2025-06-21T17:03:08.312"
}
```

### **Statistics Response**
```json
{
    "totalContests": 25,
    "upcomingContests": 18,
    "platformCounts": {
        "Codeforces": 8,
        "CodeChef": 3,
        "AtCoder": 4,
        "LeetCode": 2,
        "HackerRank": 1,
        "HackerEarth": 1
    },
    "timestamp": "2025-06-21T17:03:08.312"
}
```

### **Manual Refresh Response**
```json
{
    "message": "Contests refreshed successfully",
    "fetchedCount": 18,
    "timestamp": "2025-06-21T17:03:08.312"
}
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Connection Refused**
- **Problem**: Cannot connect to `localhost:8080`
- **Solution**: Make sure your Spring Boot app is running with `mvn spring-boot:run`

#### **2. Empty Contest List**
- **Problem**: `/api/contests` returns empty array
- **Solution**: 
  1. Wait for automatic fetch (runs every 4 hours)
  2. Or trigger manual refresh: `POST /api/contests/refresh`

#### **3. Platform Returns No Data**
- **Problem**: Specific platform returns empty results
- **Solution**: Check application logs for platform-specific errors

#### **4. 404 Not Found**
- **Problem**: Endpoint not found
- **Solution**: Verify the URL and method (GET/POST) are correct

### **Debugging Steps**

1. **Check Application Logs**
   ```bash
   # Look for error messages in the Spring Boot console
   ```

2. **Verify Database Connection**
   ```bash
   # Check if MongoDB is accessible
   # Verify connection string in application.properties
   ```

3. **Test Health Endpoint First**
   ```
   GET /api/contests/health
   ```

4. **Check Platform-Specific Errors**
   ```
   # Look for messages like:
   # "Error fetching Codeforces contests"
   # "LeetCode API returned status: 403"
   ```

---

## 📈 **Performance Testing**

### **Load Testing Recommendations**

1. **Concurrent Requests**
   - Test multiple simultaneous calls to `/api/contests/upcoming`
   - Verify response times stay under 100ms

2. **Data Volume**
   - After collecting many contests, test query performance
   - Verify filtering operations are fast

3. **Manual Refresh Limits**
   - Don't spam the `/api/contests/refresh` endpoint
   - Allow at least 30 seconds between manual refreshes

---

## 🎯 **Success Criteria**

### **✅ Your Implementation is Working If:**

1. **Health Check** returns `200 OK`
2. **Manual Refresh** fetches 15+ contests from multiple platforms
3. **Platform-Specific** endpoints return contests for each platform
4. **Statistics** show non-zero counts for multiple platforms
5. **Upcoming Contests** filters correctly (only future dates)
6. **Search** finds contests matching query terms
7. **No 500 Errors** on any endpoint

### **🎉 Success Metrics:**
- **Total Contests**: 15-30+ contests
- **Platforms Working**: 4-6 out of 6 platforms
- **Response Time**: Under 100ms for cached data
- **Uptime**: 99%+ availability

---

## 🚀 **Ready to Test?**

1. **Import the collection** into Postman
2. **Start your application** with `mvn spring-boot:run`
3. **Run Health Check** to verify connection
4. **Trigger Manual Refresh** to fetch fresh data
5. **Test all platform endpoints** to see the data
6. **Check Statistics** to verify everything is working

**Your CodeRadar Contest API is now ready for comprehensive testing!** 🎯
