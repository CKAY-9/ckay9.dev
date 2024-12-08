"use client"

import { GitHubRepo } from "@/api/github/dto"
import style from "./repo.module.scss";
import Link from "next/link";
import Image from "next/image";
import { CountUp } from "@/app/client";

export type RepoPreviewProps = {
    repo: GitHubRepo;
    delay?: number;
}

const RepoPreview = (props: RepoPreviewProps) => {
    return (
        <div className={style.repo} style={{ "animationDelay": props.delay !== undefined ? `${props.delay}ms` : "0" }}>
            <section className={style.header}>
                <Link href={props.repo.html_url || ""}><h3>{props.repo.name}</h3></Link>
                <section className={style.stat}>
                    <Image
                        src="/star.svg"
                        alt="Stars"
                        sizes="100%"
                        width={16}
                        height={16}
                        style={{ "filter": "invert(1)" }}
                    />
                    <span>
                        <CountUp delay={props.delay !== undefined ? props.delay / 1000 : 0} start={0} end={props.repo.stargazers_count} seconds={1} interval_time={0.1} />
                    </span>
                </section>
                <section className={style.stat}>
                    <Image
                        src="/fork.svg"
                        alt="Stars"
                        sizes="100%"
                        width={16}
                        height={16}
                        style={{ "filter": "invert(1)" }}
                    />
                    <span>
                        <CountUp delay={props.delay !== undefined ? props.delay / 1000 : 0} start={0} end={props.repo.forks} seconds={1} interval_time={0.1} />
                    </span>
                </section>
            </section>
            <span>{props.repo.description}</span>
            {props.repo.license !== null && (
                <Link href={props.repo.license.url || ""} className={style.stat}>
                    <Image
                        src="/legal.svg"
                        alt="Stars"
                        sizes="100%"
                        width={16}
                        height={16}
                        style={{ "filter": "invert(1)" }}
                    />
                    <span>{props.repo.license.spdx_id}</span>
                </Link>
            )}
        </div>
    );
}

export default RepoPreview;