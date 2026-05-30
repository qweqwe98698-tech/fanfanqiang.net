const fs = require('fs');
const path = require('path');

const domain = 'https://fanfanqiang.net';
const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 避免重复注入
    if (content.includes('rel="canonical"')) {
        continue;
    }

    // 1. 提取 Title 和 Description
    let title = '翻茄笔记';
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch) title = titleMatch[1];

    let desc = '';
    const descMatch = content.match(/<meta name="description" content="(.*?)">/);
    if (descMatch) desc = descMatch[1];

    const canonicalUrl = `${domain}/${file === 'index.html' ? '' : file}`;

    // 2. 构建 SEO Meta 标签
    const seoMeta = `
    <!-- SEO & Social Meta Tags -->
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="${file.startsWith('article') ? 'article' : 'website'}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="翻茄笔记" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    `;

    content = content.replace('</head>', seoMeta + '\n</head>');

    // 3. 构建 Schema.org 结构化数据
    if (file === 'index.html') {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                { "@type": "Question", "name": "机场是什么？", "acceptedAnswer": { "@type": "Answer", "text": "“机场”是提供代理节点的网络服务的俗称，因早期主流代理软件 Shadowsocks 的图标是纸飞机而得名。机场通过提供配置好的服务器节点，帮助用户突破网络封锁，访问国际互联网。" } },
                { "@type": "Question", "name": "机场和 VPN 有什么区别？", "acceptedAnswer": { "@type": "Answer", "text": "传统 VPN 主要为了数据加密和企业内网穿透，协议特征明显，容易被防火墙识别封锁。而“机场”使用的是专门为突破封锁设计的代理协议（如 Shadowsocks, Vmess, Trojan），具备更好的伪装性和更快的速度。" } },
                { "@type": "Question", "name": "机场节点怎么选？", "acceptedAnswer": { "@type": "Answer", "text": "建议从以下几个维度选择：1. 线路质量（IPLC专线延迟低，直连适合大带宽需求）；2. 预算；3. 解锁需求（是否需要看 Netflix/Disney+）；4. 商家运营时间（老牌机场更稳定）。可以参考我们的《2026 稳定机场推荐指南》。" } },
                { "@type": "Question", "name": "Clash / Shadowrocket 如何导入订阅？", "acceptedAnswer": { "@type": "Answer", "text": "通常步骤是：在机场后台复制“订阅链接” -> 打开客户端 -> 找到“配置/订阅”添加 -> 粘贴链接并更新。具体请查看详细的 Clash 教程 和 Shadowrocket 教程。" } },
                { "@type": "Question", "name": "节点延迟高、ChatGPT 打不开怎么办？", "acceptedAnswer": { "@type": "Answer", "text": "延迟高可能是当前节点拥堵，尝试切换其他地区节点。ChatGPT 无法打开通常是因为该节点的 IP 被 OpenAI 封锁，建议使用原生 IP 节点或开启全局模式尝试，也可参考《ChatGPT 打不开怎么办》专项排障指南。" } }
            ]
        };
        const scriptTag = `\n<!-- Schema.org FAQ -->\n<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>\n`;
        content = content.replace('</body>', scriptTag + '</body>');
    } else if (file.startsWith('article-')) {
        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": desc,
            "author": { "@type": "Person", "name": "翻茄笔记" },
            "publisher": { "@type": "Organization", "name": "翻茄笔记", "logo": { "@type": "ImageObject", "url": "https://fanfanqiang.net/logo.png" } },
            "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
            "datePublished": "2026-05-30T00:00:00+08:00",
            "dateModified": new Date().toISOString()
        };
        const scriptTag = `\n<!-- Schema.org Article -->\n<script type="application/ld+json">\n${JSON.stringify(articleSchema, null, 2)}\n</script>\n`;
        content = content.replace('</body>', scriptTag + '</body>');
    }

    fs.writeFileSync(file, content);
    count++;
}

console.log(`SEO Optimized ${count} files (Canonical, OG Tags, Schema.org).`);
