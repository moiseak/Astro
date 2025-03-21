import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function addLineBreaks() {
    const thinkingDir = path.join('D:', 'blog', 'src', 'pages', 'thinking');
    
    try {
        const files = await fs.readdir(thinkingDir);
        for (const file of files) {
            if (file.startsWith('周报') && file.endsWith('.md')) {
                const filePath = path.join(thinkingDir, file);
                let content = await fs.readFile(filePath, 'utf8');
                
                // 在每行末尾添加两个空格
                content = content.replace(/([^\n])\n/g, '$1  \n');
                
                // 写回文件
                await fs.writeFile(filePath, content, 'utf8');
                console.log(`已更新: ${file}`);
            }
        }
        console.log('所有周报格式更新完成！');
    } catch (error) {
        console.error('转换过程中出错:', error);
    }
}

addLineBreaks();