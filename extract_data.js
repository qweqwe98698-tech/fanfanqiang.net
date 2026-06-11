const fs = require('fs');
const content = fs.readFileSync('appark_raw.html', 'utf8');

const regex = /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/;
const match = content.match(regex);

if (match && match[1]) {
    try {
        const data = JSON.parse(match[1]);
        fs.writeFileSync('next_data.json', JSON.stringify(data, null, 2));
        console.log("Extracted __NEXT_DATA__ successfully!");
    } catch (e) {
        console.log("Error parsing JSON:", e);
    }
} else {
    // If not next.js, check nuxt or other frameworks
    const nuxtRegex = /window\.__NUXT__\s*=\s*([\s\S]*?);<\/script>/;
    const nuxtMatch = content.match(nuxtRegex);
    if (nuxtMatch && nuxtMatch[1]) {
        fs.writeFileSync('nuxt_data.txt', nuxtMatch[1]);
        console.log("Extracted __NUXT__ successfully!");
    } else {
        console.log("No Next/Nuxt data found.");
    }
}
