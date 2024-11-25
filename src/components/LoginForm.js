import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import pour la redirection

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEpreuve, setSelectedEpreuve] = useState(""); // État pour l'épreuve sélectionnée
  const [selectedPromotion, setSelectedPromotion] = useState(""); // État pour la promotion sélectionnée
  const [selectedUtilisateur, setSelectedUtilisateur] = useState(""); // État pour l'utilisateur sélectionné
  const [epreuves, setEpreuves] = useState([]); // Liste des épreuves
  const [promotions, setPromotions] = useState([]); // Liste des promotions
  const [utilisateurs, setUtilisateurs] = useState([]); // Liste des enseignants
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const responsePromotion = await axios.get(
          "http://localhost:5001/api/auth/promotion"
        );
        setPromotions(responsePromotion.data);
        const responseEpreuve = await axios.get(
          "http://localhost:5001/api/auth/epreuve"
        );
        setEpreuves(responseEpreuve.data);
        const responseUtilisateur = await axios.get(
          "http://localhost:5001/api/auth/utilisateur"
        );
        setUtilisateurs(responseUtilisateur.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des épreuves/promotions/utilisateurs :",
          error
        );
      }
    };

    fetchOptions();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          username: selectedUtilisateur, // Utilisation de selectedUtilisateur pour l'envoi
          password,
          epreuve: selectedEpreuve,
          promotion: selectedPromotion,
        }
      );

      if (response.data.success) {
        // Si la connexion est réussie, redirige vers le Dashboard
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
      <h2 className="text-2xl font-bold mb-4 text-center opacity-100">
        Connexion
      </h2>
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
          <label className="block mb-2 text-gray-700">Promotions</label>
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
              <option
                key={promotion.id}
                value={`${promotion.annee}`}
              >{`${promotion.annee.slice(0, 4)} - ${promotion.annee.slice(
                4
              )}`}</option>
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
