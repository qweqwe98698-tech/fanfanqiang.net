const fs = require('fs');
const content = fs.readFileSync('appark_raw.html', 'utf8');

const regex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
let i = 0;
while ((match = regex.exec(content)) !== null) {
    if (match[1].length > 100) {
        fs.writeFileSync(`script_content_${i}.js`, match[1]);
        console.log(`Saved script_content_${i}.js, length: ${match[1].length}`);
    }
    i++;
}
