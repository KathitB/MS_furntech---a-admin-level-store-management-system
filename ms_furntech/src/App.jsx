// import PageShell from "./components/PageShell";
// import "./App.css";
// import LoginPage from "./components/LoginPage";

// function App() {
//   return (
//     <>
//       {/* <PageShell /> */}
//       <LoginPage />
//     </>
//   );
// }

// export default App;

import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";

// import Dashboard from "./components/pages/Dashboard";
import PageShell from "./components/PageShell";

import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <PageShell />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
