import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { supabase } from "./lib/supabase";

import { AudioProvider } from "./context/AudioContext";

import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import SongPage from "./pages/SongPage";

import MiniPlayer from "./components/player/MiniPlayer";
import ExpandedPlayer from "./components/player/ExpandedPlayer";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setLoggedIn(!!session);
      setLoading(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090D]">
        <p className="text-zinc-500">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <AudioProvider>
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate
                  to="/projects"
                  replace
                />
              ) : (
                <LoginPage />
              )
            }
          />

          <Route
            path="/projects"
            element={
              loggedIn ? (
                <ProjectsPage />
              ) : (
                <Navigate
                  to="/"
                  replace
                />
              )
            }
          />

          <Route
            path="/project/:id"
            element={
              loggedIn ? (
                <ProjectPage />
              ) : (
                <Navigate
                  to="/"
                  replace
                />
              )
            }
          />

          <Route
            path="/song/:id"
            element={
              loggedIn ? (
                <SongPage />
              ) : (
                <Navigate
                  to="/"
                  replace
                />
              )
            }
          />

        </Routes>
      </BrowserRouter>

      <MiniPlayer />
      <ExpandedPlayer />
    </AudioProvider>
  );
}
