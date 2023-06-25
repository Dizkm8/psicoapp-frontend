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


export default function CommentsDisplayer({
    comments,
  }: React.PropsWithChildren<{
    comments: Comment[]; // Definir el tipo de datos paginados
  }>) {
    const navigate = useNavigate();

    



    return (
        <Box
          sx={{
            width: '80%',
            margin: '20px auto',
            marginLeft: '50px',
          }}
        >
          {comments.length === 0 ? (
            <Typography variant="body1" gutterBottom>
              No hay comentarios disponibles.
            </Typography>
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
                  {comment.content} {/* Mostrar el contenido del comentario */}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Por: {comment.fullName} {/* Mostrar el autor del comentario */}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      );}