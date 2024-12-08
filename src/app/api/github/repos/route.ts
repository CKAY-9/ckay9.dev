import axios from "axios";
import { GITHUB_TOKEN, GITHUB_USERNAME } from "../resources";

export const GET = async () => {
    try {
        const request = await axios({
            url: `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
            method: "GET",
            headers: {
                Authorization: GITHUB_TOKEN
            }
        });
        return Response.json(request.data);
    } catch {
        return Response.json([]);
    }
}