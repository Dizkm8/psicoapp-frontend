import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import BentoGrid from './BentoGrid';

import { useEffect, useState } from "react";
import axios from 'axios';
import { current } from '@reduxjs/toolkit';
import BentoItem from './BentoItem';

export default function PaginationOutlined({
  children,
  data, // Recibir los datos paginados como prop
}: React.PropsWithChildren<{
  data:any[]; // Definir el tipo de datos paginados
}>) {
  

   //set the default page as 1
   const [currentPage, setCurrentPage] = useState(1);
   //set the default page as the number of post you would like to see in the screen( for testing purpose we will set the number of items per page at 2)
   const [itemsPerPage, setItemsPerPage] = useState(2);

   const lastItemIndex = currentPage * itemsPerPage;
   const firstItemIndex = lastItemIndex - itemsPerPage;
   const slicedData = data.slice(firstItemIndex, lastItemIndex);

   
  
  

  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Stack spacing={2}>
      <BentoGrid bentoItems={slicedData} /> {/* show paginated data */}
      <Pagination
      //set the number of pages based in the number of items
        count={Math.ceil(data.length / itemsPerPage)}
        variant="outlined"
        color="primary"
        onChange={handleChange}
        
      />
    </Stack>
  );
}