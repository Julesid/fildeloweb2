import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Vérifie la présence du token de session
    const sessionToken = Cookies.get("sessionToken");
    if (!sessionToken) {
      // Redirige vers la page de connexion si le token n'existe pas
      navigate("/dashboard");
    } else {
      // Vérifie la validité du token avec le backend
      const fetchDashboardData = async () => {
        try {
          const response = await axios.get("http://localhost:5001/api/dashboard", {
            headers: { Authorization: `Bearer ${sessionToken}` }
          });
          setMessage(response.data.message);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données du Dashboard :",
            error
          );
          navigate("/dashboard"); // Redirige si le token est invalide
        }
      };

      fetchDashboardData();
    }
  }, [navigate]);

  return (
    <div>
      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Fildelo</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                  <a>Mot de passe</a>
              </li>
              <li>
                <a>Déconnexion</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Menu fixe en bas */}
      <ul className="menu bg-base-200 lg:menu-horizontal rounded-box fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <li>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="blue"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12h3l3-9 4 18 4-12 3 6h3"
              />
            </svg>
            Activités
          </a>
        </li>
        <li>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="red"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
            Évaluations
          </a>
        </li>
        <li>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="green"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            Synthèse
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;
