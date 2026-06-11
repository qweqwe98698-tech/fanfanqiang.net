const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f.startsWith('article-'));
let indexHtml = '';
try {
    indexHtml = fs.readFileSync('index.html', 'utf8');
} catch (e) {
    console.log('Could not read index.html');
}

const articleRegex = /<a href="(article-[^"]+\.html)" class="article-card">[\s\S]*?<h4>(.*?)<\/h4>/g;
let match;
const allArticles = [];

if (indexHtml) {
    while ((match = articleRegex.exec(indexHtml)) !== null) {
        allArticles.push({ href: match[1], title: match[2].trim() });
    }
}

// 补充不在 index.html 里的文件
files.forEach(file => {
    if (!allArticles.find(a => a.href === file)) {
        let content = fs.readFileSync(file, 'utf8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        if (titleMatch) {
            allArticles.push({ href: file, title: titleMatch[1].replace(' - 翻茄笔记', '').replace(' | 翻茄笔记', '').trim() });
        }
    }
});

console.log(`Found total ${allArticles.length} articles to build spider web.`);

let count = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 清除旧的相关文章或蜘蛛网链接区块（避免重复注入导致页面越来越大）
    content = content.replace(/<div class="related-articles"[^>]*>[\s\S]*?<\/div>\s*/g, '');
    content = content.replace(/<div class="spider-web-links"[^>]*>[\s\S]*?<\/div>\s*/g, '');
    
    // 寻找相似度最高（或随机）的文章，这里我们取 15 篇构建庞大蜘蛛网
    // 结合一些随机性，保证蜘蛛网足够紧密且各不相同
    const otherArticles = allArticles.filter(a => a.href !== file);
    const shuffled = otherArticles.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 16); // 16条内部链接
    
    if (selected.length === 0) continue;
    
    let webHtml = `\n    <div class="spider-web-links" style="margin-top: 50px; padding-top: 30px; border-top: 1px dashed #ccc;">\n        <h3 style="font-size: 1.25rem; margin-bottom: 20px; color: #2c3e50;">🕸️ 全站内容探索 (SEO Spider Web)</h3>\n        <div style="display: flex; flex-wrap: wrap; gap: 12px;">\n`;
    
    for (const item of selected) {
        // 使用类似标签云的样式
        webHtml += `            <a href="${item.href}" title="${item.title}" style="display: inline-block; padding: 6px 14px; background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 20px; font-size: 0.9rem; color: #4a5568; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" onmouseover="this.style.background='#ebf4ff';this.style.color='#3182ce';this.style.borderColor='#90cdf4';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#f8f9fa';this.style.color='#4a5568';this.style.borderColor='#e2e8f0';this.style.transform='translateY(0)'">${item.title}</a>\n`;
    }
    webHtml += `        </div>\n    </div>\n`;

    // 注入到底部
    content = content.replace(/(<\/div>\s*<\/div>\s*<\/section>|<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, (m) => {
        return webHtml + m;
    });
    
    fs.writeFileSync(file, content);
    count++;
}
console.log('Massive SEO Spider Web links added to ' + count + ' files.');
