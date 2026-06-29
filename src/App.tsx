import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AudioProvider } from "./context/AudioContext";

import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import SongPage from "./pages/SongPage";
import MiniPlayer from "./components/player/MiniPlayer";
import ExpandedPlayer from "./components/player/ExpandedPlayer";

export default function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/song/:id" element={<SongPage />} />
        </Routes>
      </BrowserRouter>
      <MiniPlayer />
      <ExpandedPlayer />
    </AudioProvider>
  );
}