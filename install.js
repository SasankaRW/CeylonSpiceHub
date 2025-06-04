// install.js - Script to ensure all dependencies are properly installed

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// List of essential server dependencies
const serverDependencies = [
  'jsonwebtoken',
  'bcryptjs',
  'mongoose',
  'express',
  'cors',
  'dotenv',
  'multer',
  'uuid'
];

console.log('Checking and installing server dependencies...');

// Check if each dependency is installed, and install if missing
serverDependencies.forEach(dep => {
  try {
    // Try to require the dependency
    require.resolve(dep);
    console.log(`✓ ${dep} is already installed`);
  } catch (e) {
    // If it fails, install it
    console.log(`Installing ${dep}...`);
    try {
      execSync(`npm install ${dep}`, { stdio: 'inherit' });
      console.log(`✓ ${dep} installed successfully`);
    } catch (installError) {
      console.error(`Error installing ${dep}:`, installError.message);
    }
  }
});

// Create a simple script to run the installation in cPanel
const shellScript = `#!/bin/bash
cd "$(dirname "$0")"
node install.js
`;

fs.writeFileSync(path.join(__dirname, 'install.sh'), shellScript, { mode: 0o755 });

console.log('\nInstallation script completed!');
console.log('You can run "node install.js" or "./install.sh" to check and install dependencies again.');
console.log('\nNext steps:');
console.log('1. Run "npm run build" to build the frontend');
console.log('2. Run "npm start" to start the server');