const fs = require('fs');

// --- 防止重复生成逻辑 ---
{
    const _fs = require('fs');
    const _path = require('path');
    
    // 获取北京时间 (UTC+8) 的日期 YYYY-MM-DD
    const d = new Date();
    const utc8Time = new Date(d.getTime() + 8 * 60 * 60 * 1000);
    const _today = utc8Time.toISOString().split('T')[0];
    
    const _marker = _path.join(__dirname, '.daily_run_date');
    const forceRun = process.env.FORCE_RUN === 'true';

    if (forceRun) {
        console.log("检测到强制运行环境变量 FORCE_RUN=true，跳过重复检查并继续生成！");
    } else if (_fs.existsSync(_marker)) {
        const _last = _fs.readFileSync(_marker, 'utf8');
        if (_last === _today) {
            console.log(`检测到北京时间今日 (${_today}) 已生成过文章，跳过生成以防重复！`);
            process.exit(0);
        }
    }
    _fs.writeFileSync(_marker, _today, 'utf8');
}
// ------------------------

const path = require('path');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
    console.error("Error: DEEPSEEK_API_KEY is not set in environment variables. Please add it to your GitHub Secrets.");
    process.exit(1);
}

// ==========================================
// 强化内部链接 (向主推文章倒流)
// ==========================================
const internalLinkCallToAction = `
    <div style="background-color: #ffffff; border: 2px solid #7BA05B; padding: 25px; margin: 40px 0; border-radius: 16px; box-shadow: 0 10px 25px rgba(123, 160, 91, 0.15); text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: linear-gradient(90deg, #7BA05B, #A3C9E2);"></div>
        <span style="background-color: #FFEDD5; color: #C2410C; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; margin-bottom: 15px; display: inline-block;">🔥 2026 站长极力推荐</span>
        <h4 style="margin: 10px 0 15px; color: #3A3A2A; font-size: 1.4rem; font-weight: 800;">不想折腾？直接看 2026 最新稳定机场榜单</h4>
        <p style="margin-bottom: 15px; color: #6C6C5E; font-size: 1rem; line-height: 1.6;">
            我们耗时 3 个月，实测了市面上 50+ 款主流节点服务，最终整理出这份 <strong>全网最稳、支持 ChatGPT / Netflix 解锁、晚高峰 4K 零卡顿</strong> 的高性价比榜单。
        </p>
        
        <div class="promo-box" data-code="FANFAN2026">
            <div class="promo-box-left" style="text-align: left;">
                <span class="promo-label">🎁 专属全场 8 折优惠码：</span>
                <span class="promo-code-text">FANFAN2026</span>
            </div>
            <div class="promo-copy-btn">一键复制</div>
        </div>

        <a href="airports.html" style="display: inline-block; background-color: #7BA05B; color: #fff; padding: 14px 35px; font-size: 1.1rem; font-weight: bold; text-decoration: none; border-radius: 50px; box-shadow: 0 6px 15px rgba(123, 160, 91, 0.3); transition: all 0.3s ease; margin-top: 10px;">
            查看完整 11 款精选机场推荐 ✈️
        </a>
    </div>
`;

