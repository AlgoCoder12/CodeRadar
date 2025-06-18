import conf from "../../conf/conf"; // Endpoint/project ID
import { Client, Databases, ID } from "appwrite";

class DashboardService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  async getAllPlatforms() {
    try {
      const response = await this.databases.listDocuments(
        conf.databaseId,
        conf.platformsCollectionId
      );
      return response.documents;
    } catch (error) {
      console.error("getAllPlatforms error:", error.message);
      return [];
    }
  }

  async getMonthlyContestStats(userId, platformName) {
    try {
      const [userData, totalData] = await Promise.all([
        this.databases.listDocuments(
          conf.databaseId,
          conf.userContestCollectionId,
          [
            Query.equal("userId", userId),
            Query.equal("platform", platformName),
            Query.greaterThan("date", getStartOfMonth()),
          ]
        ),
        this.databases.listDocuments(
          conf.databaseId,
          conf.contestCollectionId,
          [
            Query.equal("platform", platformName),
            Query.greaterThan("date", getStartOfMonth()),
          ]
        ),
      ]);

      return {
        attended: userData.total,
        total: totalData.total,
        attendedContests: userData.documents,
        allContests: totalData.documents,
      };
    } catch (error) {
      console.error("getMonthlyContestStats error:", error.message);
      return { attended: 0, total: 0 };
    }
  }

  // Get overall stats for all platforms
  async getOverallMonthlyStats(userId) {
    const platforms = await this.getAllPlatforms();
    const result = [];

    for (const platform of platforms) {
      const stats = await this.getMonthlyContestStats(userId, platform.name);
      result.push({ platform: platform.name, ...stats });
    }

    return result;
  }
}

function getStartOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

const dashboardService = new DashboardService();
export default dashboardService;
