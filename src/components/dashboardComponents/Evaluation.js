import React from "react";

function Evaluation() {
  const evaluations = [
    { id: 1, matiere: "Mathématiques", note: 18, commentaire: "Excellent travail !" },
    { id: 2, matiere: "Physique", note: 14, commentaire: "Bon, mais peut mieux faire." },
    { id: 3, matiere: "Histoire", note: 16, commentaire: "Bonne compréhension des sujets." },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Évaluations</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Matière</th>
            <th className="border border-gray-300 px-4 py-2">Note</th>
            <th className="border border-gray-300 px-4 py-2">Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation) => (
            <tr key={evaluation.id}>
              <td className="border border-gray-300 px-4 py-2">{evaluation.matiere}</td>
              <td className="border border-gray-300 px-4 py-2">{evaluation.note}</td>
              <td className="border border-gray-300 px-4 py-2">{evaluation.commentaire}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Evaluation;
