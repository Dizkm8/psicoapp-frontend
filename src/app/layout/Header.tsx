import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Grid, List, ListItem, ListItemIcon, useMediaQuery } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';
import { grey, purple } from '@mui/material/colors';
import { Link, NavLink, Navigate } from 'react-router-dom';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArticleIcon from '@mui/icons-material/Article';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSelector } from "react-redux";
import { selectName } from "../../features/account/accountSlice";
import { useLocation } from 'react-router-dom';

export default function Header({ children }: React.PropsWithChildren<{}>) {
    const location = useLocation();
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLgOrLess, setIsLgOrLess] = useState(false);
    const isLgBreakpoint = useMediaQuery('(max-width: 1200px)'); // Define your XL breakpoint here
    const userName: string | null = useSelector(selectName);
    const isGuest = new URLSearchParams(location.search).get('guest') === 'true';

    useEffect(() => {
        setIsLgOrLess(isLgBreakpoint);
    }, [isLgBreakpoint]);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer =
        (anchor: 'left', open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: 'left') => (
        <Box
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={NavLink} to="/feed/create">
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
                            <AddBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Definir horario disponible" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={NavLink} to="/account/appointments">
                        <ListItemIcon>
                            <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary="Ver citas" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box >
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: purple[500], zIndex: 10000 }}>
                <Toolbar>
                    {isLgOrLess && (['left'] as const).map((anchor) => (
                        <React.Fragment key={anchor}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={toggleDrawer('left', true)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor={anchor}
                                open={state[anchor]}
                                onClose={toggleDrawer('left', false)}
                            >
                                {list('left')}
                            </Drawer>
                        </React.Fragment>
                    ))}

                    <Typography
                        variant="h6"
                        component={Link}
                        to="/home"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        PsicoApp
                    </Typography>
                    {auth && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem disabled sx={{ mb: 1 }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {!isGuest ? userName : 'Invitado'}
                                    </Typography>
                                </MenuItem>
                                {!isGuest && (
                                    <MenuItem
                                        onClick={handleClose}
                                        component={NavLink}
                                        to="/account/edit"
                                    >
                                        Perfil
                                    </MenuItem>
                                )}
                                <Divider />
                                <MenuItem
                                    onClick={handleClose}
                                    component={NavLink}
                                    to="/login"
                                >
                                    {isGuest ? "Iniciar sesión" : "Cerrar sesión"}
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Grid container sx={{
                width: '100vw',
                height: '100vh',
                maxHeight: 'max-content',
            }}>
                <Grid item xs={2} sx={{ backgroundColor: grey[200] }}>
                    {!isLgOrLess &&
                        <Box sx={{
                            m: 0,
                        }}
                        >
                            {list('left')}
                        </Box>
                    }
                </Grid>
                <Grid item xs={10}>
                    {children}
                </Grid>
            </Grid>
        </Box>
    );
}
