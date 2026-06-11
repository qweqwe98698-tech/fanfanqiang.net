const fs = require('fs');
const content = fs.readFileSync('appark_raw.html', 'utf8');
const urls = content.match(/https?:\/\/[^\s"'<>\\]+/g);
if (urls) {
    const apiUrls = urls.filter(u => u.includes('api') || u.includes('json') || u.includes('appark'));
    console.log("Found URLs:", [...new Set(apiUrls)]);
} else {
    console.log("No URLs found.");
}
