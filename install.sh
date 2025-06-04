#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Display welcome message
echo "=== SpiceHub Installation Script ==="
echo "This script will help you install all necessary dependencies for SpiceHub."
echo ""

# Install main dependencies
echo "Installing main dependencies..."
npm install

# Install server dependencies explicitly
echo "Installing server dependencies..."
npm install jsonwebtoken bcryptjs mongoose express cors dotenv multer uuid

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo "Creating .env file from template..."
  cp .env.example .env
  echo "Please edit the .env file with your actual configuration values."
fi

# Test MongoDB connection
echo ""
echo "=== Testing MongoDB Connection ==="
if [ -f ".env" ]; then
  # Extract MongoDB URI from .env file
  MONGODB_URI=$(grep MONGODB_URI .env | cut -d '=' -f2)
  
  if [ ! -z "$MONGODB_URI" ]; then
    echo "Testing connection to MongoDB..."
    # Create a temporary test script
    cat > mongodb_test.js << EOL
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || '${MONGODB_URI}';

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => {
  console.log('MongoDB connection successful!');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('\nPlease check your MongoDB connection string in the .env file');
  console.log('For help, refer to the MONGODB_GUIDE.md file');
  process.exit(1);
});
EOL

    # Run the test script
    node mongodb_test.js
    
    # Remove the temporary test script
    rm mongodb_test.js
  else
    echo "MongoDB URI not found in .env file. Please configure it manually."
    echo "For help, refer to the MONGODB_GUIDE.md file"
  fi
else
  echo "No .env file found. MongoDB connection test skipped."
fi

# Build the frontend
echo ""
echo "=== Building Frontend ==="
echo "Building the frontend..."
npm run build

echo ""
echo "=== Installation Complete ==="
echo "You can now start the application with: npm start"
echo "For more information, please refer to the DEPLOYMENT.md file."
echo "If you encounter MongoDB connection issues, refer to the MONGODB_GUIDE.md file."