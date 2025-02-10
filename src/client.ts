import { paths } from "./types/openapi";
import createClient from "openapi-fetch";

type Domain = string;
type PostId = number;

type GetPosts = paths["/teams/{domain}/posts"]["get"];
type GetPostsParameters = GetPosts["parameters"]["path"] &
  GetPosts["parameters"]["query"];

async function getPosts(
  domain: Domain,
  params: Omit<GetPostsParameters, "domain">,
  accessToken: string
) {
  const client = createClient<paths>({
    baseUrl: "https://api.docbase.io",
    headers: {
      "X-DocBaseToken": accessToken,
    },
  });

  return await client.GET("/teams/{domain}/posts", {
    params: {
      path: { domain },
      query: params,
    },
  });
}

async function getPost(
  domain: Domain,
  id: PostId,
  accessToken: string
) {
  const client = createClient<paths>({
    baseUrl: "https://api.docbase.io",
    headers: {
      "X-DocBaseToken": accessToken,
    },
  });

  return await client.GET("/teams/{domain}/posts/{id}", {
    params: {
      path: { domain, id },
    },
  });
}

export { getPosts, getPost };
