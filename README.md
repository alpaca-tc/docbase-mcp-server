# DocBase MCP Server

TBW

## Feature

TBW

## Tools

- get_posts
- get_post

## Setup

``` json
{
  "mcpServers": {
    "docbase-mcp-server": {
      "command": "npx",
      "args": [
        "tsx",
        "/path/to/repository/docbase-mcp-server/src/index.ts"
      ],
    },
    "env": {
      "DOMAIN": "<YOUR_DOMAIN>",
      "TOKEN": "<YOUR_TOKEN>"
    }
  }
}
```

## License

MIT
