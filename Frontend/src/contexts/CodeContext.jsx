import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create the CodeContext
const CodeContext = createContext();

// Custom hook to use the CodeContext
export const useCode = () => useContext(CodeContext);

// Backend URL
const BACKEND_URL = 'http://localhost:8080/api/contests';

// CodeProvider component
export const CodeProvider = ({ children }) => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all contests
    const fetchContests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}`);
            setContests(Array.isArray(response.data) ? [...response.data].reverse() : response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch upcoming contests
    const fetchUpcomingContests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/upcoming`);
            setContests(Array.isArray(response.data) ? [...response.data].reverse() : response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch active contests
    const fetchActiveContests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/active`);
            setContests(Array.isArray(response.data) ? [...response.data].reverse() : response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch contests by platform
    const fetchContestsByPlatform = async (platform) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/platform/${platform}`);
            setContests(Array.isArray(response.data) ? [...response.data].reverse() : response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch upcoming contests by platform
    const fetchUpcomingContestsByPlatform = async (platform) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/upcoming/platform/${platform}`);
            setContests(Array.isArray(response.data) ? [...response.data].reverse() : response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch contests by multiple platforms
    const fetchContestsByPlatforms = async (platforms) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/platforms`, {
                params: { platforms: platforms.join(',') },
            });
            // console.log("response",response)
            setContests(Array.isArray(response.data) ? [...response.data].reverse() : response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch contests in a date range
    const fetchContestsInRange = async (startTime, endTime) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/range`, {
                params: { startTime, endTime },
            });
            setContests(Array.isArray(response.data) ? [...response.data].reverse() : response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch contest by ID
    const fetchContestById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/${id}`);
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Manual refresh
    const refreshContests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${BACKEND_URL}/refresh`);
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get contest statistics
    const getContestStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/stats`);
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get available platforms
    const getAvailablePlatforms = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/platforms/list`);
            // console.log(response)
            return response.data;
        } catch (err) {
            setError(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Search contests by name
    const searchContests = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/search`, {
                params: { query },
            });
            setContests(Array.isArray(response.data) ? [...response.data].reverse() : response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Create a new contest
    const createContest = async (contest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${BACKEND_URL}`, contest);
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Update a contest
    const updateContest = async (id, contest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${BACKEND_URL}/${id}`, contest);
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Delete a contest
    const deleteContest = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`${BACKEND_URL}/${id}`);
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Health check
    const healthCheck = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/health`);
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CodeContext.Provider
            value={{
                contests,
                setContests,
                loading,
                error,
                fetchContests,
                fetchUpcomingContests,
                fetchActiveContests,
                fetchContestsByPlatform,
                fetchUpcomingContestsByPlatform,
                fetchContestsByPlatforms,
                fetchContestsInRange,
                fetchContestById,
                refreshContests,
                getContestStats,
                getAvailablePlatforms,
                searchContests,
                createContest,
                updateContest,
                deleteContest,
                healthCheck,
            }}
        >
            {children}
        </CodeContext.Provider>
    );
};
