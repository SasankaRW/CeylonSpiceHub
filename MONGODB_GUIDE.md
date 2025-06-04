# MongoDB Connection Guide for SpiceHub

## Overview

This guide provides detailed information on connecting your SpiceHub application to MongoDB, including troubleshooting common connection issues, especially when deploying to cPanel or other hosting environments.

## Connection Options

### Option 1: MongoDB Atlas (SRV Format)

This is the standard connection string format for MongoDB Atlas:

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Pros:**
- Simplified connection string
- Automatic server discovery
- Load balancing across replica set members

**Cons:**
- Requires DNS SRV record resolution
- Some hosting providers have issues with SRV records

### Option 2: MongoDB Atlas (Direct Connection Format)

If you're experiencing DNS resolution issues with the SRV format, use the direct connection format:

```
mongodb://username:password@cluster-shard-00-00.mongodb.net:27017,cluster-shard-00-01.mongodb.net:27017,cluster-shard-00-02.mongodb.net:27017/database?ssl=true&replicaSet=atlas-cluster&authSource=admin
```

**Pros:**
- Doesn't rely on DNS SRV records
- Works in environments with limited DNS resolution

**Cons:**
- Longer, more complex connection string
- Requires manual updates if cluster topology changes

### Option 3: Local MongoDB

For development or if you have MongoDB installed on your server:

```
mongodb://localhost:27017/spicehub
```

**Pros:**
- Simple connection
- No external dependencies

**Cons:**
- Limited to a single server
- Requires MongoDB to be installed locally

## Finding Your MongoDB Atlas Connection String

1. Log in to your MongoDB Atlas account
2. Select your cluster
3. Click "Connect"
4. Select "Connect your application"
5. Choose your driver version (Node.js)
6. Copy the connection string
7. Replace `<username>`, `<password>`, and `<dbname>` with your actual values

## Common Connection Issues and Solutions

### 1. ENOTFOUND or querySrv Errors

**Error:**
```
MongoDB connection error: Error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

**Causes:**
- DNS resolution issues
- Hosting provider blocking SRV record lookups

**Solutions:**
- Use the direct connection format (Option 2)
- Contact your hosting provider to enable DNS SRV lookups
- Use a different MongoDB hosting service

### 2. Authentication Failed

**Error:**
```
MongoServerError: Authentication failed
```

**Causes:**
- Incorrect username or password
- Special characters in password not properly URL-encoded

**Solutions:**
- Double-check your username and password
- URL-encode special characters in your password
- Reset your MongoDB Atlas user password

### 3. IP Access List

**Error:**
```
MongoDB connection error: MongoNetworkError: connection closed
```

**Causes:**
- Your server's IP address is not in the MongoDB Atlas IP access list

**Solutions:**
- Add your server's IP to the MongoDB Atlas IP access list
- Temporarily allow access from anywhere (0.0.0.0/0) for testing

### 4. Connection Timeout

**Error:**
```
MongoDB connection error: MongoTimeoutError: Server selection timed out
```

**Causes:**
- Network connectivity issues
- Firewall blocking MongoDB connections

**Solutions:**
- Check your network connectivity
- Verify firewall settings
- Increase the serverSelectionTimeoutMS option

## Configuring MongoDB in SpiceHub

1. Create a `.env` file in your project root (or copy from `.env.example`)
2. Add your MongoDB connection string:

```
MONGODB_URI=your_connection_string_here
```

3. Restart your application

## Testing Your Connection

You can test your MongoDB connection by running:

```bash
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(err => console.error('Connection error:', err))"
```

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Connection Guide](https://mongoosejs.com/docs/connections.html)
- [MongoDB Connection Troubleshooting](https://docs.mongodb.com/manual/reference/connection-string/)