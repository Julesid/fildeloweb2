import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Activite from "./dashboardComponents/Activite";
import Synthese from "./dashboardComponents/Synthese";
import Evaluation from "./dashboardComponents/Evaluation";

function Dashboard() {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [message, setMessage] = useState("");
  // eslint-disable-next-line
  const [username, setUsername] = useState("");
  const [epreuve, setEpreuve] = useState("");
  const [promotion, setPromotion] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const [alertClosing, setAlertClosing] = useState(false);
  const [activeTab, setActiveTab] = useState("activite");


  useEffect(() => {
    const sessionToken = Cookies.get("sessionToken");
    if (!sessionToken) {
      navigate("/");
      return;
    }

    const usernameCookie = Cookies.get("username");
    const epreuveCookie = Cookies.get("epreuve");
    const promotionCookie = Cookies.get("promotion");

    setUsername(usernameCookie);
    setEpreuve(epreuveCookie);
    setPromotion(promotionCookie);

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/dashboard",
          {
            headers: { Authorization: `Bearer ${sessionToken}` },
            credentials: true,
          }
        );
        setMessage(response.data.message);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        navigate("/dashboard"); //TODO : mettre a / une fois que ça marche ma poule
      }
    };

    fetchDashboardData();

    const alertTimeout = setTimeout(() => {
      setAlertClosing(true);
      setTimeout(() => setShowAlert(false), 500);
    }, 5000);

    return () => clearTimeout(alertTimeout);
  }, [navigate]);

  // Choix du composant à afficher en fonction de l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case "activite":
        return <Activite />;
      case "synthese":
        return <Synthese />;
      case "evaluation":
        return <Evaluation />;
      default:
        return null;
    }
  };

  return (
    <div>
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
                  alt="Avatar"
                  src="https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
                />
              </div>
            </div>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
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
      {/* Contenu dynamique */}
      <div>{renderTabContent()}</div>
      {showAlert && (
        <div
          role="alert"
          className={`alert alert-info fixed bottom-4 right-4 w-80 shadow-lg rounded-lg p-4 flex items-center transform transition-transform duration-500 ${
            alertClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="ml-2 text-sm">
            Connecté pour l'épreuve <strong>{epreuve}</strong> / promo{" "}
            <strong>{promotion && `${promotion.slice(0, 4)} - ${promotion.slice(4)}`}</strong>
          </span>
        </div>
      )}

      {/* Barre de navigation */}
      <ul className="menu bg-base-200 lg:menu-horizontal rounded-box fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <li>
          <a
            className={`flex items-center ${
              activeTab === "activite" ? "bg-gray-300" : ""
            }`}
            onClick={() => setActiveTab("activite")}
          >
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
          <a
            className={`flex items-center ${
              activeTab === "evaluation" ? "bg-gray-300" : ""
            }`}
            onClick={() => setActiveTab("evaluation")}
          >
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
          <a
            className={`flex items-center ${
              activeTab === "synthese" ? "bg-gray-300" : ""
            }`}
            onClick={() => setActiveTab("synthese")}
          >
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
