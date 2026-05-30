const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let issues = {
    missingAlt: [],
    h1Count: [],
    missingCanonical: []
};

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    // Check missing Alt
    const imgRegex = /<img\s+[^>]*>/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(content)) !== null) {
        if (!imgMatch[0].includes('alt=')) {
            issues.missingAlt.push(file);
            break; // just record the file
        }
    }

    // Check H1
    const h1Count = (content.match(/<h1[^>]*>/g) || []).length;
    if (h1Count !== 1) {
        issues.h1Count.push(`${file} (Found ${h1Count})`);
    }

    // Check Canonical
    if (!content.includes('rel="canonical"')) {
        issues.missingCanonical.push(file);
    }
}

console.log('--- SEO Health Check ---');
console.log(`Files with missing alt tags: ${issues.missingAlt.length > 0 ? issues.missingAlt.join(', ') : 'None'}`);
console.log(`Files with H1 issues (not exactly 1): ${issues.h1Count.length > 0 ? issues.h1Count.join(', ') : 'None'}`);
console.log(`Files missing canonical tag: ${issues.missingCanonical.length > 0 ? issues.missingCanonical.join(', ') : 'None'}`);
