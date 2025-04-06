import { MCPClient } from '@modelcontextprotocol/typescript-sdk';

async function extractContent(url: string) {
  const client = new MCPClient('http://localhost:3000/mcp');
  
  try {
    // サーバー情報を取得
    const serverInfo = await client.getServerInfo();
    console.log('Connected to MCP server:', serverInfo.name, serverInfo.version);
    
    // extract-contentケイパビリティを呼び出し
    const result = await client.invokeCapability('extract-content', { url });
    
    if (result.success) {
      console.log('Title:', result.data.title);
      console.log('Excerpt:', result.data.excerpt);
      console.log('Content:', result.data.textContent.substring(0, 200) + '...');
      
      // Obsidianノートに保存する場合はここで処理
      return result.data;
    } else {
      console.error('Error:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Failed to extract content:', error);
    return null;
  }
}

// 使用例
extractContent('https://example.com')
  .then(data => {
    if (data) {
      console.log('Extraction successful!');
    }
  });