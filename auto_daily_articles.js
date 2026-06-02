const fs = require('fs');
const path = require('path');

// ==========================================
// 1 & 2. 扩充长尾关键词库与语料库
// ==========================================
const keywords = [
    // 核心大词
    "翻墙机场推荐", "SSR节点", "V2Ray教程", "Trojan机场", "快连VPN", 
    "便宜机场", "稳定机场", "流媒体解锁", "Netflix解锁", "原生IP", "住宅IP",
    // 高转化长尾词（用户痛点）
    "玩 Valorant 怎么选低延迟节点", "Claude 3 封号怎么解决", 
    "支持微信/支付宝支付的便宜机场", "ChatGPT Plus 绑卡失败专用节点",
    "不记录日志的海外安全VPN", "适合留学生的低延迟便宜机场", 
    "外贸办公专用 IEPL 专线", "晚高峰不卡顿的机场节点", "如何防止买到跑路机场"
];

const titlePrefixes = ["2026年最新：", "深度测评：", "干货分享：", "新手必看：", "避坑指南：", "独家解析：", "硬核科普："];
const titleCores = [
    "高性价比机场节点怎么选？",
    "流媒体解锁与AI专用节点评测",
    "快连VPN与传统专线机场对比",
    "原生IP与住宅IP的终极指南",
    "如何避免买到随时跑路的小机场？",
    "为什么你的 ChatGPT 总是被封？节点选择是关键",
    "外贸与留学生必备：低延迟稳定网络环境搭建",
    "晚高峰看 4K 视频卡顿？你需要了解这些线路知识",
    "专线、BGP与公网中转：你的钱花在刀刃上了吗？"
];

const intros = [
    "随着2026年的到来，网络环境发生了翻天覆地的变化。无论是为了工作查阅资料、还是为了在闲暇时间观看Netflix 4K流媒体，或者是使用最新版本的ChatGPT等AI工具，一个稳定可靠的网络节点已经成为现代人的刚需。在众多选择中，如何避开各种坑，找到最适合自己的方案？本文将为您深度剖析当前的行业现状。",
    "经常有朋友问我：为什么别人用ChatGPT那么顺畅，而我总是遇到风控封号？为什么宣称千兆带宽的节点，晚上看视频却依然卡顿？其实，这里面涉及到了原生IP、线路质量、以及服务商的超售策略。今天，我们将通过大量实测数据和专业分析，为您揭开背后的秘密。",
    "如果你正在寻找一款长期稳定的科学上网工具，那么你一定面临过这样的纠结：是选择简单易用的快连等大厂VPN，还是购买性价比更高、配置更灵活的专线机场？在这个信息不对称的市场里，盲目跟风往往会让你付出不必要的试错成本。接下来的内容，将为你提供一套科学的评判标准。",
    "在这个信息大爆炸的时代，访问全球互联网已经不仅仅是一种娱乐需求，更是许多人学习和跨境办公的生产力工具。然而，市面上各类服务商鱼龙混杂，从几块钱的月付套餐到上百元的尊贵专线，让人眼花缭乱。今天我们不仅要谈价格，更要深挖背后的技术原理，教你一眼识破无良商家的套路。",
    "2026年的网络封锁策略已经进化到了全新的高度。传统的代理协议正在逐渐被淘汰，而 AI 平台的反作弊机制更是让许多劣质 IP 无处遁形。很多刚刚接触这个领域的小白，往往因为选错了工具而遭受账号被封、数据丢失的惨痛教训。为了避免重蹈覆辙，请务必耐心看完今天的深度指南。"
];

