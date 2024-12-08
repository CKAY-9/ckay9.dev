export type GitHubUser = {
    login: string;
    id: number;
    avatar_url: string;
    name: string;
    bio: string;
    followers: number;
    following: number;
    public_repos: number;
    repos_url: string;
};

export type GitHubLicense = {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
}

export type GitHubRepo = {
    archived: boolean;
    created: string;
    forks: number;
    description: string;
    license: GitHubLicense
    name: string;
    html_url: string;
    stargazers_count: number;
}