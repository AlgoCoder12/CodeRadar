# Enhanced CodeRadar Features Test Script
# Tests username verification and contest display functionality

Write-Host "=== CodeRadar Enhanced Features Test ===" -ForegroundColor Green
Write-Host "Testing username verification and contest display functionality"
Write-Host ""

$baseUrl = "http://localhost:8080"
$authToken = "YOUR_JWT_TOKEN_HERE"  # Replace with actual JWT token after login

# Test 1: Basic Platform Verification
Write-Host "1. Testing Platform Verification..." -ForegroundColor Yellow
$handles = @{
    "codeforces" = "tourist"
    "leetcode" = "leetcode"
    "atcoder" = "tourist"
    "codechef" = "admin"
}

foreach ($platform in $handles.Keys) {
    $handle = $handles[$platform]
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/test-platform-verification/$handle/$platform" -Method Get -Headers @{"Authorization" = "Bearer $authToken"} -ErrorAction SilentlyContinue
    Write-Host "   $platform ($handle): $response" -ForegroundColor Cyan
}

Write-Host ""

# Test 2: Comprehensive Platform Contest Data
Write-Host "2. Testing Platform Contest Data with Verification..." -ForegroundColor Yellow

foreach ($platform in $handles.Keys) {
    $handle = $handles[$platform]
    Write-Host "   Testing $platform with handle: $handle" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/platform-contests/$handle/$platform" -Method Get -Headers @{"Authorization" = "Bearer $authToken"}
        
        Write-Host "     ✅ Handle Valid: $($response.isValidHandle)" -ForegroundColor Green
        Write-Host "     📋 Message: $($response.message)" -ForegroundColor White
        Write-Host "     🏆 Contests Found: $($response.totalUpcomingContests)" -ForegroundColor Magenta
        
        if ($response.userStats) {
            Write-Host "     📊 User Stats:" -ForegroundColor Blue
            Write-Host "        - Total Participated: $($response.userStats.totalContestsParticipated)" -ForegroundColor Gray
            Write-Host "        - Average Rank: $($response.userStats.averageRank)" -ForegroundColor Gray
            Write-Host "        - Average Score: $($response.userStats.averageScorePercentage)%" -ForegroundColor Gray
        }
        
        if ($response.contests -and $response.contests.Count -gt 0) {
            Write-Host "     🎯 Sample Contest:" -ForegroundColor Blue
            $contest = $response.contests[0]
            Write-Host "        - Name: $($contest.name)" -ForegroundColor Gray
            Write-Host "        - Status: $($contest.status)" -ForegroundColor Gray
            Write-Host "        - Time Until Start: $($contest.timeUntilStart)" -ForegroundColor Gray
            Write-Host "        - Duration: $($contest.duration) minutes" -ForegroundColor Gray
        }
        
        Write-Host ""
    }
    catch {
        Write-Host "     ❌ Error testing $platform : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Invalid Username Test
Write-Host "3. Testing Invalid Username Handling..." -ForegroundColor Yellow
$invalidHandle = "thisusershouldnotexist12345"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/platform-contests/$invalidHandle/codeforces" -Method Get -Headers @{"Authorization" = "Bearer $authToken"}
    Write-Host "   ❌ Invalid Handle Test: $($response.isValidHandle)" -ForegroundColor Red
    Write-Host "   📋 Message: $($response.message)" -ForegroundColor White
    Write-Host "   🏆 Contests: $($response.contests.Count)" -ForegroundColor Magenta
}
catch {
    Write-Host "   ❌ Error testing invalid handle: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Contest Service Health
Write-Host "4. Testing Contest Service Health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/contests/health" -Method Get
    Write-Host "   ✅ Contest Service: $($response.status)" -ForegroundColor Green
    Write-Host "   📊 Total Contests: $($response.totalContests)" -ForegroundColor Cyan
    Write-Host "   🔄 Last Fetch: $($response.lastFetch)" -ForegroundColor Gray
}
catch {
    Write-Host "   ❌ Contest service health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Platform Statistics
Write-Host "5. Testing Platform Statistics..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/contests/stats" -Method Get
    Write-Host "   📊 Platform Statistics:" -ForegroundColor Cyan
    foreach ($platform in $response.platformStats.PSObject.Properties) {
        Write-Host "      - $($platform.Name): $($platform.Value) contests" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   ❌ Platform statistics failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: All Available Platforms
Write-Host "6. Testing Available Platforms..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/contests/platforms/list" -Method Get
    Write-Host "   🌐 Available Platforms:" -ForegroundColor Cyan
    foreach ($platform in $response) {
        Write-Host "      - $platform" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   ❌ Available platforms failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Green
Write-Host "Note: Replace YOUR_JWT_TOKEN_HERE with actual JWT token for authenticated tests" -ForegroundColor Yellow
Write-Host ""

# Instructions for manual testing
Write-Host "=== Manual Testing Instructions ===" -ForegroundColor Blue
Write-Host "1. Start the application: ./mvnw.cmd spring-boot:run"
Write-Host "2. Login to get JWT token"
Write-Host "3. Update authToken variable in this script"
Write-Host "4. Run: ./test-enhanced-features.ps1"
Write-Host ""
Write-Host "=== API Endpoints Available ===" -ForegroundColor Blue
Write-Host "• GET /dashboard/test-platform-verification/{handle}/{platform}"
Write-Host "• GET /dashboard/platform-contests/{handle}/{platform}"
Write-Host "• GET /api/contests/health"
Write-Host "• GET /api/contests/stats"
Write-Host "• GET /api/contests/platforms/list"
Write-Host ""
