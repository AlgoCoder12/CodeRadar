// src/appwrite/authService.js
import { Client, Account, ID } from "appwrite";
import conf from "../../conf/conf";

class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      await this.account.create(ID.unique(), email, password, name);
      return this.login({ email, password });
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      // If session missing or unauthorized, ignore but still clear frontend state
      if (
        error.message.includes("missing scope") ||
        error.message.includes("Unauthorized") ||
        error.message.includes("Session does not exist")
      ) {
        return;
      }
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      // No user/session found
      return null;
    }
  }
}

const authservice = new AuthService();
export default authservice;
