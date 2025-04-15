import React from 'react';
import SafeSpline from './components/SafeSpline';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="relative w-full h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <div className="relative w-full h-screen">
                {/* Arrière-plan interactif de Spline, si dispo */}
                <SafeSpline
                  scene="https://prod.spline.design/MYVyuwkObMX1Ru-h/scene.splinecode"
                  className="absolute inset-0 w-full h-full z-0"
                />
                {/* Formulaire de connexion superposé */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <LoginForm />
                </div>
              </div>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
