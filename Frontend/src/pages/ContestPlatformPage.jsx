import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const platforms = [
  {
    name: "leetcode",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    displayName: "LeetCode"
  },
  {
    name: "codeforces", 
    logo: "https://tinyurl.com/mvywhztr",
    displayName: "CodeForces"
  },
  {
    name: "codechef",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcv_WJfqB-tC3ZFADRoUMMMTtOA6ZzyAA6g&s",
    displayName: "CodeChef"
  },
  {
    name: "atcoder",
    logo: "https://img.atcoder.jp/assets/atcoder.png",
    displayName: "AtCoder"
  },
  {
    name: "hackerrank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png",
    displayName: "HackerRank"
  },
  {
    name: "hackerearth",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxTmatQgSjbS7EcoYLY1dPCjPwqOBmSvEwHg&s",
    displayName: "HackerEarth"
  },
  {
    name: "geeksforgeeks",
    logo: "https://media.geeksforgeeks.org/wp-content/uploads/20210224040010/gg-logo.png",
    displayName: "GeeksforGeeks"
  },
  {
    name: "topcoder",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8zAQWiyyKXkXygCCWUz_01xvVCxWOCpTsjQ&s",
    displayName: "TopCoder"
  },
  {
    name: "csacademy",
    logo: "https://csacademy.com/app/static/round/favicon.png",
    displayName: "CS Academy"
  }
];

const getPlatformInfo = (platformName) => {
  return platforms.find(p => p.name.toLowerCase() === platformName.toLowerCase()) || 
         { name: platformName, logo: "", displayName: platformName };
};

const ContestCard = ({ contest }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ended': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {contest.name}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contest.status)}`}>
          {contest.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <span className="w-16 font-medium">Start:</span>
          <span>{new Date(contest.startTime).toLocaleString()}</span>
        </div>
        
        <div className="flex items-center">
          <span className="w-16 font-medium">Duration:</span>
          <span>{contest.duration} minutes</span>
        </div>
        
        <div className="flex items-center">
          <span className="w-16 font-medium">Time:</span>
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {contest.timeUntilStart}
          </span>
        </div>
        
        {contest.hasParticipatedBefore && (
          <div className="flex items-center">
            <span className="text-green-600 dark:text-green-400">
              ✓ Previously participated
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <a 
          href={contest.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
        >
          View Contest
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const UserStats = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-blue-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Performance Stats</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalContestsParticipated}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Contests</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.averageRank ? Math.round(stats.averageRank) : 'N/A'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rank</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.averageScorePercentage ? Math.round(stats.averageScorePercentage) : 'N/A'}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Avg Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.latestRank || 'N/A'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Latest Rank</div>
        </div>
      </div>
      
      {stats.latestContest && (
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Latest Contest:</span> {stats.latestContest}
          </p>
        </div>
      )}
    </div>
  );
};

export default function ContestPlatformPage() {
  const { platform } = useParams();
  const navigate = useNavigate();
  const { user, token, url, loading: authLoading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [contests, setContests] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  const platformInfo = getPlatformInfo(platform);
  
  useEffect(() => {
    if (!authLoading && !user) {
      setError('⚠️ Please login first to continue.');
    }
  }, [authLoading, user]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowResults(false);
    
    if (!user) {
      setError('⚠️ Please login first to continue.');
      setLoading(false);
      return;
    }
    
    if (!username.trim()) {
      setError('❌ Please enter a username.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(
        `${url}/dashboard/platform-contests/${username}/${platform}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setVerificationResult(response.data);
      setContests(response.data.contests || []);
      setUserStats(response.data.userStats || null);
      setShowResults(true);
      
    } catch (err) {
      setError('❌ Error fetching contest data. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setUsername('');
    setVerificationResult(null);
    setContests([]);
    setUserStats(null);
    setShowResults(false);
    setError('');
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {platformInfo.logo && (
              <img 
                src={platformInfo.logo} 
                alt={`${platformInfo.displayName} logo`}
                className="h-16 w-16 rounded-full object-contain shadow-lg"
              />
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              {platformInfo.displayName} Contest Tracker
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Enter your {platformInfo.displayName} username to verify your account and view upcoming contests with personalized insights.
          </p>
        </div>
        
        {/* Username Input Form */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your {platformInfo.displayName} Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Enter your ${platformInfo.displayName} username`}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify & Get Contests'
                )}
              </button>
              
              {showResults && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Results Section */}
        {showResults && verificationResult && (
          <div className="max-w-6xl mx-auto">
            {/* Verification Status */}
            <div className="mb-6">
              <div className={`rounded-lg p-4 border ${
                verificationResult.isValidHandle 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <p className={`font-medium ${
                  verificationResult.isValidHandle 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {verificationResult.message}
                </p>
              </div>
            </div>
            
            {verificationResult.isValidHandle && (
              <>
                {/* User Stats */}
                {userStats && (
                  <div className="mb-8">
                    <UserStats stats={userStats} />
                  </div>
                )}
                
                {/* Contests Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Upcoming Contests
                    </h2>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                      {contests.length} contest{contests.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {contests.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {contests.map((contest, index) => (
                        <ContestCard key={index} contest={contest} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 dark:text-gray-600 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-lg">
                        No upcoming contests found for {platformInfo.displayName}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Check back later for new contests!
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Back Button */}
        <div className="text-center mt-8 flex flex-col items-center">
          <button
            onClick={() => navigate('/contest-info')}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Platform Selection
          </button>
          <button
            onClick={() => navigate(`/contest-check/${platformInfo.displayName}`)}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Update {platformInfo.displayName} handle
          </button>
        </div>
      </div>
    </div>
  );
}
