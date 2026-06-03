const fs = require('fs');
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
    <div style="background-color: #f8f9fa; border-left: 5px solid #27ae60; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h4 style="margin-top: 0; color: #2c3e50;">🚀 懒人必看：2026年终极精选</h4>
        <p style="margin-bottom: 0;">如果您不想花时间逐一测试，可以直接查看我们耗时 3 个月实测整理的排行榜，里面包含了目前全网最稳定、性价比最高的节点推荐：
        <br><br>
        👉 <a href="article-2026-airport-recommendation-guide.html" style="font-weight: bold; color: #d35400; text-decoration: underline;">点击阅读：《2026年最新稳定高性价比机场推荐指南》</a>
        </p>
    </div>
`;

async function callDeepSeekAPI() {
    const prompt = `你是一个专业的翻墙机场、VPN、SEO博客作者。请用简体中文写一篇关于2026年翻墙机场推荐、科学上网、或者是流媒体解锁（Netflix/ChatGPT）的干货文章。
要求：
1. 返回严格的 JSON 格式，必须包含两个字段："title" (文章标题，带吸引力) 和 "content" (文章的HTML正文内容)。
2. "content" 必须使用 HTML 标签（如 <h3>, <p>, <ul> 等）排版，**只包含内容部分**，不要包含 <html> 或 <body> 等外层标签。
3. 文章长度控制在 800 - 1500 字，内容要专业、客观，多谈干货（比如专线区别、防封号技巧、IP纯净度等）。
4. 不要返回 markdown 的代码块标记，纯 JSON 字符串即可。`;

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
        
        const finalContent = `<div class="article-body">\n${article.content}\n${internalLinkCallToAction}\n</div>`;
        newTemplate = newTemplate.replace(/<div class="article-body">[\s\S]*?<\/div>\s*<\/div>/, finalContent + '\n        </div>');
        
        fs.writeFileSync(fileName, newTemplate);
        console.log(`Generated: ${fileName}`);

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
            fs.writeFileSync('index.html', indexHtml);
            console.log('Successfully updated index.html with new daily articles.');
        } else {
            console.log('Could not find insert index in index.html');
        }
    }
}

// 执行生成
buildDailyArticles(2);
