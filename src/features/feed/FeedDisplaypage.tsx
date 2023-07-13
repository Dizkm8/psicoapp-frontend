
import FeedPost from "../../app/models/FeedPost";
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
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FeedPostDisplayer from "./FeedPostDisplayer";
import Chip from '@mui/material/Chip';
import {selectRole} from "../../features/account/accountSlice";
import {useSelector}  from "react-redux";
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from "@mui/material";
import Grid from '@mui/material/Grid';




export default function FeedDisplayPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [itemsPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const userRole: Number | null = useSelector(selectRole);
    const [filteredPosts, setFilteredPosts] = useState<FeedPost[]>([]);
    
    

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      


    function convertData(feedPost: FeedPost){

        let result: BentoItemProperties = {
            key: feedPost.id,
            children: (<Chip label={feedPost.tagName} />),
            title: feedPost.title,
            subtitle: feedPost.fullName,
            onClick: ()=>{console.log(result.title); navigate(`/feed/post/${result.key}`);}
        };
        return result;
    };
    
    useEffect(() => {
      setLoading(true);
      agent.Feed.getPosts()
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
                label="Buscar noticia"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {userRole === 3 && (
              <NavLink to="/feed/create">
                <Box sx={{ marginLeft: 'auto' }}>
                  <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} >
                    Agregar Noticia
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