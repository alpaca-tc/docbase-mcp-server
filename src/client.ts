import { paths } from "./types/openapi";
import createClient from "openapi-fetch";

type Domain = string;

type GetPosts = paths["/teams/{domain}/posts"]["get"];
type GetPostsParameters = GetPosts["parameters"]["path"] &
  GetPosts["parameters"]["query"];
type GetPost = paths["/teams/{domain}/posts/{id}"]["get"];
type GetPostParameters = GetPost["parameters"]["path"];

export class DocBaseClient {
  private client;
  private domain: Domain;

  constructor({
    domain,
    accessToken,
  }: {
    domain: string;
    accessToken: string;
  }) {
    this.client = createClient<paths>({
      baseUrl: "https://api.docbase.io",
      headers: {
        "X-DocBaseToken": accessToken,
      },
    });
    this.domain = domain;
  }

  async getPosts(params: Omit<GetPostsParameters, "domain">) {
    return await this.client.GET("/teams/{domain}/posts", {
      params: {
        path: { domain: this.domain },
        query: params,
      },
    });
  }

  async getPost(id: GetPostParameters["id"]) {
    return await this.client.GET("/teams/{domain}/posts/{id}", {
      params: {
        path: { domain: this.domain, id },
      },
    });
  }
}
