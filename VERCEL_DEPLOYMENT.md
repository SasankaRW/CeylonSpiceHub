# Vercel Deployment Guide

This guide will help you deploy Ceylon Spice Hub to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB Atlas account or MongoDB connection string
3. Git repository (GitHub, GitLab, or Bitbucket)

## Environment Variables

You need to set the following environment variables in your Vercel project:

### Required Variables

1. **MONGODB_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Or: `mongodb://username:password@host:port/database`

2. **JWT_SECRET**
   - Secret key for JWT token generation
   - Use a strong, random string (at least 32 characters)
   - Example: `your-super-secret-jwt-key-here-minimum-32-chars`

### Optional Variables

3. **ALLOWED_ORIGINS**
   - Comma-separated list of allowed CORS origins
   - Example: `https://yourdomain.com,https://www.yourdomain.com`
   - Default: Allows localhost in development

4. **NODE_ENV**
   - Set to `production` for production deployments
   - Vercel sets this automatically, but you can override if needed

5. **SEED_DATABASE**
   - Set to `true` to seed the database with initial data on first deployment
   - Default: `false`

6. **CLOUDINARY_CLOUD_NAME**
   - Your Cloudinary Cloud Name
   - Example: `dwuxumj4x`

7. **CLOUDINARY_API_KEY**
   - Your Cloudinary API Key

8. **CLOUDINARY_API_SECRET**
   - Your Cloudinary API Secret

9. **CLOUDINARY_UPLOAD_PRESET**
    - Your Cloudinary Upload Preset
    - Example: `spicehub_image_upload`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository

2. **Configure Project**
   - Framework Preset: Vite (or auto-detect)
   - Root Directory: `./` (project root)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables listed above
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   For production deployment:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add ALLOWED_ORIGINS
   ```

## Project Structure

The project is configured as follows:

- **Frontend**: React/Vite app that builds to `dist/`
- **Backend**: Express.js API serverless functions in `api/`
- **API Routes**: All `/api/*` routes are handled by `api/index.js`
- **Static Files**: Served from `dist/` directory

### Backend Architecture

The backend is implemented as a single Vercel serverless function (`api/index.js`) that:
- Wraps your Express.js application
- Handles all API routes (`/api/products`, `/api/orders`, etc.)
- Manages MongoDB connections with connection pooling for serverless
- Includes security middleware (helmet, rate limiting, CORS, etc.)
- Automatically connects to MongoDB on each request (with connection caching)

## API Endpoints

All API endpoints are available under `/api/`:

- `/api/products` - Product management (GET, POST, PATCH, DELETE)
- `/api/orders` - Order management (GET, POST, PATCH)
- `/api/categories` - Category management (GET, POST, PATCH, DELETE)
- `/api/sliders` - Slider management (GET, POST, PATCH, DELETE)
- `/api/users` - User authentication and management (POST /login, GET, POST)
- `/api/health` - Health check endpoint (GET)

### Backend Features

- **MongoDB Connection**: Optimized for serverless with connection pooling
- **Security**: Helmet, rate limiting, CORS, input sanitization
- **Error Handling**: Comprehensive error handling with proper status codes
- **Authentication**: JWT-based authentication for admin routes
- **Request Validation**: Built-in validation and sanitization

## Troubleshooting

### Database Connection Issues

1. **Check MongoDB URI**
   - Ensure the connection string is correct
   - Verify credentials are valid
   - Check if IP whitelist is configured (for MongoDB Atlas)

2. **Connection Timeout**
   - MongoDB Atlas may require IP whitelisting
   - Add `0.0.0.0/0` to allow all IPs (for testing)
   - Or add Vercel's IP ranges

### Build Errors

1. **Check Build Logs**
   - Review build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names are correct (case-sensitive)

### API Not Working

1. **Check Function Logs**
   - View function logs in Vercel dashboard
   - Check for runtime errors
   - Look for MongoDB connection errors

2. **CORS Issues**
   - Update `ALLOWED_ORIGINS` environment variable
   - Include your Vercel deployment URL
   - The handler automatically adds Vercel URLs to allowed origins

3. **Database Connection**
   - Verify MongoDB connection is working
   - Check function logs for connection errors
   - Ensure MongoDB Atlas IP whitelist includes Vercel's IP ranges (or use `0.0.0.0/0` for testing)

4. **Cold Starts**
   - First request may be slower due to serverless cold start
   - MongoDB connection is cached between requests
   - Subsequent requests should be faster

5. **Function Timeout**
   - Default timeout is 30 seconds (configurable in `vercel.json`)
   - For longer operations, consider increasing timeout or optimizing queries

## Post-Deployment

1. **Create Admin User**
   - Visit `/api/users/seed-admin` to create default admin user
   - Default credentials:
     - Username: `admin`
     - Password: `SpiceHub@123`
   - **Change the default password immediately!**

2. **Seed Database** (Optional)
   - Set `SEED_DATABASE=true` environment variable
   - Redeploy or restart the function
   - Remove the variable after seeding

3. **Configure Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## Performance Optimization

- Vercel automatically optimizes static assets
- API functions have a 30-second timeout (configurable)
- MongoDB connection is cached for better performance
- Consider using Vercel Edge Functions for better latency

## Support

For issues or questions:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Review MongoDB Atlas documentation
- Check project logs in Vercel dashboard

