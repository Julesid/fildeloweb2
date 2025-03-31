import React, { useEffect, useState } from "react";

function Evaluation() {
  const [activites, setActivites] = useState([]);
  const [selectedActivite, setSelectedActivite] = useState(null);
  const [etudiants, setEtudiants] = useState([]);

  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/dashboard/activite");
        if (response.ok) {
          const data = await response.json();
          setActivites(data);
        } else {
          console.error("Erreur lors de la récupération des activités :", response.status);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des activités :", error);
      }
    };

    fetchActivites();
  }, []);

  useEffect(() => {
    if (selectedActivite) {
      const fetchEtudiants = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/dashboard/etudiants`);
          if (response.ok) {
            const data = await response.json();
            setEtudiants(data);
          } else {
            console.error("Erreur lors de la récupération des étudiants :", response.status);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des étudiants :", error);
        }
      };

      fetchEtudiants();
    }
  }, [selectedActivite]);

  return (
    <div className="flex h-screen p-6 bg-gray-50">
      {/* Liste des activités sur la gauche */}
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Liste des Activités</h2>
        <ul className="space-y-2">
          {activites.length > 0 ? (
            activites.map((activite) => (
              <li
                key={activite.id}
                onClick={() => setSelectedActivite(activite)}
                className={`p-3 rounded cursor-pointer transition ${
                  selectedActivite?.id === activite.id ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {activite.libelle}
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">Aucune activité disponible.</p>
          )}
        </ul>
      </div>

      {/* Détails de l'activité et liste des étudiants */}
      <div className="w-2/3 bg-white rounded-lg shadow-md p-6 ml-6">
        {selectedActivite ? (
          <div>
            <h2 className="text-xl font-bold text-gray-800">{selectedActivite.libelle}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {selectedActivite.commentaire || "Pas de commentaire disponible"}
            </p>

            {/* Liste des étudiants */}
            <h3 className="text-lg font-semibold mt-4">Étudiants de la promo</h3>
            <ul className="mt-2 space-y-2">
              {etudiants.length > 0 ? (
                etudiants.map((etudiant) => (
                  <li key={etudiant.id} className="p-2 bg-gray-100 rounded-md">
                    {etudiant.prenom} {etudiant.nom}
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucun étudiant trouvé.</p>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">Sélectionnez une activité pour voir les détails.</p>
        )}
      </div>
    </div>
  );
}

export default Evaluation;