const bodySections = {
    "protocol": [
        "<h3>一、底层协议的演进：从 SS 到 Trojan 与 VLESS</h3><p>了解翻墙技术的历史，有助于我们做出更好的选择。早期的 Shadowsocks (SS) 协议因为特征明显，如今已很容易被防火墙精准识别和封锁。随后出现的 V2Ray (VMess) 引入了更复杂的混淆机制。而到了今天，Trojan 和 VLESS 协议因为将流量伪装成正常的 HTTPS 网页浏览，成为了市场的主流。选择支持最新协议的服务商，是保证连接稳定性的第一步。</p>",
        "<h3>一、协议解析：为什么现在不推荐纯 SSR？</h3><p>尽管 SSR 曾经风靡一时，但其维护已然停滞，且抗封锁能力在不断升级的防火墙面前显得力不从心。现阶段，优秀的机场通常会采用 Trojan 或 Vmess/VLESS 结合 TLS 的方案。这不仅提高了安全性，还能在一定程度上降低延迟，提升用户的实际体验。所以，在购买前务必查看其支持的协议类型。</p>",
        "<h3>一、伪装与加密：你的流量安全吗？</h3><p>很多人忽视了代理过程中的数据加密。如果你经常在不安全的公共 Wi-Fi 下连接节点，或者需要进行敏感数据的传输，协议的加密强度就变得至关重要。目前业界公认安全性较高的是基于 TLS 加密的传输层协议。它们不仅能有效防止中间人攻击，还能降低被 ISP 运营商进行深度包检测 (DPI) 识别的风险。</p>"
    ],
    "routing": [
        "<h3>二、线路解析：BGP、IPLC 与 IEPL 的区别</h3><p>很多小白用户容易被服务商宣传的各种专线名词弄晕。简单来说，普通的直连线路在晚高峰时段极易拥堵，导致丢包率飙升。而 BGP 线路能够智能选择最优路由，体验相对较好。真正的高端玩家则会追求 IPLC 或 IEPL 国际专线。这类专线不经过公网，因此不受防火墙干扰，延迟极低且全天候稳定，是游戏玩家和金融交易者的首选。</p>",
        "<h3>二、公网与专线：你的钱花在刀刃上了吗？</h3><p>市面上从几块钱到上百元一个月的服务都有，核心差异就在于线路成本。公网中转（如隧道中转）性价比高，能满足大部分人的刷网页和看视频需求。但如果你对延迟极度敏感（例如 FPS 游戏玩家），或者需要绝对的稳定性（例如外贸办公），那么价格昂贵的内网专线（IPLC/IEPL）才是你的最终归宿。切记，一分钱一分货是这个行业不变的真理。</p>",
        "<h3>二、晚高峰拥堵的真相：超售与带宽瓶颈</h3><p>“为什么白天看视频很流畅，一到晚上八九点就卡成 PPT？”这是无数用户共同的痛点。这种现象的根源在于国际出口带宽的拥堵以及服务商的“超售”行为。无良服务商为了追求利润，会让大量用户挤在有限的带宽上。要避开这个坑，要么选择具有独立 SLA 保证的高端专线，要么选择节点冗余度极高的大型服务商。</p>"
    ],
    "ai_ip": [
        "<h3>三、AI 时代的挑战：原生 IP 与住宅 IP 的重要性</h3><p>2026年，ChatGPT、Claude 等 AI 平台对用户的 IP 审查越来越严格。很多常规的机房 IP （Datacenter IP）被大规模标记为代理，导致用户频繁遇到“Access Denied”或封号。为了解决这个问题，原生 IP（Native IP）甚至家庭住宅 IP（Residential IP）变得炙手可热。这类 IP 在 AI 平台眼中拥有极高的信誉度，几乎不会触发风控验证。</p>",
        "<h3>三、为什么你的 ChatGPT 总是报错？谈谈 IP 纯净度</h3><p>很多用户抱怨买的节点看 YouTube 很快，但就是打不开 ChatGPT。这是因为 AI 公司的反作弊系统会检测 IP 的纯净度。如果一个 IP 地址同时有几百上千人登录，必然会被拉黑。优质的机场会专门采购高质量的 ISP 住宅 IP 或原生 IP 来解锁这类严格的服务。因此，如果你是重度 AI 用户，务必向客服确认其节点是否原生解锁。</p>",
        "<h3>三、不仅仅是 AI：跨境电商与社媒运营的 IP 策略</h3><p>不仅是 AI，如果你是做 TikTok 运营、外贸独立站或者是运营海外社交媒体矩阵，IP 的纯净度直接关系到账号的存亡。很多所谓的“广播 IP”虽然位置显示在美国，但实际可能是在其他国家注册的，这种不一致性极容易导致账号被限流甚至封禁。所以，针对业务需求选择干净的住宅 IP 节点，是赚钱的前提。</p>"
    ],
    "streaming": [
        "<h3>四、流媒体解锁：不仅仅是换个 IP 那么简单</h3><p>想要畅看 Netflix、Disney+ 或 HBO Max，节点不仅需要位于对应的国家，其 IP 还不能被流媒体官方的黑名单收录。很多便宜机场虽然提供美国节点，但只能看 Netflix 的自制剧（因为版权限制较少），无法观看非自制剧。专业的服务商会通过 DNS 解锁或动态 IP 路由技术，确保持续稳定地解锁全库流媒体资源。</p>",
        "<h3>四、追剧党的福音：如何测试流媒体解锁能力</h3><p>对于喜欢在流媒体平台上追剧的用户来说，节点的解锁能力至关重要。流媒体巨头们一直在与代理服务器进行着“猫鼠游戏”。今天能解锁的节点，明天可能就失效了。因此，选择那些承诺“流媒体解锁保证”且有技术实力快速更换被封 IP 的机场，才是明智之举。通常，提供台湾、新加坡、日本和美国优质线路的服务商是首选。</p>"
    ],
    "advice": [
        "<h3>五、防坑指南与选购建议</h3><p>在这个鱼龙混杂的市场中，“跑路”现象屡见不鲜。为了保护自己的权益，建议大家遵循以下几个原则：首先，尽量避免一次性购买年付甚至更长期的套餐，月付或季付是规避跑路风险的最好方式。其次，不要盲目追求极其低廉的价格，那种“10块钱1000G、全节点专线”的宣传往往是用来收割韭菜的噱头。最后，多参考独立的评测网站，或者先购买试用套餐进行实测。</p>",
        "<h3>五、总结：建立科学的备份机制</h3><p>没有任何一款工具可以保证 100% 永远在线。无论是不可抗力导致的断网，还是服务商自身的维护，都会造成使用中断。因此，对于重度依赖海外网络的用户，强烈建议建立“主用+备用”的机制。例如，你可以购买一个高质量的专线机场作为主力，同时在手机里安装类似快连VPN 这样的按流量计费或有免费试用的工具作为备用，以备不时之需。</p>"
    ]
};

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function insertKeywords(text, numKeywords = 3) {
    let result = text;
    for (let i = 0; i < numKeywords; i++) {
        const keyword = getRandomElement(keywords);
        const injection = ` (在此过程中强烈建议关注 <strong>${keyword}</strong> 的相关指标) `;
        const parts = result.split('。');
        if (parts.length > 1) {
            const insertIndex = Math.floor(Math.random() * (parts.length - 1));
            parts[insertIndex] += injection;
            result = parts.join('。');
        }
    }
    return result;
}

