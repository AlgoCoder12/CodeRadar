const conf = {
    appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
    appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,          // fixed spelling
    appwriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    appwriteBucketID: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  };
  
  export default conf;
  