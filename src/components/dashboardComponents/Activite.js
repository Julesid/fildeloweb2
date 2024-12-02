import React from "react";

function Activite() {
  const activites = [
    { id: 1, titre: "Cours de mathématiques", description: "Introduction aux dérivées." },
    { id: 2, titre: "Activité sportive", description: "Course à pied au parc." },
    { id: 3, titre: "Atelier de groupe", description: "Discussion sur le projet final." },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Activités</h1>
      <ul className="space-y-2">
        {activites.map((activite) => (
          <li key={activite.id} className="border rounded p-2 bg-gray-100">
            <h2 className="text-lg font-semibold">{activite.titre}</h2>
            <p className="text-sm">{activite.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Activite;
