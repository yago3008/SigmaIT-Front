import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import RegisterItem from "../pages/RegisterItem";
import ViewItem from "../pages/ViewItem";

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
    {
        path: "/stock/get-item",
        element: (
            <ViewItem/>
        )
    }

]);

export default router;