async function callDeepSeekAPI() {
    const prompt = `你是一个专业的翻墙机场、VPN、SEO博客作者。请用简体中文写一篇关于2026年翻墙机场推荐、科学上网、或者是流媒体解锁（Netflix/ChatGPT）的干货文章。
要求：
1. 优先在【AI工具使用排障】、【流媒体解锁】、【Clash/Sing-box客户端配置】、【专线与直连技术科普】中随机选择一个主题深入撰写。
2. 行文风格要专业、务实，多穿插具体的技术名词（如 GeoIP 规则分流、住宅 IP、晚高峰 QoS 限制、BGP 中转），避免假大空的话。
3. 在文章正文中自然地融入与主题相关的关键词（如：2026稳定机场、科学上网梯子、VPN推荐、ChatGPT节点）。
4. 返回严格的 JSON 格式，必须包含两个字段："title" (文章标题，带吸引力) 和 "content" (文章的HTML正文内容)。
5. "content" 必须使用 HTML 标签（如 <h3>, <p>, <ul> 等）排版，**只包含内容部分**，不要包含 <html> 或 <body> 等外层标签。
6. 文章长度控制在 800 - 1500 字，内容要专业、客观。
7. 不要返回 markdown 的代码块标记，纯 JSON 字符串即可。`;

    let retries = 3;
    while (retries > 0) {
        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    response_format: { type: 'json_object' }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${await response.text()}`);
            }

            const data = await response.json();
            const textResult = data.choices[0].message.content;
            return JSON.parse(textResult);
        } catch (err) {
            console.error("DeepSeek API Call Failed:", err.message);
            retries--;
            if (retries === 0) throw err;
            console.log(`Retrying in 5 seconds... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

async function buildDailyArticles(count = 2) {
    // 获取北京时间 (UTC+8) 的日期 YYYY-MM-DD
    const d = new Date();
    const utc8Time = new Date(d.getTime() + 8 * 60 * 60 * 1000);
    const dateStr = utc8Time.toISOString().split('T')[0];
    
    const templatePath = 'article-vpn-trends-2026.html';
    if (!fs.existsSync(templatePath)) {
        console.error(`Error: Template ${templatePath} not found!`);
        return;
    }
    const templateStr = fs.readFileSync(templatePath, 'utf-8');
    
    let indexHtml = fs.readFileSync('index.html', 'utf-8');
    let cardsHtml = "";
    let generatedUrls = [];

    for (let i = 1; i <= count; i++) {
        console.log(`Generating article ${i} using DeepSeek API...`);
        let article;
        try {
            article = await callDeepSeekAPI();
        } catch (error) {
            console.error(`Failed to generate article ${i}. Skipping.`);
            continue;
        }

        const fileName = `article-auto-daily-${dateStr}-${i}.html`;
        
        let newTemplate = templateStr;
        newTemplate = newTemplate.replace(/<title>.*?<\/title>/, `<title>${article.title} | 翻茄笔记</title>`);
        newTemplate = newTemplate.replace(/<h1 class="hero-title"([^>]*)>.*?<\/h1>/, `<h1 class="hero-title"$1>${article.title}</h1>`);
        
        const shortDesc = article.content.replace(/<[^>]+>/g, '').substring(0, 100) + "...";
        newTemplate = newTemplate.replace(/<p class="hero-subtitle"([^>]*)>.*?<\/p>/, `<p class="hero-subtitle"$1>${shortDesc}</p>`);
        newTemplate = newTemplate.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${shortDesc}">`);
        
        // 自动注入内链矩阵
        const internalLinks = [
            { keyword: 'Clash', url: 'article-client-tutorials.html' },
            { keyword: 'Shadowrocket', url: 'article-client-tutorials.html' },
            { keyword: '机场推荐', url: 'airports.html' },
            { keyword: '机场节点', url: 'article-how-to-choose-airport-node.html' },
            { keyword: 'VPN', url: 'article-vpn-knowledge.html' }
        ];
        
        let linkedContent = article.content;
        for (const link of internalLinks) {
            // 仅替换首次出现的关键词，避免过度优化
            const regex = new RegExp(`(?<!<a[^>]*>)(${link.keyword})(?![^<]*</a>)`, 'i');
            linkedContent = linkedContent.replace(regex, `<a href="${link.url}" class="text-link" target="_blank">$1</a>`);
        }
        
        const finalContent = `<div class="article-body">\n${linkedContent}\n${internalLinkCallToAction}\n</div>`;
        newTemplate = newTemplate.replace(/<div class="article-body">[\s\S]*?<\/div>\s*<\/div>/, finalContent + '\n        </div>');
        
        fs.writeFileSync(fileName, newTemplate);
        console.log(`Generated: ${fileName}`);
        generatedUrls.push(fileName);

        cardsHtml += `
                <a href="${fileName}" class="article-card">
                    <span class="tag tag-edu" style="background-color: #27ae60; color: white;">每日更新</span>
                    <h4>${article.title}</h4>
                    <p>${shortDesc}</p>
                </a>`;
                
        // Delay to avoid hitting rate limits
        if (i < count) {
            console.log("Waiting 10 seconds before next request...");
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }

    if (cardsHtml) {
        const regex = /(<\/a>\s*)(<\/div>\s*<div class="essential-reading">)/;
        if (regex.test(indexHtml)) {
            indexHtml = indexHtml.replace(regex, `$1${cardsHtml}\n            $2`);
            
            // Limit daily articles to maximum 8
            const dailyArticleRegex = /<a href="article-auto-daily-[^>]+>[\s\S]*?<span class="tag[^>]+>每日更新<\/span>[\s\S]*?<\/a>\s*/g;
            const matches = indexHtml.match(dailyArticleRegex);
            if (matches && matches.length > 8) {
                const toRemove = matches.slice(0, matches.length - 8);
                for (const item of toRemove) {
                    indexHtml = indexHtml.replace(item, '');
                }
                console.log(`Trimmed ${toRemove.length} old daily articles from index.html`);
            }

            fs.writeFileSync('index.html', indexHtml);
            console.log('Successfully updated index.html with new daily articles.');
        } else {
            console.log('Could not find insert index in index.html');
        }
    }

    // 全站 HTML 性能与 SEO 优化 (Lazy Loading, Nofollow)
    try {
        require('child_process').execSync('node optimize_seo_html.js', {stdio: 'inherit'});
        console.log('✅ HTML SEO optimizations applied automatically.');
    } catch (e) {
        console.error('❌ Failed to optimize HTML SEO:', e.message);
    }

    // 自动更新 Apple ID
    try {
        require('child_process').execSync('node update_apple_ids.js', {stdio: 'inherit'});
        console.log('✅ Apple IDs updated automatically.');
    } catch (e) {
        console.error('❌ Failed to update Apple IDs:', e.message);
    }

    // 自动构建 SEO 蜘蛛网内链
    try {
        require('child_process').execSync('node build_spider_web.js', {stdio: 'inherit'});
        console.log('✅ SEO Spider Web updated automatically.');
    } catch (e) {
        console.error('❌ Failed to update spider web:', e.message);
    }

    // 自动更新 Sitemap
    try {
        require('child_process').execSync('node generate_sitemap.js', {stdio: 'inherit'});
        console.log('✅ Sitemap updated automatically.');
    } catch (e) {
        console.error('❌ Failed to update sitemap:', e.message);
    }

    // 自动推送 IndexNow API 秒收录
    if (generatedUrls.length > 0) {
        await pingIndexNow(generatedUrls);
    }
}

async function pingIndexNow(urls) {
    const host = 'fanfanqiang.net';
    const key = 'a846c243a41a4a408e0ab85489f64483'; 
    const endpoint = 'https://api.indexnow.org/indexnow';
    
    const keyFile = path.join(__dirname, `${key}.txt`);
    if (!fs.existsSync(keyFile)) {
        fs.writeFileSync(keyFile, key);
    }

    const payload = {
        host: host,
        key: key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList: urls.map(u => `https://${host}/${u}`)
    };

    try {
        console.log(`Pinging IndexNow with ${urls.length} new URLs...`);
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log('✅ IndexNow Ping Status:', res.status);
    } catch (e) {
        console.error('❌ IndexNow Ping Failed:', e.message);
    }
}

// 执行生成
buildDailyArticles(2);
