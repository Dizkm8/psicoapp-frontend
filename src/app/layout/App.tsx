import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header";

function App() {
  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <Header >
        <Outlet />
      </Header>
    </>
  );
}

export default App;
