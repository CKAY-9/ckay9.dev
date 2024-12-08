"use client";

import { createNewBlogEntry } from "@/api/blog/api";
import { GitHubUser } from "@/api/github/dto";
import { BaseSyntheticEvent, useState } from "react";

export type NewBlogEntryProps = {
    github_user: GitHubUser;
}

const NewBlogEntryClient = (props: NewBlogEntryProps) => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [auth, setAuth] = useState<string>("");

    const create = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const response = await createNewBlogEntry({
            title,
            content
        }, auth);

        if (response.length <= 0) {
            // Failed
        } else {
            window.location.href = `/blog/${response[response.length - 1].id}`
        }
    }
    
    return (
        <>
            <h1>New Blog Entry for {props.github_user.login}</h1>
            <section style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}>
                <input onChange={(e: BaseSyntheticEvent) => setTitle(e.target.value)} type="text" placeholder="Title" />
                <textarea onChange={(e: BaseSyntheticEvent) => setContent(e.target.value)} placeholder="Content" name="content" id="content" cols={30} rows={15}></textarea>
                <input onChange={(e: BaseSyntheticEvent) => setAuth(e.target.value)} type="password" placeholder="Authorization Key" />
                <button onClick={create}>Post</button>
            </section>
        </>
    );
}

export default NewBlogEntryClient;