import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./components/register";
import Login from './components/login';
import TaskList from './components/taskList';
import TaskForm from './components/taskform';
import ProtectedRoute from './components/protectedroute';
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import InvitationConfirmation from "./components/invitationConfirmation";
import LoginForInvitation from "./components/loginForInvitation";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks/:projectId" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
        <Route path="/tasks/new" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
        <Route path="/tasks/edit/:id" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
        <Route path="/unirse/:token" element={<InvitationConfirmation />} />
        <Route path="/login-invitation/:token" element={<LoginForInvitation />} />
      </Routes>
    </Router>
  );
};

export default App;