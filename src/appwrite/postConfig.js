import config from "../config/config"
import { Client, ID, Databases, Storage, Query } from "appwrite"

export class Service{

    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client.setEndpoint(config.appwriteURL).setProject(config.appwriteProjectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }   

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                config.appwriteDataBaseID, 
                config.appwriteCollectionID, 
                slug, //for a unique ID , can also use ID.unique()
                {
                    title,
                    content, 
                    featuredImage, 
                    status, 
                    userId
                }
            )
        } catch (error) {
            console.log("AppWrite create Post Error: ", error);
        }
    }

    async updatePost( slug, {title, content, featuredImage, status} ){
        try {
            return await this.databases.updateDocument(
                config.appwriteDataBaseID, 
                config.appwriteCollectionID, 
                slug, //for a unique ID , can also use ID.unique()
                {
                    title,
                    content, 
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("AppWrite update Post Error: ", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                config.appwriteDataBaseID,
                config.appwriteCollectionID,
                slug
            )
            return true

        } catch (error) {
            console.log("Appwrite delete post error:" , error);
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                config.appwriteDataBaseID,
                config.appwriteCollectionID,
                slug
            )

        } catch (error) {
            console.log("Appwrite get post error:" , error);
            return false
        }
    }

    async getPosts(){
        try {
            return await this.databases.listDocuments(
                config.appwriteDataBaseID,
                config.appwriteCollectionID,
                [
                    Query.equal("status", "active") // queries will be in array format and can be multiple, result will be OR operation
                ]
            )
            
        } catch (error) {
            console.log("Appwrite get active posts error:" , error);
            return false
        }
    }

    // file upload method
    async uploadFile(file){
        try {
            return await this.bucket.createFile( // it will return file ID.
                config.appwriteBucketID,
                ID.unique(),
                file
            )

        } catch (error) {
            console.log("Appwrite upload file error:" , error);
            return false
        }
    }

    async deleteFile(fileID){
        try {
            await this.bucket.deleteFile(
                config.appwriteBucketID,
                fileID
            )
            return true
        } catch (error) {
            console.log("Appwrite delete File error: ", error);
            return false
        }
    }

    getFilePreview(fileID){
        return this.bucket.getFilePreview(config.appwriteBucketID, fileID);
    }

}


const service = new Service()

export default service