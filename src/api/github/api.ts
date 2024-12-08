import axios from "axios";
import { GitHubRepo, GitHubUser } from "./dto";
import { SELF_HOST } from "../resources";

export const getGitHubUserData = async (): Promise<GitHubUser | null> => {
    try {
        const request = await axios({
            url: `${SELF_HOST}/api/github/user`,
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
            url: `${SELF_HOST}/api/github/repos`,
            method: "GET"
        });
        return request.data;
    } catch {
        return [];
    }
}