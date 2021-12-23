
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

export const Routes = [
    // pages
    {
        path: "/",
        component: Dashboard,
        navbar: true,
        exact: true,
        auth: true
    },

    {
        path: "/dashboard",
        component: Dashboard, 
        navbar: true,
        exact: true,
        auth: true

    },

    {
        path: "/login",
        component: Login,
        navbar: false,
        exact: true,
        auth: false
    }
];
