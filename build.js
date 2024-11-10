const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const updatedContent = content.replace(/\$\{process\.env\.GOOGLE_MAPS_API_KEY\}/g, process.env.GOOGLE_MAPS_API_KEY);
fs.writeFileSync('dist/index.html', updatedContent);
