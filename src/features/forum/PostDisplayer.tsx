import Specialist from "../../app/models/Specialist";
import ForumPost from "../../app/models/ForumPost";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CommentsDisplayer from "./CommentsDisplay";


export default function PostDisplayer({
    postId,
  }: React.PropsWithChildren<{
    postId: number; // Definir el tipo de datos paginados
  }>) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<ForumPost>();

    
     useEffect(() => {
         setLoading(true);
         agent.Forum.getPost(postId)
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
      <React.Fragment>
        <Box sx={{ width: '80%', margin: '20px auto', marginLeft: '50px' }}>
          <div>
            <Typography variant="h3" gutterBottom>
              {post.title} {/* Mostrar el título del post */}
            </Typography>
    
            <Typography variant="subtitle1" gutterBottom>
              {post.userName} {/* Mostrar el subtítulo del post */}
            </Typography>
    
            <Typography variant="body1" gutterBottom>
              {post.content} {/* Mostrar el contenido del post */}
            </Typography>
          </div>
        </Box>
        <CommentsDisplayer comments={post.comments} />
      </React.Fragment>
    );
  }