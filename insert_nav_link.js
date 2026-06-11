const fs = require('fs');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 避免重复添加
    if (!content.includes('<a href="nav.html"')) {
        // 头部导航添加
        if (content.includes('<a href="article-vpn-knowledge.html">VPN科普</a>')) {
            content = content.replace(
                '<a href="article-vpn-knowledge.html">VPN科普</a>',
                '<a href="article-vpn-knowledge.html">VPN科普</a>\n                <a href="nav.html" style="color: #ff9f43; font-weight: bold;">网址导航</a>'
            );
            changed = true;
        }

        // 底部导航添加
        if (content.includes('<li><a href="index.html#faq">常见问题</a></li>')) {
            content = content.replace(
                '<li><a href="index.html#faq">常见问题</a></li>',
                '<li><a href="index.html#faq">常见问题</a></li>\n                        <li><a href="nav.html">网址导航</a></li>'
            );
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(file, content);
            count++;
        }
    }
}

console.log(`Successfully added nav.html link to ${count} files.`);
