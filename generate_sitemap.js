const fs = require('fs');

const domain = 'https://fanfanqiang.net';
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

const today = new Date().toISOString().split('T')[0];

for (const file of files) {
    let priority = '0.80';
    if (file === 'index.html') priority = '1.00';
    else if (file === 'airports.html') priority = '0.90';
    
    xml += `  <url>\n`;
    xml += `    <loc>${domain}/${file}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync('sitemap.xml', xml);
console.log('sitemap.xml generated with ' + files.length + ' URLs.');
