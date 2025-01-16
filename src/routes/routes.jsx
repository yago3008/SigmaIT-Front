import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import RegisterItem from "../pages/RegisterItem";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Home/>
        )
    },
    {
        path: "/login",
        element: (
            <Login/> 
        )
    },
    {
        path: "/register",
        element: (
            <Register/>
        )
    },
    {
        path: "/stock/register-item",
        element:(
            <RegisterItem/>
        )
    },

]);

export default router;