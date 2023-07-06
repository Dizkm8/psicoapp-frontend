
import ForumPost from "../../app/models/ForumPost";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Comment from "../../app/models/Comment";
import { useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {selectName, selectRole} from "../../features/account/accountSlice";
import {useSelector}  from "react-redux";
import { Button } from "@mui/material";


export default function ForumPostDisplayer() {
    const {id} = useParams();
    const postId: number = id ? parseInt(id) : 1;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<ForumPost>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentAdded, setCommentAdded] = useState(false);
    const userRole: Number | null = useSelector(selectRole);
    const userName: string | null  = useSelector(selectName);
    
   

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewComment(event.target.value);
    };

    

    
     useEffect(() => {
         setLoading(true);
         agent.Forum.getPost(postId)
             .then((response) => {
              setPost(response);
              setComments(response.comments)
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
                 setCommentAdded(false);
             });
     }, [commentAdded]);

    if (loading) return <LoadingComponent message='Cargando información...' />


    if (!post) return null; // Añade un caso para cuando el estado post sea null
    
    const handleCommentAdded = () => {
      setCommentAdded(false);
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

      
      
      setLoading(true);
      
      agent.Forum.addComment({content:newComment}, postId)
        .then((response) => {
          // Actualiza los comentarios locales con el nuevo comentario
          setComments([...comments, response]);
          setNewComment(''); // Limpia el campo de nuevo comentario
          setCommentAdded(true);
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
        .finally(() => {
          setLoading(false);
          
        },);
    };

    return (
      <Box sx={{ width: '80%', margin: '20px auto', marginLeft: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom style={{ flexGrow: 1 }}>
            {post.title}
          </Typography>
          {userName === post.fullName&& (<Button
            color='error'
            variant="contained"
            onClick={() => { navigate('/forum');}}
            sx={{ marginLeft: 'auto' }}
          >
            Eliminar post
          </Button>)}
        
        </div>
    
        <Typography variant="h5" gutterBottom>
          por: {post.userName}
        </Typography>
    
        <Typography variant="body1" gutterBottom>
          {post.content}
        </Typography>
    
        <Box sx={{ width: '100%', margin: '20px auto', marginLeft: '50px' }} onAnimationEnd={handleCommentAdded}>
          {comments.length === 0 ? (
            <Box
              sx={{
                border: '1px dashed grey',
                marginBottom: '10px',
                padding: '10px',
              }}
            >
              <Typography variant="body1" gutterBottom>
                No hay comentarios disponibles.
              </Typography>
            </Box>
          ) : (
            comments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px dashed grey',
                  marginBottom: '10px',
                  padding: '10px',
                }}
              >
                <Typography variant="body1" gutterBottom>
                  {comment.content}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Por: {comment.fullName}
                </Typography>
              </Box>
            ))
          )}
        </Box>
    
        <Box
          sx={{
            width: '100%',
            margin: '20px auto',
            marginLeft: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {userRole === 3 && (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <TextField fullWidth id="outlined-basic" label="Ingrese su comentario" variant="outlined" value={newComment} onChange={handleCommentChange} />
              <IconButton onClick={handleAddComment}>
                <SendIcon />
              </IconButton>
            </div>
          )}
        </Box>
      </Box>
    );
  }