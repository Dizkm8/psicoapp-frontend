import React, { useState, useEffect} from "react";
import FeedPostDisplayer from "./FeedPostDisplayer";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function FeedPostPage() {
    const [postId, setPostId] = useState<number>(1);
    const { id } = useParams();
    const postIdNumber = Number(id);

    // ...

    useEffect(() => {
        setPostId(postIdNumber);
    }, [postIdNumber]);

    return <FeedPostDisplayer postId={postId} />;
}