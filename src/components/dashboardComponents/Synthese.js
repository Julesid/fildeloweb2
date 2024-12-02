import React from "react";

function Synthese() {
  const syntheseData = {
    totalCours: 20,
    totalHeures: 50,
    moyenne: 15.4,
    commentaires: "Les performances générales sont satisfaisantes.",
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Synthèse</h1>
      <ul className="space-y-2">
        <li className="text-sm">
          <strong>Total des cours :</strong> {syntheseData.totalCours}
        </li>
        <li className="text-sm">
          <strong>Total d'heures :</strong> {syntheseData.totalHeures} heures
        </li>
        <li className="text-sm">
          <strong>Moyenne générale :</strong> {syntheseData.moyenne}
        </li>
        <li className="text-sm">
          <strong>Commentaires :</strong> {syntheseData.commentaires}
        </li>
      </ul>
    </div>
  );
}

export default Synthese;
