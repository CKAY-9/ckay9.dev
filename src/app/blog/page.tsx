import { getBlog } from "@/api/blog/api";
import { getGitHubUserData } from "@/api/github/api";
import BlogPreview from "@/components/blog-preview/blog-preview";
import Header from "@/components/header/header";
import { Metadata } from "next";
import Link from "next/link";
import style from "./blog.module.scss";

export const generateMetadata = async (): Promise<Metadata> => {
    const github_user = await getGitHubUserData();
    if (github_user === null) {
        return {
            title: "Blog - User",
            description: "View this user's blog and see what they are thinking about."
        }
    }

    return {
        title: `Blog - ${github_user.login}`,
        description: `View ${github_user.login}'s blog and see what they are thinking about.`,
        icons: `${github_user.avatar_url}`
    }
}

const BlogPage = async () => {
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

    const blog = await getBlog();

    return (
        <>
            <Header github_user={github_user} />
            <main className="container">
                <h1>{github_user.login}&apos;s Blog</h1>
                <div className={style.blog}>
                    {blog.map((entry, index) => {
                        return (
                            <Link key={index} href={`/blog/${entry.id}`}>
                                <BlogPreview blog_entry={entry} />
                            </Link>
                        )
                    })}
                </div>
            </main>
        </>
    );
}

export default BlogPage;