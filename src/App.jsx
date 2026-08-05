import React from "react";
import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProblemsProvider } from "./context/ProblemsContext";
import { AnnouncementsProvider } from "./context/AnnouncementsContext";
import { ActivityLogProvider } from "./context/ActivityLogContext";
import { VolunteersProvider } from "./context/VolunteersContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import MandalDashboard from "./pages/MandalDashboard";
import ReportProblem from "./pages/ReportProblem";
import ProblemDetails from "./pages/ProblemDetails";
import SolvedProblems from "./pages/SolvedProblems";
import Announcements from "./pages/Announcements";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const withLayout = (element) => <Layout>{element}</Layout>;

function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProblemsProvider>
          <AnnouncementsProvider>
            <ActivityLogProvider>
              <VolunteersProvider>{children}</VolunteersProvider>
            </ActivityLogProvider>
          </AnnouncementsProvider>
        </ProblemsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/dashboard" element={withLayout(<Dashboard />)} />
        <Route path="/mandal/:mandalId" element={withLayout(<MandalDashboard />)} />
        <Route path="/problem/:id" element={withLayout(<ProblemDetails />)} />
        <Route path="/solved" element={withLayout(<SolvedProblems />)} />
        <Route path="/announcements" element={withLayout(<Announcements />)} />
        <Route path="/about" element={withLayout(<AboutUs />)} />

        <Route
          path="/report"
          element={withLayout(
            <ProtectedRoute>
              <ReportProblem />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin"
          element={withLayout(
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />

        <Route path="*" element={withLayout(<NotFound />)} />
      </Routes>
    </Providers>
  );
}
