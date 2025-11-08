import { useState } from "react";
import "./App.css";
import Mission from "./JSX/missionStatement";
import Home from "./JSX/homePageIndex.jsx";
import { Route, Routes } from "react-router";
import Forum from "./JSX/forum.jsx";
import Login from "./JSX/login.jsx";
import Register from "./JSX/register.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/mission" element={<Mission />} />
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
