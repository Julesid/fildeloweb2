import React, { useEffect, useState } from "react";

function Activite() {
  const [activites, setActivites] = useState([]);
  const [newActivite, setNewActivite] = useState({
    libelle: "",
    commentaire: "",
  });
  const [editActivite, setEditActivite] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState("");

  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await fetch("/api/dashboard/activite");
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

  const handleEdit = async (activite) => {
    setEditActivite(activite);
    setShowModal(true);
    try {
      const res = await fetch(`/api/dashboard/points/${activite.id}`);
      const data = await res.json();
      setPoints(data);
    } catch (err) {
      console.error("Erreur chargement points", err);
    }
  };

  return (
    <div>
      <h1>Liste des Activités</h1>
      <ul>
        {activites.map((act) => (
          <li key={act.id}>
            {act.libelle} - {act.commentaire}
            <button onClick={() => handleEdit(act)}>Modifier</button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal">
          <h2>Modifier Activité</h2>
          <input
            type="text"
            value={editActivite?.libelle || ""}
            onChange={(e) => setEditActivite({ ...editActivite, libelle: e.target.value })}
          />

          <h3 className="text-lg font-bold mt-4">Points à évaluer</h3>
          <ul>
            {points.map((pt) => (
              <li key={pt.id} className="flex justify-between items-center mt-2">
                <input
                  type="text"
                  value={pt.libelle}
                  onChange={(e) => {
                    const updated = points.map((p) =>
                      p.id === pt.id ? { ...p, libelle: e.target.value } : p
                    );
                    setPoints(updated);
                  }}
                  className="border p-1"
                />
                <button
                  onClick={async () => {
                    await fetch(`/api/dashboard/points/${pt.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ libelle: pt.libelle }),
                    });
                  }}
                  className="bg-blue-500 text-white px-2 py-1 mx-1"
                >
                  Modifier
                </button>
                <button
                  onClick={async () => {
                    await fetch(`/api/dashboard/points/${pt.id}`, { method: "DELETE" });
                    setPoints(points.filter((p) => p.id !== pt.id));
                  }}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Nouveau point"
              value={newPoint}
              onChange={(e) => setNewPoint(e.target.value)}
              className="border p-1 mr-2"
            />
            <button
              onClick={async () => {
                const res = await fetch("/api/dashboard/points", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id_activite: editActivite.id,
                    libelle: newPoint,
                    id_critere: 1,
                    created_by: 1,
                  }),
                });
                if (res.ok) {
                  setPoints([...points, { id: Date.now(), libelle: newPoint }]);
                  setNewPoint("");
                }
              }}
              className="bg-green-500 text-white px-2 py-1"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activite;
