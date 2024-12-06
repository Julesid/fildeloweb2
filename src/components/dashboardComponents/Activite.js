import React, { useEffect, useState } from "react";

function Activite() {
  const [activites, setActivites] = useState([]);
  const [newActivite, setNewActivite] = useState({
    libelle: "",
    commentaire: "",
  });

  // Utilise useEffect pour récupérer les données de l'API
  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/dashboard/activite"
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

  const handleEdit = (id) => {
    console.log("Modifier l'activité avec l'ID :", id);
    // Logique pour modifier l'activité
  };

  const handleDelete = (id) => {
    console.log("Supprimer l'activité avec l'ID :", id);
    // Logique pour supprimer l'activité
  };

  // Gestion de l'ajout d'une nouvelle activité
  const handleAddActivite = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5001/api/dashboard/activitepost",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Cookie": "connect.sid=s%3AnPSnWjN45MN6h3QYXMxn4pOuTAZX-AfV.pEiT8b1D%2FSsOBDObFqhtaP6CbpyM3Wf71u8vrKxoPdA; username=1",
          },
          body: JSON.stringify(newActivite),
          credentials: "include", // Inclut les cookies dans la requête
        }
      );

      if (response.ok) {
        const addedActivite = await response.json();
        setActivites((prev) => [...prev, addedActivite]);
        setNewActivite({ libelle: "", commentaire: "" });
      } else {
        console.error(
          "Erreur lors de l'ajout de l'activité :",
          response.status
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'activité :", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Gestion des Activités
      </h1>

      {/* Formulaire centré */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
          Ajouter une activité
        </h2>
        <form onSubmit={handleAddActivite} className="space-y-4">
          <div>
            <label
              htmlFor="libelle"
              className="block text-sm font-medium text-gray-600"
            >
              Libellé
            </label>
            <input
              id="libelle"
              type="text"
              value={newActivite.libelle}
              onChange={(e) =>
                setNewActivite({ ...newActivite, libelle: e.target.value })
              }
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="commentaire"
              className="block text-sm font-medium text-gray-600"
            >
              Commentaire
            </label>
            <textarea
              id="commentaire"
              value={newActivite.commentaire}
              onChange={(e) =>
                setNewActivite({ ...newActivite, commentaire: e.target.value })
              }
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ajouter
          </button>
        </form>
      </div>

      {/* Liste des activités */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Liste des Activités
        </h2>
        <ul className="space-y-4">
          {activites.length > 0 ? (
            activites.map((activite) => (
              <li
                key={activite.id}
                className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold text-indigo-600">
                    {activite.libelle}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {activite.commentaire || "Pas de commentaire disponible"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(activite.id)}
                    className="px-4 py-2 bg-orange-400 text-white text-sm font-medium rounded hover:bg-orange-500 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(activite.id)}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">Aucune activité disponible.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Activite;
