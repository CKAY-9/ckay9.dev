import axios from "axios";
import { GITHUB_TOKEN, GITHUB_USERNAME } from "../resources";

export const GET = async () => {
    try {
        const request = await axios({
            url: `https://api.github.com/users/${GITHUB_USERNAME}`,
            method: "GET",
            headers: {
                Authorization: GITHUB_TOKEN 
            }
        });
        return Response.json(request.data);
    } catch {
        return Response.json({
            avatar_url: "https://avatars.githubusercontent.com/u/53030585?v=4",
            bio: "Web Developer, but I do some other things. FOSS > profit",
            name: "Cameron A.",
            login: "CKAY-9",
            followers: 6,
            following: 2,
            repos_url: "https://api.github.com/users/CKAY-9/repos",
            public_repos: 29,
            id: 0
        });
    }
}