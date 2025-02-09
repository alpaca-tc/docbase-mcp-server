import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "DocBase",
  version: "0.0.1",
});

const fetchPosts = (q: string | undefined) => {
  return {
    posts: [
      {
        id: 4,
        title: "メモのタイトル",
        body: "メモの本文",
        draft: false,
        archived: false,
        url: "https://kray.docbase.io/posts/4",
        created_at: "2016-04-15T18:19:03+09:00",
        updated_at: "2016-04-15T18:19:03+09:00",
        scope: "everyone",
        sharing_url:
          "https://docbase.io/posts/1/sharing/abcdefgh-0e81-4567-9876-1234567890ab",
        tags: [{ name: "日報" }],
        user: {
          id: 3,
          name: "user3",
          profile_image_url: "https://image.docbase.io/uploads/aaa.gif",
        },
        stars_count: 1,
        good_jobs_count: 2,
        comments: [
          {
            id: 7,
            body: "コメント本文",
            created_at: "2016-05-13T17:07:18+09:00",
            user: {
              id: 2,
              name: "user2",
              profile_image_url: "https://image.docbase.io/uploads/aaa.gif",
            },
          },
        ],
        groups: [],
      },
      /*
        …repeat
      */
    ],
    meta: {
      previous_page: null,
      next_page: "https://api.docbase.io/teams/kray/posts?page=2&per_page=20",
      total: 39,
    },
  };
};

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
    q: z.string().optional().describe(`Query string\n${searchSyntax}`),
  },
  async ({ q }) => {
    const response = fetchPosts(q);

    return {
      content: [
        {
          type: "text",
          text: `match posts: ${response.meta.total}`,
        },
      ],
    };
  }
);

server.tool(
  "get_post",
  "Get post from DocBase",
  {
    id: z.number().int().describe("Post ID"),
  },
  async ({ id }) => {
    return {
      content: [
        {
          type: "text",
          text: `post id: ${id}`,
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
