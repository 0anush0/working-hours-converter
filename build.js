const fs = require('fs');
const path = require('path');

// Define the directory and file paths
const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

// Create 'dist' directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Read the original index.html file
const content = fs.readFileSync('index.html', 'utf8');

// Replace placeholder with actual API key
const updatedContent = content.replace(/\$\{process\.env\.GOOGLE_MAPS_API_KEY\}/g, process.env.GOOGLE_MAPS_API_KEY);

// Write the updated content to 'dist/index.html'
fs.writeFileSync(indexPath, updatedContent);

console.log(`'${indexPath}' has been created successfully.`);
