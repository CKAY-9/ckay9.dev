import { getGitHubUserData, GITHUB_USERNAME } from "@/api/github/api";
import style from "./index.module.scss";
import Image from "next/image";
import { CountUp } from "./client";
import Header from "@/components/header/header";
import Link from "next/link";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
    const github_user = await getGitHubUserData();
    if (github_user === null) {
		return {
            title: "User",
            description: "Homepage for user."
        }
	}

    return {
        title: `${github_user.login}`,
        description: `Homepage for ${github_user.login}.`,
        icons: `${github_user.avatar_url}`
    }
}

const IndexPage = async () => {
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
			<div className={style.splash}>
				<div className={style.content}>
					<Image 
						src={github_user.avatar_url}
						alt={`${github_user.login}'s Profile Picture`}
						sizes="100%"
						width={0}
						height={0}
						className={style.icon}
					/>

					<h1>{github_user.login}</h1>
					<h3>{github_user.name}</h3>
					<span>{github_user.bio}</span>
				</div>

				<div className={style.github}>
					<section className={style.header}>
						<Image 
							src="/github.svg"
							alt="GitHub icon"
							sizes="100%"
							width={0}
							height={0}
							className={style.icon}
						/>
						<h2><Link href={`https://github.com/${GITHUB_USERNAME}`}>GitHub</Link> Stats</h2>
					</section>
					<section className={style.stats}>
						<span>Repositories: <CountUp delay={1} start={0} end={github_user.public_repos} seconds={1} interval_time={0.1} /></span>
						<span>Followers: <CountUp delay={1.5} start={0} end={github_user.followers} seconds={1} interval_time={0.1} /></span>
						<span>Following: <CountUp delay={2} start={0} end={github_user.following} seconds={1} interval_time={0.1} /></span>
					</section>
				</div>
			</div>
		</>
	);
}

export default IndexPage;