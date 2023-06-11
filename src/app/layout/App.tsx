import { CssBaseline } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header";

function App() {
  const location = useLocation();

  if (location.pathname === '/login' ||
    location.pathname === '/register') {
    return (
      <>
        <CssBaseline />
        <ToastContainer />
        <Outlet />
      </>
    );
  } else {
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
}
export default App;
