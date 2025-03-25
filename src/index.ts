#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { DocBaseClient } from "./client.js";

const domain = process.env.DOMAIN;
const accessToken = process.env.TOKEN;

if (!domain) {
  console.error("DOMAIN environment variable is required");
  process.exit(1);
}

if (!accessToken) {
  console.error("TOKEN environment variable is required");
  process.exit(1);
}

const server = new McpServer({
  name: "DocBase",
  version: "0.0.1",
});

const searchSyntax = `
## Search options

The following options are available:

| Condition       | Search Option                    |
|-----------------|----------------------------------|
| Title           | title:keyword                    |
| Body            | body:keyword                     |
| Comments        | comments:keyword                 |
| Attachments     | attachments:keyword              |
| Author          | author:userID                    |
| User ID         | author_id:numericUserID          |
| Commented by    | commented_by:userID              |
| Liked by        | liked_by:userID                  |
| Tag             | tag:tagName                      |
| Group           | group:groupName                  |
| Group ID        | group_id:numericGroupID          |
| No Tag          | missing:tag                      |
| Star            | has:star                         |
| Draft           | is:draft                         |
| Unread          | is:unread                        |
| Shared          | is:shared                        |
| Archived        | is:archived                      |
| Include Archive | include:archive                  |
| Created Date    | Date specified created_at:2018-01-01   |
| Date Range      | created_at:2018-01-01~2018-06-01 |
| Up to Date      | created_at:*~2018-01-01          |
| From Date       | created_at:2018-01-01~*          |
| Updated Date    | Date specified changed_at:2018-01-01   |
| Date Range      | changed_at:2018-01-01~2018-06-01 |
| Up to Date      | changed_at:*~2018-01-01          |
| From Date       | changed_at:2018-01-01~*          |

## AND Search

KeywordA KeywordB
Search for notes that match both conditions.
In this case, it will be notes that include both "KeywordA and KeywordB".

## OR Search

KeywordA OR KeywordB
Search for notes that match either of the two conditions.
In this case, it will be notes that include either "KeywordA or KeywordB".

## NOT Search

KeywordA -KeywordB
Search for notes that do not match a specific condition.
In this case, it will be notes that include "KeywordA" but do not include "KeywordB".

## Reference

- [📖 メモ、コメント、添付ファイルを検索する](https://help.docbase.io/posts/1827704)
`;

server.tool(
  "get_posts",
  "Get posts from DocBase",
  {
    q: z
      .string()
      .optional()
      .default("")
      .describe(`Query string\n${searchSyntax}`),
  },
  async ({ q }) => {
    const client = new DocBaseClient({ domain, accessToken });
    const { data, error, response } = await client.getPosts({ q });

    if (error) {
      console.error(error);
      const errorText = await response.text();
      return {
        content: [
          {
            type: "text",
            text: errorText,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "get_post",
  "Get post from DocBase",
  {
    id: z.string().describe("Post ID"),
  },
  async ({ id }) => {
    if (!/^\d+$/.test(id)) {
      const errorText = `${id} is not post ID`;
      console.error(errorText);
      return {
        content: [
          {
            type: "text",
            text: errorText,
          },
        ],
        isError: true,
      };
    }

    const client = new DocBaseClient({ domain, accessToken });
    const numberId = parseInt(id, 10)
    const { data, error, response } = await client.getPost(numberId);

    if (error) {
      console.error(error);
      const errorText = await response.text();
      return {
        content: [
          {
            type: "text",
            text: errorText,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info("DocBase Server running on stdio");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
