import { getBlogPostByID } from "@/api/blog/api";
import { getGitHubUserData } from "@/api/github/api";
import Header from "@/components/header/header";
import { Metadata } from "next";
import BlogPostClient from "./client";

type Params = Promise<{ id: string }>

export const generateMetadata = async ({ params }: {
    params: Params
}): Promise<Metadata> => {
    const github_user = await getGitHubUserData();
    if (github_user === null) {
        return {
            title: "Blog Post - User",
            description: "View this user's blog post and see what they are thinking about."
        }
    }

    const { id } = await params;
    const blog = await getBlogPostByID(Number.parseInt(id));

    if (blog === null) {
        return {
            title: `Blog Post - ${github_user.login}`,
            description: `View ${github_user.login}'s blog post and see what they are thinking about.`,
            icons: `${github_user.avatar_url}`
        }
    }

    return {
        title: `${blog.title} - ${github_user.login}`,
        description: `${blog.title.slice(0, 50)}`,
        icons: `${github_user.avatar_url}`
    }
}

const BlogPostPage = async ({ params }: {
    params: Params
}) => {
    const github_user = await getGitHubUserData();
    if (github_user === null) {
        return (
            <>
                <main className="container">
                    <h1>Failed to fetch GitHub data</h1>
                </main>
            </>
        )
    }

    const { id } = await params;
    const blog = await getBlogPostByID(Number.parseInt(id));

    if (blog === null) {
        return (
            <>
                <Header github_user={github_user} />
                <main className="container">
                    <h1>Failed to get blog.</h1>
                </main>
            </>
        );
    }
    
    return (
        <>
            <Header github_user={github_user} />
            <main className="container">
                <BlogPostClient blog_entry={blog} />
            </main>
        </>
    );
}

export default BlogPostPage;