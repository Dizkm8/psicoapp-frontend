
import ForumPost from "../../app/models/ForumPost";
import BentoItemProperties from "../../app/interfaces/BentoItemProperties";
import BentoGrid from "../../app/components/BentoGrid";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import PaginationBar from "../../app/components/PaginationBar";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link, NavLink, Navigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import CommentIcon from '@mui/icons-material/Comment';
import { useParams } from "react-router-dom";



export default function ForumDisplayPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [itemsPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1);
    const [reloadPosts, setReloadPosts] = useState(false);
    

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
   

    function convertData(forumPost: ForumPost){
        
        let result: BentoItemProperties = {
            key: forumPost.id,
            children: (<Badge badgeContent={forumPost.comments.length} color="primary"><CommentIcon color="action" /></Badge>),
            title: forumPost.title,
            subtitle: forumPost.tagName,
            onClick: () => {
                console.log(result.title);
                
                navigate(`post/${result.key}`);
                
              },
        };
        return result;
    };
    

    useEffect(() => {
        setLoading(true);
        agent.Forum.getPosts()
            .then((response) => {
                setPosts([...response]);
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
    }, [reloadPosts]);

    if (loading) return <LoadingComponent message='Cargando información...' />


    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const slicedData = posts.slice(firstItemIndex,lastItemIndex)
    
    //convert the raw data into the correct format
    const data = slicedData.map(entry => convertData(entry));

    const handlePageChange = (currentPage: React.SetStateAction<number>) => {
        setCurrentPage(currentPage);
      };
    const handlePostCreated = () => {
        // Esta función se ejecuta cuando se crea un nuevo post en CreateForumPostPage
        setReloadPosts(!reloadPosts);
      };

      return (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: -15, right: 100}}>
          <NavLink to="/forum/create">
            <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} >
              Agregar post
            </Button>
            </NavLink>
          </div>
          <BentoGrid bentoItems={data} />
          <PaginationBar
            itemsPerPage={itemsPerPage}
            TotalPages={Math.ceil(posts.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
          <NavLink to="/forum/create" onClick={handlePostCreated} />
          
          
        </div>
      );
}