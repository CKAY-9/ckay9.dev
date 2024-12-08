import axios from "axios";
import { BlogEntry, NewBlogEntry } from "./dto";
import { SELF_HOST } from "../resources";

export const getBlog = async (): Promise<BlogEntry[]> => {
    try {
        const request = await axios({
            url: `${SELF_HOST}/api/blog`,
            method: "GET"
        });
        return request.data;
    } catch {
        return [];
    }
}

export const getBlogPostByID = async (id: number): Promise<BlogEntry | null> => {
    try {
        const request = await axios({
            url: `${SELF_HOST}/api/blog`,
            method: "GET",
            params: {
                id
            }
        });
        return request.data;
    } catch {
        return null;
    }
}

export const createNewBlogEntry = async (blog_entry: NewBlogEntry, auth: string = ""): Promise<BlogEntry[]> => {
    try {
        const request = await axios({
            url: `${SELF_HOST}/api/blog`,
            method: "POST",
            data: {
                title: blog_entry.title,
                content: blog_entry.content
            },
            headers: {
                Authorization: auth
            }
        });
        return request.data;
    } catch {
        return [];
    }
}