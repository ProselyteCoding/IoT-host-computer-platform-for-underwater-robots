import './App.scss';
import React,{ useState } from'react';
import{
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom"
// import useAuthStore from './store/authStore';
const Login=React.lazy(()=>import("./pages/login/login.tsx"));
const Register=React.lazy(()=>import("./pages/register/register.tsx"));
const User=React.lazy(()=>import("./pages/user/user.tsx"));
const Forget=React.lazy(()=>import("./pages/forget/forget.tsx"));
const Home=React.lazy(()=>import("./pages/home/home.tsx"));
const Control=React.lazy(()=>import("./pages/control/control.tsx"));
const Data=React.lazy(()=>import("./pages/data/data.tsx"));

// const {isAuthenticated}=useAuthStore();

const router = createBrowserRouter([
  {
    path:"*",
    element:
    // isAuthenticated?(
    //   <Navigate to="/home" replace/>
    // ):(
      <Navigate to="/home" replace/>
    // )
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/user",
    element:<User/>
  },
  {
    path:"/forget",
    element:<Forget/>
  },
  {
    path:"/home",
    element:<Home/>
  },
  {
    path:"/control",
    element:<Control/>
  },
  {
    path:"/data",
    element:<Data/>
  }
])

function App() {
  return (
    <div className="App">
      <React.Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </React.Suspense>
    </div>
  );
}

export default App;
