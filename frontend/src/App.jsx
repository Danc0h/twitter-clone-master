import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import useMediaQuery from "./useMediaQuery"; // Import the custom hook

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      const res = await fetch(
        `/api/auth/me`,

        {
          headers: {
            //Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        localStorage.removeItem("token"); // Clean up invalid token
        throw new Error("Unauthorized");
      }
      return res.json();
    },
    retry: false,
  });

  // Use the custom hook to detect large screens
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {/* Common component, bc it's not wrapped with Routes */}
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path='/'
          element={authUser ? <HomePage /> : <Navigate to='/login' />}
        />
        <Route
          path='/login'
          element={!authUser ? <LoginPage /> : <Navigate to='/' />}
        />
        <Route
          path='/signup'
          element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
        />
        <Route
          path='/notifications'
          element={authUser ? <NotificationPage /> : <Navigate to='/login' />}
        />
        <Route
          path='/profile/:username'
          element={authUser ? <ProfilePage /> : <Navigate to='/login' />}
        />
      </Routes>
      {/* Render RightPanel only for large screens */}
      {authUser && isLargeScreen && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
