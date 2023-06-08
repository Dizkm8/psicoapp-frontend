import { Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import * as React from "react";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
        <CssBaseline />
        <ToastContainer />
        <Outlet />
    </>
  );
}

export default App;
