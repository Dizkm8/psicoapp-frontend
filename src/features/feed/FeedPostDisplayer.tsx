import FeedPost from "../../app/models/FeedPost";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import {selectRole} from "../../features/account/accountSlice";
import {useSelector}  from "react-redux";
import { Button } from "@mui/material";
import {Dialog, DialogTitle, DialogActions} from '@mui/material';






export default function FeedPostDisplayer() {
    const navigate = useNavigate();
    const {id} = useParams();
    const postId: number = id ? parseInt(id) : 1;
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<FeedPost>();
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const userRole: Number | null = useSelector(selectRole);


    
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

    const eliminarPost = () => {
      setLoading(true);
    
      
      agent.Feed.deletePost(postId)
        .then(() => {
          toast.success('El post ha sido eliminado', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
          navigate('/feed');
        })
        .catch((error) => {
          toast.error('Ha ocurrido un problema al eliminar el post', {
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
    };
    

    return (
      <Box sx={{ width: '80%', margin: '20px auto', marginLeft: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom style={{ flexGrow: 1 }}>
            {post.title}
          </Typography>
          {userRole === 1 && (<Button
            color='error'
            variant="contained"
            onClick={() => setOpenConfirmation(true)}
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
        
        <Dialog
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
        >
          <DialogTitle>¿Está seguro que quiere eliminar el post?</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => setOpenConfirmation(false)}
              color="primary"
            >
              Cancelar
            </Button>
            <Button
              onClick={eliminarPost}
              color="error"
              variant="contained"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
  

      </Box>
    );
  }