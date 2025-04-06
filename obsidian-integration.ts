import { Plugin, Notice, addIcon, MarkdownView } from 'obsidian';
import { MCPClient } from '@modelcontextprotocol/typescript-sdk';

export default class WebExtractorPlugin extends Plugin {
  async onload() {
    console.log('Loading Web Extractor Plugin');
    
    // リボンアイコンを追加
    addIcon('web-extract', '<svg>...</svg>'); // 適切なSVGに置き換える
    
    // リボンアイコンのクリックアクション
    this.addRibbonIcon('web-extract', 'Extract Web Content', async () => {
      const url = await this.promptForURL();
      if (url) {
        await this.extractAndCreateNote(url);
      }
    });
    
    // コマンドを追加
    this.addCommand({
      id: 'extract-web-content',
      name: 'Extract content from URL',
      callback: async () => {
        const url = await this.promptForURL();
        if (url) {
          await this.extractAndCreateNote(url);
        }
      }
    });
  }
  
  async promptForURL(): Promise<string | null> {
    // URLを入力するモーダルを表示
    // 実際のObsidianプラグインではModalクラスを使用
    return prompt('Enter URL to extract:');
  }
  
  async extractAndCreateNote(url: string) {
    try {
      new Notice(`Extracting content from ${url}...`);
      
      // MCPクライアントを初期化
      const client = new MCPClient('http://localhost:3000/mcp');
      
      // extract-contentケイパビリティを呼び出し
      const result = await client.invokeCapability('extract-content', { url });
      
      if (!result.success) {
        new Notice(`Failed to extract content: ${result.error}`);
        return;
      }
      
      // ノート内容を作成
      const { title, textContent, siteName } = result.data;
      const fileName = this.sanitizeFileName(`${title || 'Web Extract'}`);
      
      const noteContent = `---
title: "${title || 'Untitled'}"
source: "${url}"
site: "${siteName || ''}"
extracted: "${new Date().toISOString()}"
---

# ${title || 'Web Content'}

${textContent}`;
      
      // ノートを作成
      await this.app.vault.create(`${fileName}.md`, noteContent);
      new Notice(`Created note: ${fileName}`);
      
      // 新しいノートを開く
      const file = this.app.vault.getAbstractFileByPath(`${fileName}.md`);
      if (file) {
        await this.app.workspace.getLeaf().openFile(file);
      }
      
    } catch (error) {
      console.error('Error extracting content:', error);
      new Notice(`Error: ${error.message}`);
    }
  }
  
  sanitizeFileName(name: string): string {
    // ファイル名に使えない文字を置換
    return name.replace(/[\\/:*?"<>|]/g, '-').substring(0, 100);
  }
  
  onunload() {
    console.log('Unloading Web Extractor Plugin');
  }
}