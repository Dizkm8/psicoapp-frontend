
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
import Chip from '@mui/material/Chip';
import {selectRole} from "../../features/account/accountSlice";
import {useSelector}  from "react-redux";
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';




export default function ForumDisplayPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [itemsPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1);
    const userRole: Number | null = useSelector(selectRole);
    const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

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
            children: (<Badge badgeContent={forumPost.comments.length} color="primary"><CommentIcon color="action" /></Badge> ),
            title: forumPost.title,
            subtitle: (<Chip label={forumPost.tagName} />),
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
    
    useEffect(() => {
      const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filteredPosts);
    }, [searchTerm, posts]);

    if (loading) return <LoadingComponent message='Cargando información...' />

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };


    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const slicedData = filteredPosts.slice(firstItemIndex, lastItemIndex);
    const data = slicedData.map((entry) => convertData(entry));

    const handlePageChange = (currentPage: React.SetStateAction<number>) => {
        setCurrentPage(currentPage);
      };

      return (
        <div>
          <Box sx={{ position: 'relative', display: 'flex', top: '30px', alignItems: 'center', justifyContent: 'flex-start' }}>
            <div style={{ marginRight: '20px', marginLeft: '20px' }}>
              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 1 }} />
              <TextField
                id="input-with-sx"
                label="With sx"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {userRole === 3 && (
              <NavLink to="/forum/create">
                <Box sx={{ marginLeft: 'auto' }}>
                  <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} >
                    Agregar Publicacion
                  </Button>
                </Box>
              </NavLink>
            )}
          </Box>
          <BentoGrid bentoItems={data} />
          <PaginationBar
            itemsPerPage={itemsPerPage}
            TotalPages={Math.ceil(filteredPosts.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      );
    }