// ==========================================
// 3. 强化内部链接 (向主推文章倒流)
// ==========================================
const internalLinkCallToAction = `
    <div style="background-color: #f8f9fa; border-left: 5px solid #27ae60; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h4 style="margin-top: 0; color: #2c3e50;">🚀 懒人必看：2026年终极精选</h4>
        <p style="margin-bottom: 0;">如果您不想花时间逐一测试，可以直接查看我们耗时 3 个月实测整理的排行榜，里面包含了目前全网最稳定、性价比最高的节点推荐：
        <br><br>
        👉 <a href="article-2026-airport-recommendation-guide.html" style="font-weight: bold; color: #d35400; text-decoration: underline;">点击阅读：《2026年最新稳定高性价比机场推荐指南》</a>
        </p>
    </div>
`;

function generateArticle() {
    const title = getRandomElement(titlePrefixes) + getRandomElement(titleCores);
    const intro = getRandomElement(intros);
    
    // 随机选取每个部分的一个变体
    const contentBlocks = [
        getRandomElement(bodySections.protocol),
        getRandomElement(bodySections.routing),
        getRandomElement(bodySections.ai_ip),
        getRandomElement(bodySections.streaming),
        getRandomElement(bodySections.advice)
    ];
    
    let fullBody = contentBlocks.join('\n\n');
    fullBody = insertKeywords(fullBody, 5); // 穿插 5 个长尾关键词
    
    // 插入内部引流链接
    fullBody += internalLinkCallToAction;

    const htmlContent = `
<div class="article-body">
    <p class="lead-text">${insertKeywords(intro, 1)}</p>
    
    ${fullBody}
    
    <div class="highlight-box">
        <p><strong>💡 最终建议：</strong> 结合上述关于 <strong>${getRandomElement(keywords)}</strong> 的知识点，建议大家根据自己的实际预算和应用场景（如 AI 办公、游戏、流媒体）来做出最适合的决策。记住，网络安全和数据隐私永远是第一位的。</p>
    </div>
</div>
`;
    
    return { title, content: htmlContent };
}

