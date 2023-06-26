import React, { useState, useEffect} from "react";
import ForumPostDisplayer from "./ForumPostDisplayer";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function ForumPostPage() {
    const [postId, setPostId] = useState<number>(1);
    const { id } = useParams();
    const postIdNumber = Number(id);

    // ...

    useEffect(() => {
        setPostId(postIdNumber);
    }, [postIdNumber]);

    return <ForumPostDisplayer postId={postId} />;
}