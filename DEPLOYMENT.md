# SpiceHub Deployment Guide for cPanel

This guide provides step-by-step instructions for deploying the SpiceHub application on cPanel. The application consists of a React frontend and a Node.js/Express backend with MongoDB as the database.

## Prerequisites

1. A cPanel hosting account with Node.js support
2. MongoDB Atlas account (or any MongoDB hosting service)
3. FTP client or Git for uploading files
4. Basic knowledge of cPanel, Node.js, and MongoDB

## 1. Set Up MongoDB Atlas

1. Create a MongoDB Atlas account if you don't have one: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (the free tier is sufficient for small applications)
3. Set up a database user with read and write permissions
4. Whitelist your cPanel server's IP address in the Network Access settings
5. Get your MongoDB connection string from the Connect dialog

**Important:** For detailed MongoDB connection options and troubleshooting, refer to the `MONGODB_GUIDE.md` file included in this project.

## 2. Install Dependencies

Before deploying your application, make sure all dependencies are properly installed. You can use the provided installation scripts:

### Using the install.sh Script (Recommended)

1. Upload the application files to your cPanel account
2. Connect to your server via SSH or use the cPanel Terminal
3. Navigate to your application directory
4. Run the installation script:
   ```bash
   bash install.sh
   ```

This script will:
- Install all npm dependencies
- Install server-specific dependencies
- Build the frontend
- Create a .env file from the template if it doesn't exist
- Test your MongoDB connection

### Using the install.js Script (Alternative)

If you prefer using Node.js directly:

1. Upload the application files to your cPanel account
2. Connect to your server via SSH or use the cPanel Terminal
3. Navigate to your application directory
4. Run:
   ```bash
   node install.js
   ```

## 3. Set Up Node.js App in cPanel

1. Log in to your cPanel account
2. Navigate to the "Setup Node.js App" section
3. Click "Create Application"
4. Fill in the following details:
   - Node.js version: Select the latest LTS version (14.x or higher)
   - Application mode: Production
   - Application root: Path to your application directory
   - Application URL: Your domain or subdomain
   - Application startup file: server.js
5. Click "Create"

## 4. Environment Variables

1. Create a `.env` file in your application root directory based on the `.env.example` template
2. Update the following variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (see `MONGODB_GUIDE.md` for options)
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `NODE_ENV`: Set to "production"
   - `PORT`: Usually set by cPanel, but you can specify a port if needed
   - `SEED_DATABASE`: Set to "false" unless you want to seed the database on startup
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`: Credentials for the default admin user

## 5. Start the Application

1. In the cPanel Node.js App interface, click on your application
2. Click "Start Application"
3. Check the logs to ensure the application started successfully

## 6. Troubleshooting

### Missing Dependencies

If you encounter errors about missing dependencies:

1. Connect to your server via SSH or use the cPanel Terminal
2. Navigate to your application directory
3. Run the installation script again:
   ```bash
   bash install.sh
   ```

### MongoDB Connection Issues

If you encounter MongoDB connection errors:

1. Refer to the `MONGODB_GUIDE.md` file for detailed troubleshooting steps
2. Check if your MongoDB Atlas cluster is running
3. Verify your server's IP is whitelisted in MongoDB Atlas
4. Try alternative connection string formats as described in `MONGODB_GUIDE.md`
5. For DNS resolution issues with SRV records (ENOTFOUND errors), use the direct connection format
6. Check the server logs for specific error messages

## 7. Maintenance

### Updating the Application

1. Upload the new version of your application to cPanel
2. Connect to your server via SSH or use the cPanel Terminal
3. Navigate to your application directory
4. Run the installation script:
   ```bash
   bash install.sh
   ```
5. Restart the Node.js application in cPanel

### Backing Up the Database

1. Use MongoDB Atlas's backup features to create regular backups
2. For manual backups, you can use `mongodump` and `mongorestore`

## Conclusion

Your SpiceHub application should now be successfully deployed on cPanel. If you encounter any issues, check the application logs and refer to the troubleshooting section of this guide or the `MONGODB_GUIDE.md` file for MongoDB-specific issues.