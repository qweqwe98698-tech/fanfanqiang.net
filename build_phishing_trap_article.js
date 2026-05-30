const fs = require('fs');

const templatePath = 'article-vpn-trends-2026.html';
let template = fs.readFileSync(templatePath, 'utf-8');

const newTitle = '假官网与搜索引擎钓鱼陷阱：2026 年下载快连和机场客户端为什么一定要认准官方？ | 翻茄笔记';
template = template.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);

template = template.replace(/<h1 class="hero-title"([^>]*)>.*?<\/h1>/, `<h1 class="hero-title"$1>假官网与搜索引擎钓鱼陷阱：2026 年下载快连和机场客户端为什么一定要认准官方？</h1>`);

template = template.replace(/<p class="hero-subtitle"([^>]*)>.*?<\/p>/, `<p class="hero-subtitle"$1>深度揭露 VPN 圈泛滥的搜索引擎钓鱼陷阱，教你识别高仿官网、假安装包，守护网络安全。</p>`);

const newMetaDesc = "2026年，快连和知名机场的假官网、钓鱼网站泛滥。本文揭秘搜索引擎里的钓鱼陷阱，提醒用户下载 VPN 客户端一定要认准官方渠道，避免账号资金被盗。";
template = template.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${newMetaDesc}">`);

const newArticleContent = `
<div class="article-body">
    <p class="lead-text">进入 2026 年以后，机场和 VPN 用户面临的风险，已经不只是跑路和节点全红，还有一个越来越严重的问题：假官网和钓鱼网站泛滥。因为快连 LetsVPN、Nexitally 等知名品牌搜索量大，大量仿冒网站、假下载站、钓鱼机场开始利用搜索引擎截流。</p>
    
    <div class="highlight-box">
        <p><strong>🎯 安全警报：</strong>很多新手用户遇到节点失效时，会临时搜索“快连官网”或“机场推荐官网”。结果点进去的不仅不是官方，反而可能是带恶意安装包的钓鱼站。这也是为什么社区反复提醒：不要在搜索引擎第一页随便点链接下载 VPN。</p>
    </div>

    <h2>一、为什么假官网和钓鱼机场越来越多？</h2>
    <p>钓鱼站专挑用户着急、判断力下降的场景下手。比如：主力机场失效急着下载快连备用；找不到最新地址急着续费；被“破解版”“免费版”诱导。只要有流量，就会有钓鱼站利用 SEO 抢排名截流。</p>

    <h2>二、假官网与钓鱼陷阱的常见套路</h2>
    <ul>
        <li><strong>域名高度伪装：</strong>多加一个字母或后缀（如 download, vip, cn），欺骗只看标题不看域名的用户。</li>
        <li><strong>页面高度仿冒：</strong>全盘复制官方的 Logo、配色、按钮。</li>
        <li><strong>篡改安装包：</strong>提供包含后门、广告或窃取剪贴板数据的 EXE / APK 文件。</li>
        <li><strong>假客服代付：</strong>诱导私下转账，购买所谓的“内部低价账号”。</li>
    </ul>

    <h2>三、为什么 VPN 钓鱼站更危险？</h2>
    <p>因为 VPN 工具会接管整个设备的网络连接。如果安装包被篡改，它理论上可以劫持流量，导致 Google 账号被盗、支付信息泄露、剪贴板加密货币地址被替换。风险远高于普通的流氓软件。</p>

    <h2>四、如何识别假网站并安全下载？</h2>
    <div class="highlight-box">
        <ol>
            <li><strong>不迷信搜索排名：</strong>搜索第一名可能是买的广告位或黑帽 SEO，不代表官方。</li>
            <li><strong>看域名来源：</strong>认准官方公告群里公布的地址。</li>
            <li><strong>警惕“破解版”：</strong>VPN 没有安全的破解版，写“永久免费”的 99% 是木马。</li>
            <li><strong>优先应用商店：</strong>手机端尽量走官方 App Store 或 Google Play。</li>
        </ol>
    </div>

    <h2>五、误入钓鱼网站后应该怎么办？</h2>
    <p>如果已经下载了可疑软件：1. 立即停止使用并断网；2. 彻底卸载；3. 更改重要账号（Google/TG/邮箱/支付）密码；4. 开启两步验证（2FA）；5. 检查设备是否有异常启动项。</p>

    <h2>六、总结：安全防范从下载前开始</h2>
    <p>机场用户平时就要养成习惯：<strong>提前收藏官方入口、保存官方 TG 频道，不要等失联了才临时用百度/谷歌乱搜。</strong></p>
    <p>一句话总结：<strong>2026 年下载 VPN 或机场客户端，最重要的不是谁排在搜索第一，而是谁才是真正官方；认准正版渠道，比测速和价格更重要。</strong></p>
</div>
`;

template = template.replace(/<div class="article-body">[\s\S]*?<\/div>\s*<\/div>/, newArticleContent + '\n        </div>');

fs.writeFileSync('article-phishing-trap-2026.html', template);

let indexHtml = fs.readFileSync('index.html', 'utf8');

const newArticleCard = `
                <a href="article-phishing-trap-2026.html" class="article-card">
                    <span class="tag tag-orange" style="background-color: #e74c3c; color: white;">避坑防骗</span>
                    <h4>假官网与搜索引擎钓鱼陷阱：2026 年下载快连和机场客户端为什么一定要认准官方？</h4>
                    <p>深度揭露 VPN 圈泛滥的搜索引擎钓鱼陷阱，教你识别高仿官网、假安装包，守护网络安全。</p>
                </a>`;

const insertIndex = indexHtml.indexOf('</a>\n            </div>\n\n            <div class="essential-reading">');
if (insertIndex !== -1) {
    const targetIdx = indexHtml.lastIndexOf('</a>', insertIndex);
    if (targetIdx !== -1) {
        indexHtml = indexHtml.substring(0, targetIdx + 4) + '\n' + newArticleCard + indexHtml.substring(targetIdx + 4);
        fs.writeFileSync('index.html', indexHtml);
        console.log('Successfully updated index.html for phishing trap');
    }
} else {
    console.log('Could not find insert index');
}
