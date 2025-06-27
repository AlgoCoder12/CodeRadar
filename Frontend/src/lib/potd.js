import axios from "axios";

const BASE_URL = "http://localhost:8080/api/potd";

// Fetch POTD for a specific platform (e.g., 'leetcode', 'codeforces', etc.)
export async function fetchPOTDByPlatform(platform) {
  try {
    const response = await axios.get(`${BASE_URL}/${platform}`);
    // The API returns a single problem object, wrap it in an array for consistency
    return response.data ? [response.data] : [];
  } catch (error) {
    console.error("Error fetching POTD by platform:", error);
    return [];
  }
}

// Fetch POTD for Codeforces by topic and rating range
export async function fetchPOTDByRangeOnCF(topic, minRating, maxRating) {
  try {
    const response = await axios.get(`${BASE_URL}/range/${topic}/${minRating}/${maxRating}`);
    // The API returns a single problem object, wrap it in an array for consistency
    return response.data ? [response.data] : [];
  } catch (error) {
    console.error("Error fetching POTD by range on Codeforces:", error);
    return [];
  }
}

// Fetch all POTDs (all platforms, all problems)
export async function fetchAllPOTDs() {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    // The API returns an array of problems
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all POTDs:", error);
    return [];
  }
}

// Fetch POTDs for multiple platforms and return a combined array
export async function fetchPOTDsForPlatforms(platforms) {
  const promises = platforms.map(platform => fetchPOTDByPlatform(platform));
  const results = await Promise.all(promises);
  // Flatten the array of arrays into a single array
  return results.flat();
}