function buildDailyArticles(count = 2) {
    const dateStr = new Date().toISOString().split('T')[0];
    
    const templatePath = 'article-vpn-trends-2026.html';
    if (!fs.existsSync(templatePath)) {
        console.error(`Error: Template ${templatePath} not found!`);
        return;
    }
    const templateStr = fs.readFileSync(templatePath, 'utf-8');
    
    let indexHtml = fs.readFileSync('index.html', 'utf-8');
    let cardsHtml = "";

    for (let i = 1; i <= count; i++) {
        const article = generateArticle();
        const fileName = `article-auto-daily-${dateStr}-${i}.html`;
        
        let newTemplate = templateStr;
        newTemplate = newTemplate.replace(/<title>.*?<\/title>/, `<title>${article.title} | 翻茄笔记</title>`);
        newTemplate = newTemplate.replace(/<h1 class="hero-title"([^>]*)>.*?<\/h1>/, `<h1 class="hero-title"$1>${article.title}</h1>`);
        
        const shortDesc = article.content.replace(/<[^>]+>/g, '').substring(0, 100) + "...";
        newTemplate = newTemplate.replace(/<p class="hero-subtitle"([^>]*)>.*?<\/p>/, `<p class="hero-subtitle"$1>${shortDesc}</p>`);
        newTemplate = newTemplate.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${shortDesc}">`);
        
        newTemplate = newTemplate.replace(/<div class="article-body">[\s\S]*?<\/div>\s*<\/div>/, article.content + '\n        </div>');
        
        fs.writeFileSync(fileName, newTemplate);
        console.log(`Generated: ${fileName}`);

        cardsHtml += `
                <a href="${fileName}" class="article-card">
                    <span class="tag tag-edu" style="background-color: #27ae60; color: white;">每日更新</span>
                    <h4>${article.title}</h4>
                    <p>${shortDesc}</p>
                </a>`;
    }

    const regex = /(<\/a>\s*)(<\/div>\s*<div class="essential-reading">)/;
    if (regex.test(indexHtml)) {
        indexHtml = indexHtml.replace(regex, `$1${cardsHtml}\n            $2`);
        fs.writeFileSync('index.html', indexHtml);
        console.log('Successfully updated index.html with new daily articles.');
    } else {
        console.log('Could not find insert index in index.html');
    }
}

// 执行生成
buildDailyArticles(2);
