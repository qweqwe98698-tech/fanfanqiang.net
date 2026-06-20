import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
    console.error("Error: DEEPSEEK_API_KEY is not set in environment variables. Please set it before running this script.");
    process.exit(1);
}

const prompt = `你是一个专业的翻墙机场、VPN、SEO博客作者。请用简体中文写一篇关于2026年翻墙机场推荐、科学上网、或者是流媒体解锁（Netflix/ChatGPT）的硬核干货文章。
要求：
1. 切入点具体、具有实操指导意义。
2. 篇幅与深度：文章长度控制在 1800 - 3000 字之间。提供深度的技术剖析和详尽的步骤说明。
3. 结构排版要求：使用 Markdown 格式。
4. 返回严格的 JSON 格式，包含："title" (文章标题), "description" (简短描述, 100字左右), "content" (文章的Markdown正文内容)。`;

async function callDeepSeekAPI() {
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
    return JSON.parse(data.choices[0].message.content);
}

async function generateArticle() {
    console.log("Generating article using DeepSeek API...");
    try {
        const article = await callDeepSeekAPI();
        
        const d = new Date();
        const utc8Time = new Date(d.getTime() + 8 * 60 * 60 * 1000);
        const dateStr = utc8Time.toISOString().split('T')[0];
        
        // Generate a random ID for multiple articles a day
        const uniqueId = Math.floor(Math.random() * 10000);
        const slug = `article-auto-daily-${dateStr}-${uniqueId}`;
        const fileName = `${slug}.md`;
        
        const contentDir = path.join(__dirname, '../src/content/articles');
        if (!fs.existsSync(contentDir)) {
            fs.mkdirSync(contentDir, { recursive: true });
        }

        const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${article.description.replace(/"/g, '\\"')}"
pubDate: "${dateStr}"
---

${article.content}

<!-- 内链推广组件 -->
<div style="background-color: #ffffff; border: 2px solid #7BA05B; padding: 25px; margin: 40px 0; border-radius: 16px; text-align: center;">
    <span style="background-color: #FFEDD5; color: #C2410C; padding: 4px 12px; border-radius: 20px; font-weight: bold;">🔥 2026 站长极力推荐</span>
    <h4 style="margin: 10px 0;">不想折腾？直接看 2026 最新稳定机场榜单</h4>
    <a href="/airports" style="display: inline-block; background-color: #7BA05B; color: #fff; padding: 14px 35px; border-radius: 50px; text-decoration: none; margin-top: 10px;">查看完整推荐榜单 ✈️</a>
</div>
`;

        fs.writeFileSync(path.join(contentDir, fileName), frontmatter);
        console.log(`✅ Successfully generated: ${fileName}`);
        
    } catch (error) {
        console.error("Failed to generate article:", error);
    }
}

generateArticle();
