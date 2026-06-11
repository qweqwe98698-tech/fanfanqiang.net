const fs = require('fs');

const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

const target1 = `<div class="card category-card">
                    <div class="card-icon">🌐</div>
                    <h3>VPN 科普</h3>
                    <p>深入浅出解析网络协议，了解翻墙背后的技术原理，保护您的隐私与安全。</p>
                    <a href="article-vpn-knowledge.html" class="card-link">去看看 <span>→</span></a>
                </div>`;

const target2 = `<div class="card category-card">
                    <div class="card-icon">❓</div>
                    <h3>常见问题</h3>
                    <p>汇总使用过程中遇到的疑难杂症，提供详尽的排查方案与解决办法。</p>
                    <a href="#faq" class="card-link">去看看 <span>→</span></a>
                </div>`;

// Wait, the links might have been modified by optimize_seo_html.js, adding rel="nofollow" target="_blank"
// since article-vpn-knowledge.html and #faq are relative links, they SHOULD NOT have been modified.
// Let's use Regex to be safe.

const regex1 = /<div class="card category-card">\s*<div class="card-icon">🌐<\/div>\s*<h3>VPN 科普<\/h3>[\s\S]*?<\/div>/;
const regex2 = /<div class="card category-card">\s*<div class="card-icon">❓<\/div>\s*<h3>常见问题<\/h3>[\s\S]*?<\/div>/;

const replacement1 = `<div class="card category-card">
                    <div class="card-icon" style="color: #ff9f43;">🍎</div>
                    <h3>免费ID共享</h3>
                    <p>每日更新、实时状态监测的高质量美区苹果账号，一键解决您的海外应用下载难题。</p>
                    <a href="apple-id-shared.html" class="card-link" style="color: #ff9f43;">去看看 <span>→</span></a>
                </div>`;

const replacement2 = `<div class="card category-card">
                    <div class="card-icon" style="color: #ff9f43;">🌐</div>
                    <h3>网址导航</h3>
                    <p>出海必备的工具与网站合集。涵盖 AI 效率神器、流媒体追剧、主流社交与在线排障。</p>
                    <a href="nav.html" class="card-link" style="color: #ff9f43;">去看看 <span>→</span></a>
                </div>`;

content = content.replace(regex1, replacement1);
content = content.replace(regex2, replacement2);

fs.writeFileSync(file, content);
console.log("Successfully replaced cards in index.html");
