const fs = require('fs');
const path = require('path');

// 关键词库
const keywords = [
    "翻墙机场推荐", "SSR节点", "V2Ray教程", "Trojan机场", "SS节点",
    "快连VPN", "便宜机场", "稳定机场", "游戏加速器", "AI专用节点",
    "ChatGPT节点", "流媒体解锁", "Netflix解锁", "原生IP", "住宅IP"
];

// 标题库
const titlePrefixes = ["2026年最新：", "深度测评：", "干货分享：", "新手必看：", "防坑指南："];
const titleCores = [
    "高性价比机场节点怎么选？",
    "流媒体解锁与AI专用节点评测",
    "快连VPN与传统专线机场对比",
    "原生IP与住宅IP的终极指南",
    "如何避免买到跑路机场？"
];

// 导语库 (独立导语)
const intros = [
    "随着2026年的到来，网络环境发生了翻天覆地的变化。无论是为了工作查阅资料、还是为了在闲暇时间观看Netflix 4K流媒体，或者是使用最新版本的ChatGPT等AI工具，一个稳定可靠的网络节点已经成为现代人的刚需。在众多选择中，如何避开各种坑，找到最适合自己的方案？本文将为您深度剖析当前的行业现状。",
    "经常有朋友问我：为什么别人用ChatGPT那么顺畅，而我总是遇到风控封号？为什么宣称千兆带宽的节点，晚上看视频却依然卡顿？其实，这里面涉及到了原生IP、线路质量、以及服务商的超售策略。今天，我们将通过大量实测数据和专业分析，为您揭开背后的秘密。",
    "如果你正在寻找一款长期稳定的科学上网工具，那么你一定面临过这样的纠结：是选择简单易用的快连等大厂VPN，还是购买性价比更高、配置更灵活的专线机场？在这个信息不对称的市场里，盲目跟风往往会让你付出不必要的试错成本。接下来的内容，将为你提供一套科学的评判标准。"
];

