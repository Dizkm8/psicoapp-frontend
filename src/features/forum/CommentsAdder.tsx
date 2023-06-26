import Specialist from "../../app/models/Specialist";
import Comment from "../../app/models/Comment";
import ForumPost from "../../app/models/ForumPost";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function CommentAdder({
    postId,
  
  }: React.PropsWithChildren<{
    postId: number;
  }>) {
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState("")

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewComment(event.target.value);
    };
  


    const handleAddComment = () => {
      if (newComment.trim() === '') {
        // Verifica si el nuevo comentario está vacío
        toast.error('Escriba un comentario antes de presionar el boton "Agregar comentario', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }
     
    
      
      agent.Forum.addComment(newComment, postId)
        .then((response) => {
          // Actualiza los comentarios locales con el nuevo comentario

          setNewComment(''); // Limpia el campo de nuevo comentario
        })
        .catch((error) => {
          toast.error('Ha ocurrido un problema al agregar el comentario', {
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
        
    };

    return (
        <Box
          sx={{
            width: '80%',
            margin: '20px auto',
            marginLeft: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField id="outlined-basic" label="Ingrese su comentario" variant="outlined" value={newComment} onChange={handleCommentChange}/>
            <Button variant="contained" onClick={handleAddComment} startIcon={<AddCircleIcon />} style={{ marginLeft: '10px' }}>
              Agregar comentario
            </Button>
          </div>

        </Box>
      );}