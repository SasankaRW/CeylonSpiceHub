# Backend Setup for Vercel

This document explains how the backend is configured for Vercel deployment.

## Architecture

The backend is implemented as a **single Vercel serverless function** located at `api/index.js`. This function wraps your entire Express.js application and handles all API routes.

### Why This Approach?

1. **Serverless Compatibility**: Vercel runs serverless functions, not long-running servers
2. **Cost Effective**: Pay only for what you use
3. **Auto-scaling**: Automatically scales based on traffic
4. **Simple Deployment**: Single function handles all routes

## How It Works

```
Request → Vercel → /api/index.js → Express App → Route Handler → Response
```

1. User makes a request to `/api/products`
2. Vercel routes it to `api/index.js` (serverless function)
3. The function connects to MongoDB (with connection caching)
4. Express app handles the route
5. Response is sent back to the user

## Key Features

### 1. MongoDB Connection Management

```javascript
// Connection is cached between requests
let cachedDb = null;

async function connectToDatabase() {
  // Reuse existing connection if available
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  // Otherwise, create new connection
  // ...
}
```

**Benefits:**
- Faster response times (no connection overhead on every request)
- Connection pooling for efficiency
- Automatic reconnection on failure

### 2. Security Middleware

- **Helmet**: Security headers
- **Rate Limiting**: Prevents abuse (100 requests per 15 minutes)
- **CORS**: Configurable origin whitelist
- **Input Sanitization**: Prevents NoSQL injection, XSS attacks
- **HPP**: Prevents HTTP parameter pollution

### 3. Route Structure

All routes are mounted at the root level in the Express app:
- `/products` → Handles `/api/products/*`
- `/orders` → Handles `/api/orders/*`
- `/categories` → Handles `/api/categories/*`
- `/sliders` → Handles `/api/sliders/*`
- `/users` → Handles `/api/users/*`

Vercel automatically prefixes these with `/api` based on the `vercel.json` configuration.

## Environment Variables

Required for backend:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-minimum-32-characters
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## File Structure

```
api/
  └── index.js          # Main serverless function handler

server/
  ├── index.js          # Original Express server (for local dev)
  ├── models/           # Mongoose models
  │   ├── Product.js
  │   ├── Order.js
  │   ├── Category.js
  │   ├── Slider.js
  │   └── User.js
  └── routes/           # Express route handlers
      ├── products.js
      ├── orders.js
      ├── categories.js
      ├── sliders.js
      └── users.js
```

## Local Development

For local development, you can still use the original server:

```bash
npm run server    # Runs server/index.js on port 5000
npm run dev:all   # Runs both frontend and backend
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000` (see `vite.config.js`).

## Production Deployment

In production on Vercel:
- Frontend is served as static files from `dist/`
- API requests go to the serverless function at `api/index.js`
- No separate server process needed

## Performance Considerations

### Cold Starts
- First request after inactivity may take 1-3 seconds
- Subsequent requests are much faster
- Connection caching helps minimize this

### Connection Pooling
- MongoDB connection pool: 2-10 connections
- Connections are reused across requests
- Automatic reconnection on failure

### Timeout Limits
- Default: 30 seconds (configurable in `vercel.json`)
- For Pro/Enterprise: Up to 60 seconds
- Consider optimizing long-running operations

## Monitoring

Check Vercel dashboard for:
- Function execution logs
- Response times
- Error rates
- MongoDB connection status (via `/api/health`)

## Troubleshooting

### Database Connection Issues

1. **Check MongoDB URI**: Ensure it's correct in environment variables
2. **IP Whitelist**: MongoDB Atlas may require IP whitelisting
3. **Connection String Format**: Use proper MongoDB connection string format
4. **Network Issues**: Vercel functions may have different network access

### Function Errors

1. **Check Logs**: Vercel dashboard → Functions → Logs
2. **Test Locally**: Use `npm run server` to test backend locally
3. **Environment Variables**: Ensure all required vars are set
4. **Dependencies**: Check that all packages are in `package.json`

### Performance Issues

1. **Connection Caching**: Already implemented
2. **Query Optimization**: Review MongoDB queries
3. **Response Size**: Minimize data sent in responses
4. **Rate Limiting**: Adjust if needed

## Migration from Traditional Server

If you were running a traditional Express server:

**Before:**
```javascript
// server.js
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

**After (Vercel):**
```javascript
// api/index.js
export default async function handler(req, res) {
  // Connect to DB
  await connectToDatabase();
  // Handle with Express
  return app(req, res);
}
```

The routes remain the same - only the entry point changes!

