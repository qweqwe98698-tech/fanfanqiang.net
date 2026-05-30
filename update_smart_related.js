const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f.startsWith('article-'));
const indexHtml = fs.readFileSync('index.html', 'utf8');

const articleRegex = /<a href="(article-[^"]+\.html)" class="article-card">[\s\S]*?<h4>(.*?)<\/h4>/g;
let match;
const allArticles = [];

while ((match = articleRegex.exec(indexHtml)) !== null) {
    allArticles.push({ href: match[1], title: match[2].trim() });
}

// 简单的文本相似度算法 (Jaccard)
function getSimilarity(s1, s2) {
    const set1 = new Set(s1.split(''));
    const set2 = new Set(s2.split(''));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

let count = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 提取当前标题
    let currentTitle = '';
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch) currentTitle = titleMatch[1];
    
    // 如果已经有相关文章模块，先将其移除，方便重新注入
    content = content.replace(/<div class="related-articles"[^>]*>[\s\S]*?<\/div>\s*/, '');
    
    // 寻找相似度最高的3篇文章
    const candidates = allArticles.filter(a => a.href !== file);
    candidates.forEach(c => {
        c.score = getSimilarity(currentTitle, c.title);
    });
    
    // 按相似度降序排序
    candidates.sort((a, b) => b.score - a.score);
    const selected = candidates.slice(0, 3);
    
    if (selected.length === 0) continue;
    
    let relatedHtml = `\n    <div class="related-articles" style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee;">\n        <h3>📌 推荐阅读</h3>\n        <ul style="list-style: none; padding: 0; line-height: 1.8;">\n`;
    for (const item of selected) {
        relatedHtml += `            <li style="margin-bottom: 10px;">👉 <a href="${item.href}" style="color: #2980b9; text-decoration: none; font-weight: 500;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${item.title}</a></li>\n`;
    }
    relatedHtml += `        </ul>\n    </div>\n`;

    // 注入到底部
    content = content.replace(/(<\/div>\s*<\/div>\s*<\/section>|<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, (m) => {
        if (m.startsWith('</div>\n\n        </div>') || m.startsWith('</div>\n        </div>')) {
            return relatedHtml + m;
        }
        return relatedHtml + m;
    });
    
    fs.writeFileSync(file, content);
    count++;
}
console.log('Smart related articles added to ' + count + ' files.');
