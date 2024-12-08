import axios from "axios";
import { GitHubRepo, GitHubUser } from "./dto";

export const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "CKAY-9";

export const getGitHubUserData = async (): Promise<GitHubUser | null> => {
    try {
        const request = await axios({
            url: `https://api.github.com/users/${GITHUB_USERNAME}`,
            method: "GET" 
        });
        return request.data;
    } catch {
        return {
            avatar_url: "https://avatars.githubusercontent.com/u/53030585?v=4",
            bio: "Web Developer, but I do some other things. FOSS > profit",
            name: "Cameron A.",
            login: "CKAY-9",
            followers: 6,
            following: 2,
            repos_url: "https://api.github.com/users/CKAY-9/repos",
            public_repos: 29,
            id: 0
        }
    }
}

export const getAllUserRepos = async (): Promise<GitHubRepo[]> => {
    try {
        const request = await axios({
            url: `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
            method: "GET"
        });
        return request.data;
    } catch {
        return [];
    }
}