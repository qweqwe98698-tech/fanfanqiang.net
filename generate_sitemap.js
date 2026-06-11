const fs = require('fs');

const domain = 'https://fanfanqiang.net';
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

const today = new Date().toISOString().split('T')[0];

for (const file of files) {
    let priority = '0.80';
    let changefreq = 'weekly';

    if (file === 'index.html' || file === 'airports.html') {
        priority = '1.00';
        changefreq = 'daily';
    } else if (file === 'apple-id-shared.html') {
        priority = '0.95';
        changefreq = 'daily'; // 每天更新账号
    } else if (file === 'nav.html' || file === 'article-client-tutorials.html' || file === 'article-vpn-knowledge.html') {
        priority = '0.90';
        changefreq = 'weekly';
    } else if (file.includes('article-auto-daily')) {
        priority = '0.85';
        changefreq = 'monthly'; // 新闻/日更文章发布后一般不修改
    }
    
    xml += `  <url>\n`;
    xml += `    <loc>${domain}/${file}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync('sitemap.xml', xml);
console.log('sitemap.xml generated with ' + files.length + ' URLs.');
