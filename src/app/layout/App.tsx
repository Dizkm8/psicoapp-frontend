// App.tsx
import { CssBaseline } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header";
import { getGlobalUserId } from '../../features/account/UserContext';

function App() {
  const location = useLocation();

  const contextUserId = getGlobalUserId();

  if (location.pathname === '/login' || location.pathname === '/register') {
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
        <Header>
          <Outlet />
        </Header>
      </>
    );
  }
}

export default App;
