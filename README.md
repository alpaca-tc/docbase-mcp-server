# DocBase MCP Server

An MCP server implementation for interacting with the DocBase API.

## Features

- Get posts from DocBase

## Tools

- `get_posts`: Get posts from DocBase.
- `get_post`: Get a specific post from DocBase.

## Setup

```json
{
  "mcpServers": {
    "docbase-mcp-server": {
      "command": "npx",
      "args": [
        "tsx",
        "/path/to/repository/docbase-mcp-server/src/index.ts"
      ],
      "env": {
        "DOMAIN": "<YOUR_DOMAIN>",
        "TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### Getting `DOMAIN` and `TOKEN`

1. **DOMAIN**: Your DocBase team domain (e.g., `myteam` in `myteam.docbase.io`).
2. **TOKEN**: Access token for the DocBase API. You can generate a token from your DocBase settings. See [document](https://help.docbase.io/posts/45703) for details.

## License

MIT
