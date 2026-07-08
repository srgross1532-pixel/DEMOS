import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { supabase } from "./lib/supabase";
import { getMyProfile } from "./services/profileService";
import { AudioProvider } from "./context/AudioContext";

import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import SongPage from "./pages/SongPage";
import UsernamePage from "./pages/UsernamePage";
import MiniPlayer from "./components/player/MiniPlayer";
import ExpandedPlayer from "./components/player/ExpandedPlayer";

export default function App() {
  const [loading, setLoading] = useState(true);
const [loggedIn, setLoggedIn] = useState(false);
const [hasProfile, setHasProfile] =
  useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
  data: { session },
} = await supabase.auth.getSession();

setLoggedIn(!!session);

if (session) {
  const profile =
    await getMyProfile();

  setHasProfile(!!profile);
}

setLoading(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
  async (_event, session) => {
    setLoggedIn(!!session);

    if (session) {
      const profile =
        await getMyProfile();

      setHasProfile(!!profile);
    } else {
      setHasProfile(false);
    }
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
  to={
    hasProfile
      ? "/projects"
      : "/username"
  }
  replace
/>
              ) : (
                <LoginPage />
              )
            }
          />
<Route
  path="/username"
  element={
    loggedIn ? (
      hasProfile ? (
        <Navigate
          to="/projects"
          replace
        />
      ) : (
        <UsernamePage />
      )
    ) : (
      <Navigate
        to="/"
        replace
      />
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
