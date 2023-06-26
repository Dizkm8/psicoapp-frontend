
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


export default function FeedDisplayPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [itemsPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1);
    const [postId, setPostId] = useState("");

    function convertData(feedPost: FeedPost){

        let result: BentoItemProperties = {
            key: feedPost.id,
            children: undefined,
            title: feedPost.title,
            subtitle: feedPost.content,
            onClick: ()=>{console.log(result.title); setPostId(result.key); navigate('post');}
        };
        return result;
    };
    

    useEffect(() => {
        setLoading(true);
        agent.Feed.getPosts()
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
    }, []);

    if (loading) return <LoadingComponent message='Cargando información...' />


    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const slicedData = posts.slice(firstItemIndex,lastItemIndex)
    
    //convert the raw data into the correct format
    const data = slicedData.map(entry => convertData(entry));

    const handlePageChange = (currentPage: React.SetStateAction<number>) => {
        setCurrentPage(currentPage);
      };

      return (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: -15, right: 100}}>
            <NavLink to="/feed/create">
                <Button variant="contained"  startIcon={<AddCircleIcon />} >
                    Agregar post
                </Button>
            </NavLink>
          </div>
          <BentoGrid bentoItems={data} />
          <PaginationBar
            itemsPerPage={itemsPerPage}
            TotalPages={Math.ceil(data.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      );
}