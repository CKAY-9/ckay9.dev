import { getGitHubUserData } from "@/api/github/api";
import Header from "@/components/header/header";
import NewBlogEntryClient from "./client";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
    const github_user = await getGitHubUserData();
    if (github_user === null) {
		return {
            title: "New Blog Entry - User",
            description: "Create new blog entries for User."
        }
	}

    return {
        title: `New Blog Entry - ${github_user.login}`,
        description: `Create new blog entries for ${github_user.login}.`,
        icons: `${github_user.avatar_url}`
    }
}

const NewBlogEntryPage = async () => {
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
    
    return (
        <>
            <Header github_user={github_user} />
            <main className="container">
                <NewBlogEntryClient github_user={github_user} />
            </main>
        </>
    );
}

export default NewBlogEntryPage;