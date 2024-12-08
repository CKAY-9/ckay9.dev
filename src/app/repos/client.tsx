"use client"

import { getAllUserRepos } from "@/api/github/api";
import { GitHubRepo, GitHubUser } from "@/api/github/dto";
import RepoPreview from "@/components/repo/repo";
import { useEffect, useState } from "react";
import style from "./repos.module.scss";
import Link from "next/link";

export type ReposProps = {
    github_user: GitHubUser;
}

const ReposClient = (props: ReposProps) => {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            const r = await getAllUserRepos();
            setRepos(r);
            setLoading(false);
        })();
    }, []);

    return (
        <>
            <h1>{props.github_user.login}&apos;s Repositories</h1>
            <div className={style.repos}>
                {loading ? (
                    <>
                        <span>Loading repos...</span>
                    </>
                ) : (
                    <>
                        {repos.length <= 0 ? (
                            <span>
                                Failed to get any repositories. 
                                Visit <Link href={`https://github.com/${props.github_user.login}`}>{props.github_user.login}&apos;s GitHub</Link> to see more
                            </span>
                        ) : (
                            <>
                                {
                                    repos.map((repo, index) => {
                                        return (
                                            <RepoPreview key={index} repo={repo} delay={index * 200} />
                                        )
                                    })
                                }
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default ReposClient;