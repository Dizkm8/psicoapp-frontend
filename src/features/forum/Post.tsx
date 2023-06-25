import PostDisplayer from "./PostDisplayer"
import Specialist from "../../app/models/Specialist";
import ForumPost from "../../app/models/ForumPost";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function Post(){

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(null);

    return(

        <PostDisplayer postId={1}
        />
        
    )



    ;
}