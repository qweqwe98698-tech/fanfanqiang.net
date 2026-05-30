const fs = require('fs');

const templatePath = 'article-vpn-trends-2026.html';
let template = fs.readFileSync(templatePath, 'utf-8');

// Title
const newTitle = '2026年机场主防盗神技：教你实现一次性链接+多重绑定，盗用率降至0 | 翻茄笔记';
template = template.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);

// h1
template = template.replace(/<h1 class="hero-title"([^>]*)>.*?<\/h1>/, `<h1 class="hero-title"$1>2026年机场主防盗神技：订阅链接被盗用？教你3分钟实现一次性链接+多重绑定，盗用率降至0</h1>`);

// subtitle
template = template.replace(/<p class="hero-subtitle"([^>]*)>.*?<\/p>/, `<p class="hero-subtitle"$1>多层防御 + 动态控制 + 最小暴露原则，让订阅链接泄露也难以被滥用</p>`);

// meta desc
const newMetaDesc = "作为机场VPN主，如何高效确保订阅链接安全，防止盗用与滥用。本文详细解析一次性链接、IP设备多重绑定、防解析保护等2026年最新防盗技术。";
template = template.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${newMetaDesc}">`);

const newArticleContent = `
<div class="article-body">
    <p class="lead-text">作为机场VPN主，如何高效确保订阅链接安全，防止盗用与滥用。方法论核心：多层防御 + 动态控制 + 最小暴露原则。</p>
    <p>目标是让订阅链接即使泄露也难以被长期盗用、批量滥用或反向解析节点信息。实现高效：自动化生成、服务器端验证、快速失效机制，减少人工干预，同时提升用户体验和留存率。以下是完整实战方案，结合2026年主流做法。</p>

    <h2>1. 基础防护：令牌化 + 唯一标识订阅</h2>
    <p>生成订阅时绑定用户唯一ID：每个付费用户生成专属token（如UUID + 用户ID哈希 + 时间戳）。订阅链接格式：<code>https://yourdomain.com/sub?token=long-random-string&user=xxx</code>。</p>
    <p>服务器端强制验证：后端（Node.js/Go/Python）检查token有效性、用户订阅状态、到期时间。无效直接返回空或假节点。</p>
    <p>高效实现：用Redis缓存token状态，TTL设为订阅周期。数据库记录最后使用IP/UA，异常时自动封禁。代码示例（伪码）：</p>
<pre><code>def get_sub(token):
    user = validate_token(token)
    if not user or expired: return fake_nodes()
    log_access(user, request.ip, request.ua)
    return generate_config(user)</code></pre>
    <p>这能防止链接被随意分享后无限使用。</p>

    <h2>2. 主流做法：一次性链接（One-Time Links）与短效链接</h2>
    <p>市面上许多服务采用一次性或限次链接。用户首次访问后，token立即失效或转换为设备绑定状态。</p>
    <p><strong>实现步骤：</strong></p>
    <ul>
        <li>生成链接时设置one_time=true，Redis记录使用状态。</li>
        <li>访问后立即删除/标记token，或生成新token返回给客户端（客户端自动更新订阅）。</li>
        <li>限次版本：允许5-10次初始激活（覆盖多设备），之后绑定设备指纹。</li>
        <li>高效工具：Cloudflare Worker + KV/R2 实现无服务器后端。参考开源项目如psub，Worker部署后可自定义后端逻辑，防止第三方转换服务泄露。</li>
    </ul>
    <p><strong>优势：</strong>链接泄露后，盗用者只能用一次或短时间。用户通过客户端“刷新订阅”获取新链接。</p>
    <p><strong>2026年优化：</strong>结合UA检测（Clash/V2rayN/Shadowrocket特定UA），返回对应格式配置；非预期UA返回混淆或空数据。</p>

    <h2>3. IP/设备绑定 + 动态限制</h2>
    <p><strong>初次激活绑定：</strong>首次订阅访问记录IP/设备指纹（浏览器指纹 + IP + UA哈希）。后续访问必须匹配或在允许偏差内。</p>
    <p><strong>多设备支持：</strong>允许用户后台管理“授权设备”，上限根据套餐（基础3台，高配无限）。</p>
    <p><strong>实现：</strong>后端用数据库存user_id -> list of (ip_hash, device_hash, last_active)。超过上限踢掉最旧的，或要求验证码。</p>
    <p><strong>地理限制：</strong>中国用户订阅仅允许CN IP激活，防止海外批量盗用。</p>
    <p><strong>流量/并发监控：</strong>异常高并发（同一IP多设备）自动降速或暂停。使用Prometheus + Grafana实时监控。</p>
    <p><strong>高效达成：</strong>集成到面板系统（如V2Board、SSPanel改版），用户仪表盘一键管理授权设备。自动化脚本每天清理过期绑定。</p>

    <h2>4. 防解析与节点保护</h2>
    <ul>
        <li><strong>避免直接暴露节点：</strong>订阅返回base64/加密配置，节点信息动态生成（IP/端口/密码随机化或短期有效）。</li>
        <li><strong>订阅转换安全：</strong>自建私有转换后端（CF Worker），或只允许信任UA转换。公开转换服务风险高，可能被RCE或日志盗取。</li>
        <li><strong>混淆节点：</strong>返回给未验证请求的“蜜罐节点”（假IP或低速），记录盗用IP加入黑名单。</li>
        <li><strong>定期轮换：</strong>核心节点每7-30天轮换密码/端口，订阅自动更新。</li>
    </ul>

    <h2>5. 高级技术：签名验证 + 加密传输</h2>
    <ul>
        <li><strong>HMAC签名：</strong>链接带<code>sig=hash(token+secret+timestamp)</code>，服务器验证防篡改。</li>
        <li><strong>HTTPS强制 + HSTS：</strong>所有订阅域名启用TLS 1.3。</li>
        <li><strong>客户端侧：</strong>推荐用户使用支持订阅更新的客户端，设置自动刷新间隔。</li>
        <li><strong>后端隔离：</strong>订阅服务单独部署在不同服务器/Worker，与节点服务器解耦。使用API Gateway限流（例如：每分钟10请求/用户）。</li>
    </ul>

    <h2>6. 用户侧引导与面板功能（提升转化）</h2>
    <ul>
        <li><strong>注册/购买后立即引导“安全使用订阅”：</strong>警告勿分享、启用设备绑定、设置密码保护面板。</li>
        <li><strong>面板功能：</strong>一键重置订阅链接、查看访问日志、黑名单管理。</li>
        <li><strong>批量生成：</strong>管理员后台支持为推广用户生成临时试用一次性链接（24h有效）。</li>
    </ul>
    <p><strong>实施效率：</strong></p>
    <ul>
        <li>技术栈推荐：后端Go/Fiber或Python FastAPI，前端Vue/React面板。数据库PostgreSQL + Redis。</li>
        <li>部署：Docker + Cloudflare CDN/WAF防护DDoS。监控异常访问自动告警。</li>
        <li>测试：模拟分享链接，验证盗用者无法长期使用；压力测试高并发。</li>
        <li>成本：低，Worker免费额度足够小中机场，规模化用自有服务器。</li>
    </ul>

    <h2>7. 2026年机场推荐与排名参考（结合安全实践）</h2>
    <p>在2026年，选择支持以上安全机制的机场至关重要。2026年机场推荐优先考虑节点稳定 + 订阅安全强的平台。</p>
    <p><strong>2026年VPN推荐顶级选项：</strong></p>
    <ul>
        <li><strong>高端IEPL专线机场：</strong>支持设备绑定、一次性激活链接，流量不虚标。</li>
        <li><strong>性价比王者：</strong>月付低至15-60元，支持Clash多格式，订阅带token验证。</li>
        <li><strong>机场排名（部分参考）：</strong>WgetCloud、Nice Cloud、Boost Net 等老牌，强调隐私保护与防盗用。用户可根据需求选IEPL或中转混合，优先有自建转换后端的。</li>
    </ul>
    <p>实际运营中，这些做法能将盗用率降至近零。一次性链接 + 绑定 + 监控组合最高效：用户方便（多设备无缝），黑产难利用（链接失效快）。</p>

    <h2>总结实战 Checklist：</h2>
    <div class="highlight-box">
        <ul>
            <li>强制token验证 + Redis状态。</li>
            <li>支持one-time / 短效链接。</li>
            <li>设备/IP绑定 + 日志监控。</li>
            <li>自建安全转换后端。</li>
            <li>定期轮换 + 异常自动响应。</li>
            <li>面板用户自助管理。</li>
        </ul>
    </div>
    <p>严格执行以上，订阅链接安全无忧，业务高效扩张。2026年机场主们，安全就是竞争力！结合2026年机场排名选对技术栈，你的机场将远超同行。</p>
</div>
`;

