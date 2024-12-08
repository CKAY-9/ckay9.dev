"use client";

import { BlogEntry } from "@/api/blog/dto"
import Link from "next/link";

export type BlogPostClientProps = {
    blog_entry: BlogEntry
}

const BlogPostClient = (props: BlogPostClientProps) => {
    return (
        <>
            <Link href="/blog" style={{"marginBottom": "1rem"}}>Back</Link>
            <h1>{props.blog_entry.title}</h1>
            <span>{new Date(props.blog_entry.posted).toLocaleDateString()}</span>
            <p>
                {props.blog_entry.content}
            </p>
        </>
    );
}

export default BlogPostClient;