const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const newArticleCard = `                <a href="article-2026-high-cost-performance-vpn-airport.html" class="article-card">
                    <span class="tag tag-hot">热门</span>
                    <h4>2026稳定机场推荐：适合 ChatGPT、Netflix、YouTube 的高性价比 VPN机场指南</h4>
                    <p>在 2026 年，很多用户选择 VPN机场，是为了在日常使用中获得更稳定流畅的网络体验...</p>
                </a>`;

const insertIndex = indexHtml.indexOf('</div>', indexHtml.indexOf('class="grid-2 article-grid"'));

if (insertIndex !== -1) {
    indexHtml = indexHtml.substring(0, insertIndex) + newArticleCard + '\\n            ' + indexHtml.substring(insertIndex);
    fs.writeFileSync('index.html', indexHtml);
    console.log('Successfully updated index.html');
} else {
    console.log('Failed to find insert location');
}
