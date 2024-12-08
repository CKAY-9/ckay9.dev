import { GitHubUser } from "@/api/github/dto";
import style from "./header.module.scss";
import Link from "next/link";
import Image from "next/image";

export type HeaderProps = {
    github_user: GitHubUser
}

const Header = (props: HeaderProps) => {
    return (
        <>
            <header className={style.header}>
                <section>
                    <Link href="/" className={style.home}>
                        <Image 
                            src={props.github_user.avatar_url}
                            alt={`${props.github_user.login}'s Profile Picture`}
                            sizes="100%"
                            width={0}
                            height={0}
                            className={style.icon}
                        />
                        <h3>{props.github_user.login}</h3>
                    </Link>
                    <Link href="/repos">
                        <span>Repos</span>
                    </Link>
                    <Link href="/blog">
                        <span>Blog</span>
                    </Link>
                </section>
                <section>

                </section>
            </header>
        </>
    );
}

export default Header;