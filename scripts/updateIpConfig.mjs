'use strict';

import fs from 'fs';
import { networkInterfaces } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

const configPath = path.resolve(__dirname, '../devEnvConfig.env.ts');

// Detect the local network IP address
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

// Target the first IP address found in the results
const targetIp = Object.values(results)[0] ? Object.values(results)[0][0] : '127.0.0.1'; // Default if no IP found

// Read the existing config file
fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading config file:', err);
        return;
    }

    // Update the IP in the config content
    const updatedConfig = data.replace(/ip\s*:\s*'.*?'/, `ip : '${targetIp}'`);

    // Write the updated content back to the file
    fs.writeFile(configPath, updatedConfig, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to config file:', err);
        } else {
            console.log(`Config file updated with new IP: ${targetIp}`);
        }
    });
});
