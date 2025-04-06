import { MCPServer, Capability } from '@modelcontextprotocol/typescript-sdk';
import express from 'express';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// MCP サーバーの設定
const server = new MCPServer({
  name: 'Web Content Extractor',
  description: 'Fetches web pages and extracts the main content using Readability.js',
  version: '1.0.0',
  capabilities: [
    new Capability({
      name: 'extract-content',
      description: 'Extract readable content from a given URL',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL of the webpage to extract content from'
          }
        },
        required: ['url']
      },
      handler: async ({ url }) => {
        try {
          // URLからコンテンツを取得
          const response = await fetch(url);
          const html = await response.text();
          
          // JSDOMを使ってHTMLをパース
          const dom = new JSDOM(html, { url });
          
          // Readability.jsを使って本文を抽出
          const reader = new Readability(dom.window.document);
          const article = reader.parse();
          
          if (!article) {
            return {
              success: false,
              error: 'Failed to extract content'
            };
          }
          
          return {
            success: true,
            data: {
              title: article.title,
              content: article.content,
              textContent: article.textContent,
              excerpt: article.excerpt,
              siteName: article.siteName
            }
          };
        } catch (error) {
          console.error('Error extracting content:', error);
          return {
            success: false,
            error: `Failed to extract content: ${error.message}`
          };
        }
      }
    })
  ]
});

// MCPサーバーをExpressにマウント
app.use('/mcp', server.createExpressMiddleware());

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`MCP Endpoint: http://localhost:${PORT}/mcp`);
});