import React from "react";
import SignUp from "./components/view/SignUp";
import { Link, Route, Routes } from "react-router-dom";
import Verify from "./components/view/Verify";
import { LuSquare } from "react-icons/lu";

const App = () => {
  return (
    <div className="p-2 pt-8 flex items-start justify-center w-full">
      <Routes>
        <Route path="/" element={404} />
        <Route path="/auth" element={<SignUp />} />
        <Route path="/auth/verify" element={<Verify />} />
      </Routes>
    </div>
  );
};

export default App;
