import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Evaluation() {
  const [activites, setActivites] = useState([]);
  const [selectedActivite, setSelectedActivite] = useState(null);
  const [etudiants, setEtudiants] = useState([]);
  const [pointsEvaluer, setPointsEvaluer] = useState([]);
  const [evaluations, setEvaluations] = useState({});

  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await fetch(
          "/api/dashboard/activite"
        );
        if (response.ok) {
          const data = await response.json();
          setActivites(data);
        } else {
          console.error(
            "Erreur lors de la récupération des activités :",
            response.status
          );
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
          const promotionValue = Cookies.get("promotion");
          console.log("Promotion Value:", promotionValue);
          const response = await fetch(
            `/api/dashboard/etudiantsFromPromo/${promotionValue}`
          );
          console.log("Response:", response);
          if (response.ok) {
            const data = await response.json();
            // Filtrer les champs souhaités
            const filteredData = Array.isArray(data)
              ? data.map(({ id, nom, prenom, promo_id }) => ({
                  id,
                  nom,
                  prenom,
                  promo_id,
                }))
              : [
                  {
                    id: data.id,
                    nom: data.nom,
                    prenom: data.prenom,
                    promo_id: data.promo_id,
                  },
                ];
            setEtudiants(filteredData);
          } else {
            console.error(
              "Erreur lors de la récupération des étudiants :",
              response.status
            );
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des étudiants :",
            error
          );
        }
      };
      fetchEtudiants();

      const fetchPointsEvaluer = async () => {
        try {
          const response = await fetch(
            `/api/dashboard/pointsEvaluer/${selectedActivite.id}`
          );
          if (response.ok) {
            const data = await response.json();
            setPointsEvaluer(data);
          } else {
            console.error(
              "Erreur lors de la récupération des points à évaluer :",
              response.status
            );
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des points à évaluer :",
            error
          );
        }
      };
      fetchPointsEvaluer();
    }
  }, [selectedActivite]);

  const handleEvaluationChange = (etudiantId, critereId, value) => {
    setEvaluations((prev) => ({
      ...prev,
      [`${etudiantId}-${critereId}`]: value,
    }));
  };

  return (
    <div className="flex h-screen p-6 bg-gray-50">
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Liste des Activités
        </h2>
        <ul className="space-y-2">
          {activites.length > 0 ? (
            activites.map((activite) => (
              <li
                key={activite.id}
                onClick={() => setSelectedActivite(activite)}
                className={`p-3 rounded cursor-pointer transition ${
                  selectedActivite?.id === activite.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
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

      <div className="w-2/3 bg-white rounded-lg shadow-md p-6 ml-6 overflow-x-auto">
        {selectedActivite ? (
          <>
            <h2 className="text-xl font-bold text-gray-800">
              {selectedActivite.libelle}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {selectedActivite.commentaire || "Pas de commentaire disponible"}
            </p>

            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Étudiant</th>
                  {pointsEvaluer.map((point) => (
                    <th key={point.id} className="border border-gray-300 p-2">
                      {point.libelle}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(etudiants) &&
                  etudiants.map((etudiant) => (
                    <tr key={etudiant.id} className="border border-gray-300">
                      <td className="border border-gray-300 p-2">
                        {etudiant.prenom} {etudiant.nom}
                      </td>
                      {pointsEvaluer.map((point) => (
                        <td
                          key={point.id}
                          className="border border-gray-300 p-2"
                        >
                          <select
                            className="select select-primary"
                            value={
                              evaluations[`${etudiant.id}-${point.id}`] || ""
                            }
                            onChange={(e) =>
                              handleEvaluationChange(
                                etudiant.id,
                                point.id,
                                e.target.value
                              )
                            }
                          >
                            <option disabled={true} value="">
                              --
                            </option>
                            <option value="TS">TS</option>
                            <option value="S">S</option>
                            <option value="I">I</option>
                            <option value="TI">TI</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-gray-500">
            Sélectionnez une activité pour voir les détails.
          </p>
        )}
      </div>
    </div>
  );
}

export default Evaluation;
