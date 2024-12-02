import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEpreuve, setSelectedEpreuve] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [selectedUtilisateur, setSelectedUtilisateur] = useState("");
  const [epreuves, setEpreuves] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [responsePromotion, responseEpreuve, responseUtilisateur] =
          await Promise.all([
            axios.get("http://localhost:5001/api/auth/promotion"),
            axios.get("http://localhost:5001/api/auth/epreuve"),
            axios.get("http://localhost:5001/api/auth/utilisateur"),
          ]);

        setPromotions(responsePromotion.data);
        setEpreuves(responseEpreuve.data);
        setUtilisateurs(responseUtilisateur.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedUtilisateur) {
      const fetchPromotionsByUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/auth/promotion/${selectedUtilisateur}`
          );
          setPromotions(response.data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des promotions :",
            error
          );
          setPromotions([]);
        }
      };

      fetchPromotionsByUser();
    } else {
      setPromotions([]);
    }
  }, [selectedUtilisateur]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          username: selectedUtilisateur,
          password,
          epreuve: selectedEpreuve,
          promotion: selectedPromotion,
        }
      );

      if (response.data.success) {
        const { sessionToken, user, exam, promo } = response.data;

        Cookies.set("username", selectedUtilisateur, { expires: 2 });
        Cookies.set("epreuve", selectedEpreuve, { expires: 2 });
        Cookies.set("promotion", selectedPromotion, { expires: 2 });
        Cookies.set("sessionToken", sessionToken, { expires: 1 });

        console.log("Utilisateur :", user);
        console.log("Épreuve :", exam);
        console.log("Promotion :", promo);

        navigate("/dashboard");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "Erreur de connexion"
      );
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-lg w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Épreuve</label>
          <select
            value={selectedEpreuve}
            onChange={(e) => setSelectedEpreuve(e.target.value)}
            className="select w-full max-w-xs"
            required
          >
            <option value="" disabled>
              Choisir
            </option>
            {epreuves.map((epreuve) => (
              <option key={epreuve.id} value={epreuve.value}>
                {epreuve.value}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Nom d'utilisateur</label>
          <select
            value={selectedUtilisateur}
            onChange={(e) => setSelectedUtilisateur(e.target.value)}
            className="select w-full max-w-xs"
            required
          >
            <option value="" disabled>
              Choisir
            </option>
            {utilisateurs.map((utilisateur) =>
              utilisateur.type_utilisateur === "enseignant" ? (
                <option key={utilisateur.id} value={utilisateur.id}>
                  {utilisateur.nom}
                </option>
              ) : null
            )}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Promotion</label>
          <select
            value={selectedPromotion}
            onChange={(e) => setSelectedPromotion(e.target.value)}
            className="select w-full max-w-xs"
            required
          >
            <option value="" disabled>
              Choisir
            </option>
            {promotions.map((promotion) => (
              <option key={promotion.id} value={`${promotion.annee}`}>
                {`${promotion.annee.slice(0, 4)} - ${promotion.annee.slice(4)}`}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Se connecter
        </button>
        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
