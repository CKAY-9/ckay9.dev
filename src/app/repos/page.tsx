import { getGitHubUserData } from "@/api/github/api"
import Header from "@/components/header/header"
import ReposClient from "./client";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
    const github_user = await getGitHubUserData();
    if (github_user === null) {
		return {
            title: "Repositories - User",
            description: "View this user's repositories and see what they are working on."
        }
	}

    return {
        title: `Repositories - ${github_user.login}`,
        description: `View ${github_user.login}'s Repositories and see what they are working on.`,
        icons: `${github_user.avatar_url}`
    }
}

const ReposPage = async () => {
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
                <ReposClient github_user={github_user} />
            </main>
        </>
    )
}

export default ReposPage;