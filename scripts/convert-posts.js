import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function convertPosts() {
    const thinkingDir = path.join('D:', 'blog', 'src', 'pages', 'thinking');
    
    try {
        const files = await fs.readdir(thinkingDir);
        for (const file of files) {
            if (file.startsWith('周报') && file.endsWith('.md')) {
                const filePath = path.join(thinkingDir, file);
                let content = await fs.readFile(filePath, 'utf8');
                
                // 从文件名提取数字
                const numberMatch = file.match(/\d+/);
                const number = numberMatch ? numberMatch[0] : '1';
                
                // 提取原有的 frontmatter
                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                    const oldFrontmatter = frontmatterMatch[1];
                    const dateMatch = oldFrontmatter.match(/date:\s*(.*)/);
                    
                    // 创建新的 frontmatter
                    const newFrontmatter = `---
layout: ../../layouts/MarkdownPostLayout.astro
title: 周报 #${number}
description: "周记"
author: "你的名字"
type: "weekly"
---`;
                    
                    // 替换原有的 frontmatter
                    content = content.replace(/^---[\s\S]*?---/, newFrontmatter);
                    
                    // 写回文件
                    await fs.writeFile(filePath, content, 'utf8');
                    console.log(`已更新: ${file}`);
                }
            }
        }
        console.log('所有周报格式更新完成！');
    } catch (error) {
        console.error('转换过程中出错:', error);
    }
}

convertPosts();