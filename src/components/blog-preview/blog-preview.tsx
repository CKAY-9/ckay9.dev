import { BlogEntry } from "@/api/blog/dto"
import style from "./blog-preview.module.scss";

export type BlogPreviewProps = {
    blog_entry: BlogEntry
}

const BlogPreview = (props: BlogPreviewProps) => {
    return (
        <div className={style.blog_entry}>
            <h3>{props.blog_entry.title}</h3>
            <span>Posted: {new Date(props.blog_entry.posted).toLocaleDateString()}</span>
        </div>
    )
}

export default BlogPreview;