// 正文段落库 (用于动态拼接出超过 800 字的差异化内容)
const bodySections = {
    "protocol": [
        "<h3>一、底层协议的演进：从 SS 到 Trojan 与 VLESS</h3><p>了解翻墙技术的历史，有助于我们做出更好的选择。早期的 Shadowsocks (SS) 协议因为特征明显，如今已很容易被防火墙精准识别和封锁。随后出现的 V2Ray (VMess) 引入了更复杂的混淆机制。而到了今天，Trojan 和 VLESS 协议因为将流量伪装成正常的 HTTPS 网页浏览，成为了市场的主流。选择支持最新协议的服务商，是保证连接稳定性的第一步。</p>",
        "<h3>一、协议解析：为什么现在不推荐纯 SSR？</h3><p>尽管 SSR 曾经风靡一时，但其维护已然停滞，且抗封锁能力在不断升级的防火墙面前显得力不从心。现阶段，优秀的机场通常会采用 Trojan 或 Vmess/VLESS 结合 TLS 的方案。这不仅提高了安全性，还能在一定程度上降低延迟，提升用户的实际体验。所以，在购买前务必查看其支持的协议类型。</p>"
    ],
    "routing": [
        "<h3>二、线路解析：BGP、IPLC 与 IEPL 的区别</h3><p>很多小白用户容易被服务商宣传的各种专线名词弄晕。简单来说，普通的直连线路在晚高峰时段极易拥堵，导致丢包率飙升。而 BGP 线路能够智能选择最优路由，体验相对较好。真正的高端玩家则会追求 IPLC 或 IEPL 国际专线。这类专线不经过公网，因此不受防火墙干扰，延迟极低且全天候稳定，是游戏玩家和金融交易者的首选。</p>",
        "<h3>二、公网与专线：你的钱花在刀刃上了吗？</h3><p>市面上从几块钱到上百元一个月的服务都有，核心差异就在于线路成本。公网中转（如隧道中转）性价比高，能满足大部分人的刷网页和看视频需求。但如果你对延迟极度敏感（例如 FPS 游戏玩家），或者需要绝对的稳定性（例如外贸办公），那么价格昂贵的内网专线（IPLC/IEPL）才是你的最终归宿。切记，一分钱一分货是这个行业不变的真理。</p>"
    ],
    "ai_ip": [
        "<h3>三、AI 时代的挑战：原生 IP 与住宅 IP 的重要性</h3><p>2026年，ChatGPT、Claude 等 AI 平台对用户的 IP 审查越来越严格。很多常规的机房 IP （Datacenter IP）被大规模标记为代理，导致用户频繁遇到“Access Denied”或封号。为了解决这个问题，原生 IP（Native IP）甚至家庭住宅 IP（Residential IP）变得炙手可热。这类 IP 在 AI 平台眼中拥有极高的信誉度，几乎不会触发风控验证。</p>",
        "<h3>三、为什么你的 ChatGPT 总是报错？谈谈 IP 纯净度</h3><p>很多用户抱怨买的节点看 YouTube 很快，但就是打不开 ChatGPT。这是因为 AI 公司的反作弊系统会检测 IP 的纯净度。如果一个 IP 地址同时有几百上千人登录，必然会被拉黑。优质的机场会专门采购高质量的 ISP 住宅 IP 或原生 IP 来解锁这类严格的服务。因此，如果你是重度 AI 用户，务必向客服确认其节点是否原生解锁。</p>"
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

// 获取随机元素
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 在文本中随机插入关键词
function insertKeywords(text, numKeywords = 3) {
    let result = text;
    for (let i = 0; i < numKeywords; i++) {
        const keyword = getRandomElement(keywords);
        // 简单策略：将关键词加粗并尝试插入到段落中，或者替换某些常见词
        // 为了保持通顺，这里简单地在某些句子后附加相关提示，或用 <strong> 强调
        const injection = ` (同时需要注意 <strong>${keyword}</strong> 的相关配置) `;
        // 随机找一个句号插入
        const parts = result.split('。');
        if (parts.length > 1) {
            const insertIndex = Math.floor(Math.random() * (parts.length - 1));
            parts[insertIndex] += injection;
            result = parts.join('。');
        }
    }
    return result;
}

// 动态生成一篇文章
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

    // 打乱除了建议部分之外的顺序以增加差异化 (可选)
    // 这里保持一定逻辑顺序，但内容变体不同
    
    // 拼接并插入关键词
    let fullBody = contentBlocks.join('\n\n');
    fullBody = insertKeywords(fullBody, 5);
    
    // 估算字数，确保 > 800 字
    const charCount = (intro + fullBody).replace(/<[^>]+>/g, '').length;
    
    // 如果字数不够，可以再插入一些通用扩充段落，但现在的库一般能到1000字左右
    let extraText = "";
    if (charCount < 800) {
        extraText = "<p>此外，随着行业的发展，越来越多的用户开始关注隐私保护。在选择服务时，务必查看其隐私政策，确保不记录用户的访问日志。同时，推荐使用虚拟货币进行支付，以最大限度地保护个人信息安全。网络环境的复杂性要求我们不断学习和更新知识，这样才能在数字世界中游刃有余。</p>";
    }

    const htmlContent = `
<div class="article-body">
    <p class="lead-text">${insertKeywords(intro, 1)}</p>
    
    ${fullBody}
    ${extraText}
    
    <div class="highlight-box">
        <p><strong>💡 最终建议：</strong> 结合上述 <strong>${getRandomElement(keywords)}</strong> 和 <strong>${getRandomElement(keywords)}</strong> 的知识点，建议大家根据自己的实际预算和应用场景（如 AI 办公、游戏、流媒体）来做出最适合的决策。</p>
    </div>
</div>
`;
    
    return { title, content: htmlContent };
}

// 生成指定数量的文章并保存
function buildDailyArticles(count = 2) {
    const dateStr = new Date().toISOString().split('T')[0];
    
    // 读取模板
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

        // 准备更新 index.html 的卡片
        cardsHtml += `
                <a href="${fileName}" class="article-card">
                    <span class="tag tag-edu" style="background-color: #27ae60; color: white;">每日更新</span>
                    <h4>${article.title}</h4>
                    <p>${shortDesc}</p>
                </a>`;
    }

    // 更新 index.html
    const insertIndex = indexHtml.indexOf('</a>\n            </div>\n\n            <div class="essential-reading">');
    if (insertIndex !== -1) {
        const targetIdx = indexHtml.lastIndexOf('</a>', insertIndex);
        if (targetIdx !== -1) {
            indexHtml = indexHtml.substring(0, targetIdx + 4) + '\n' + cardsHtml + indexHtml.substring(targetIdx + 4);
            fs.writeFileSync('index.html', indexHtml);
            console.log('Successfully updated index.html with new daily articles.');
        }
    } else {
        console.log('Could not find insert index in index.html');
    }
}

// 执行生成
buildDailyArticles(2);