template = template.replace(/<div class="article-body">[\s\S]*?<\/div>/, newArticleContent);

fs.writeFileSync('article-airport-subscription-security.html', template);

let indexHtml = fs.readFileSync('index.html', 'utf8');

const newArticleCard = `
                <a href="article-airport-subscription-security.html" class="article-card">
                    <span class="tag tag-edu">科普</span>
                    <h4>2026年机场主防盗神技：订阅链接被盗用？教你3分钟实现一次性链接+多重绑定，盗用率降至0</h4>
                    <p>作为机场VPN主，如何高效确保订阅链接安全，防止盗用与滥用。方法论核心：多层防御 + 动态控制 + 最小暴露原则...</p>
                </a>`;

const insertIndex = indexHtml.indexOf('</a>\\n            </div>\\n\\n            <div class="essential-reading">');
if (insertIndex !== -1) {
    const targetIdx = indexHtml.lastIndexOf('</a>', insertIndex);
    if (targetIdx !== -1) {
        indexHtml = indexHtml.substring(0, targetIdx + 4) + '\\n' + newArticleCard + indexHtml.substring(targetIdx + 4);
        fs.writeFileSync('index.html', indexHtml);
        console.log('Successfully updated index.html');
    }
} else {
    // Fallback
    const targetIdx2 = indexHtml.lastIndexOf('</div>', indexHtml.indexOf('<div class="essential-reading">'));
    if (targetIdx2 !== -1) {
        // Need to find the exact last </a> before targetIdx2
        const lastA = indexHtml.lastIndexOf('</a>', targetIdx2);
        if (lastA !== -1) {
            indexHtml = indexHtml.substring(0, lastA + 4) + '\\n' + newArticleCard + indexHtml.substring(lastA + 4);
            fs.writeFileSync('index.html', indexHtml);
            console.log('Successfully updated index.html via fallback');
        }
    }
}

console.log('Successfully wrote article-airport-subscription-security.html');
