import FeedPost from "../../app/models/FeedPost";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Comment from "../../app/models/Comment";
import { Navigate, useParams } from "react-router-dom";




export default function FeedPostDisplayer() {
    const navigate = useNavigate();
    const {id} = useParams();
    const postId: number = id ? parseInt(id) : 1;
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<FeedPost>();


    
     useEffect(() => {
         setLoading(true);
         agent.Feed.getPost(postId)
             .then((response) => {
              setPost(response);
              console.log(response); // Verifica la estructura de los datos recibidos
             })
             .catch((error) => {
                 toast.error('Ha ocurrido un problema cargando la información', {
                     position: "top-center",
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: false,
                     pauseOnHover: true,
                     draggable: false,
                     progress: undefined,
                     theme: "light",
                 });
             })
             .finally(() => {
                 setLoading(false);
             });
     }, []);

    if (loading) return <LoadingComponent message='Cargando información...' />


    if (!post) return null; // Añade un caso para cuando el estado post sea null
    

    return (
      <Box sx={{ width: '80%', margin: '20px auto', marginLeft: '50px' }}>
        <div>
          <Typography variant="h3" gutterBottom>
            {post.title}
          </Typography>
  
          <Typography variant="subtitle1" gutterBottom>
            por: {post.fullName}
          </Typography>
  
          <Typography variant="body1" gutterBottom>
            {post.content}
          </Typography>
        </div>
  

      </Box>
    );
  }