# MCP Web Extractor

A Model Context Protocol (MCP) server that extracts web content using Readability.js. This tool fetches web pages and extracts the main content, making it ideal for saving clean, readable versions of articles to Obsidian notes.

## Features

- Extracts readable content from any URL
- Removes ads, sidebars, and other distractions
- Returns clean text along with metadata (title, excerpt, etc.)
- Easy integration with Obsidian via MCP

## Installation

```bash
# Clone the repository
git clone https://github.com/iemong/mcp-web-extractor.git
cd mcp-web-extractor

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

The server will start on http://localhost:3000 with the MCP endpoint at http://localhost:3000/mcp.

## Usage

### As a standalone service

You can use the included client example to extract content from a URL:

```bash
ts-node-esm client-example.ts
```

### With Obsidian

The `obsidian-integration.ts` file provides an example of how to integrate this MCP server with Obsidian. You can use it as a starting point for creating an Obsidian plugin that extracts web content.

## API

The MCP server provides the following capability:

- `extract-content`: Extracts readable content from a given URL
  - Parameters: `{ url: string }`
  - Returns: `{ title, content, textContent, excerpt, siteName }`

## License

MIT
