'use strict';

import fs from 'fs';
import { networkInterfaces } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your .env file
const envPath = path.resolve(__dirname, '../.env'); // Adjust path if needed

// Get local network IP
const nets = networkInterfaces();
let targetIp = '127.0.0.1'; // Default if no local IP found

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
    if (net.family === familyV4Value && !net.internal) {
      targetIp = net.address;
      break;
    }
  }
  if (targetIp !== '127.0.0.1') break;
}

// Read the .env file
fs.readFile(envPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading .env file:', err);
    return;
  }

  let updatedEnv;

  if (data.match(/^EXPO_PUBLIC_SERVER_IP\s*=/m)) {
    // Replace the line if it exists
    updatedEnv = data.replace(
      /^EXPO_PUBLIC_SERVER_IP\s*=.*$/m,
      `EXPO_PUBLIC_SERVER_IP='${targetIp}'`
    );
  } else {
    // Append the line if it doesn't exist
    updatedEnv = data.trim() + `\nEXPO_PUBLIC_SERVER_IP='${targetIp}'\n`;
  }

  // Write back the updated content
  fs.writeFile(envPath, updatedEnv, 'utf8', (err) => {
    if (err) {
      console.error('Error writing .env file:', err);
    } else {
      console.log(`.env updated with EXPO_PUBLIC_SERVER_IP='${targetIp}'`);
    }
  });
});
