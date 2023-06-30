import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationBar({
  children,
  itemsPerPage,
  TotalPages, // Recibir los datos paginados como prop
  onPageChange,
}: React.PropsWithChildren<{
  onPageChange: (page: number) => void;
  itemsPerPage: number
  TotalPages: number; // Definir el tipo de datos paginados
}>) {
  
  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };
   //set the default page as 1
  
   //set the default page as the number of post you would like to see in the screen( for testing purpose we will set the number of items per page at 2)
   
 
  
  


   return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Stack spacing={2}>
        <Pagination
          count={TotalPages}
          variant="outlined"
          color="primary"
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
}