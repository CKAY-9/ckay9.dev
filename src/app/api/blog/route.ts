import { BlogEntry, NewBlogEntry } from "@/api/blog/dto";
import { readFileSync, writeFileSync } from "fs"
import { NextRequest } from "next/server";

const BLOG_LOCATION = "./public/blog.json";
const AUTHORIZATION_KEY = process.env.AUTHORIZATION_KEY;

const writeToBlogFile = (blog_data: BlogEntry[]) => {
    try {
        writeFileSync(BLOG_LOCATION, JSON.stringify(blog_data));
    } catch (ex) {
        console.log(ex);
    }
}

const readBlogFile = (): BlogEntry[] => {
    try {
        const blogs_file = readFileSync(BLOG_LOCATION, "utf-8");
        return (JSON.parse(blogs_file));
    } catch {
        writeToBlogFile([]);
        return [];
    }
}


export const POST = async (request: Request) => {
    const auth_header = request.headers.get("Authorization"); // weak authentication but whatever
    if (auth_header !== AUTHORIZATION_KEY) {
        return Response.json({message: "Failed to authorize user."}, {
            status: 400
        })
    }

    const request_json: NewBlogEntry = await request.json();
    const blogs = readBlogFile();

    const new_entry: BlogEntry = {
        title: request_json.title,
        content: request_json.content,
        posted: new Date().toISOString(),
        id: blogs.length + 1
    };

    blogs.push(new_entry);
    writeToBlogFile(blogs);

    return Response.json(blogs, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams
    const id = Number.parseInt(searchParams.get("id") || "-1");

    const blogs = readBlogFile();

    if (id <= -1) {
        return Response.json(blogs.reverse()); // .reverse() makes them in proper order
    }

    // get specific blog
    // TODO: replace with binary search or faster algo
    for (let i = 0; i < blogs.length; i++) {
        const b = blogs[i];
        if (b.id === id) {
            return Response.json(b);
        }
    }

    return Response.json({});
}