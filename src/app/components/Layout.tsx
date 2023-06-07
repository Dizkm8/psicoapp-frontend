import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArticleIcon from '@mui/icons-material/Article';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { purple } from '@mui/material/colors';
import {NavLink} from "react-router-dom";
import { Button } from '@mui/material';
import FeedPostForm from '../../features/feed/FeedPostForm';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


const drawerWidth = 240;
const items =[{ label: 'The Shawshank Redemption', year: 1994 },
{ label: 'The Godfather', year: 1972 },];

export default function PermanentDrawerLeft() {
  return (
    <Box sx={{ display: 'flex', bgcolor: 'white' }}>
      <AppBar
        
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`,height: 110, ml: `${drawerWidth}px`, bgcolor: 'white' }}
      >


        <IconButton sx={{alignSelf: "end",mx:4, my:1}} aria-label="delete" edge = "end" size="large" component={NavLink} to="/account/edit">
            <AccountCircleIcon fontSize="inherit" />
          </IconButton> 
          <Autocomplete 
            disablePortal
            id="combo-box-demo"
            options={items}
            sx={{ width: 200, height: 100, my:-4, alignSelf: "center", alignContent: "center"}}
            renderInput={(params) => <TextField {...params} label="Busqueda" />}
    />
        
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Button sx={{alignSelf: "center", my:1}} size="small" variant="contained" component={NavLink} to="/home" >PsicoApp</Button>
        <Toolbar />      
        <Divider />
        <List>
        <ListItem disablePadding>           
            <ListItemButton  component={NavLink} to="/feed/create"> 
              <ListItemIcon>
                <NewspaperIcon />
              </ListItemIcon>
              <ListItemText primary="Agregar Noticias" />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
            <ListItemButton >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Foro" />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/specialist/availability">
              <ListItemIcon>
                <AddBoxIcon/>
              </ListItemIcon>
              <ListItemText primary="Definir horario disponible" />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CalendarMonthIcon />
              </ListItemIcon>
              <ListItemText primary="Ver citas" />
            </ListItemButton>
        </ListItem>
        
      </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}