import React, { useState, useEffect } from "react";
import axios from "axios";

type Operation = {
  id: number;
  description: string;
  amount: number;
};

const MainPage: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentOperation, setCurrentOperation] = useState<Operation | null>(null);

  // Récupérer les opérations depuis l'API
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/operations")
      .then((response) => setOperations(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des opérations :", error));
  }, []);

  // Ajouter ou modifier une opération
  const handleOperationSubmit = (operation: Operation) => {
    if (editMode && currentOperation) {
      axios
        .put(`http://localhost:8000/api/operations/${currentOperation.id}`, operation)
        .then(() => {
          setOperations((prev) =>
            prev.map((op) => (op.id === currentOperation.id ? { ...op, ...operation } : op))
          );
          closeModal();
        })
        .catch((error) => console.error("Erreur lors de la modification de l'opération :", error));
    } else {
      axios
        .post("http://localhost:8000/api/operations", operation)
        .then((response) => {
          setOperations((prev) => [...prev, response.data]);
          closeModal();
        })
        .catch((error) => console.error("Erreur lors de l'ajout de l'opération :", error));
    }
  };

  // Supprimer une opération
  const deleteOperation = (id: number) => {
    axios
      .delete(`http://localhost:8000/api/operations/${id}`)
      .then(() => {
        setOperations((prev) => prev.filter((op) => op.id !== id));
      })
      .catch((error) => console.error("Erreur lors de la suppression de l'opération :", error));
  };

  // Ouvrir le modal de formulaire
  const openModal = (operation?: Operation) => {
    setEditMode(!!operation);
    setCurrentOperation(operation || null);
    setIsModalOpen(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOperation(null);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Mes Opérations Bancaires</h1>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => openModal()}
      >
        Ajouter une opération
      </button>

      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b py-2 px-4">ID</th>
            <th className="border-b py-2 px-4">Description</th>
            <th className="border-b py-2 px-4">Montant</th>
            <th className="border-b py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((operation) => (
            <tr key={operation.id}>
              <td className="border-b py-2 px-4">{operation.id}</td>
              <td className="border-b py-2 px-4">{operation.description}</td>
              <td className="border-b py-2 px-4">{operation.amount}€</td>
              <td className="border-b py-2 px-4">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => openModal(operation)}
                >
                  Modifier
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteOperation(operation.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal pour Ajouter/Modifier une opération */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl mb-4">{editMode ? "Modifier" : "Ajouter"} une opération</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const description = (form.elements.namedItem("description") as HTMLInputElement).value;
                const amount = parseFloat((form.elements.namedItem("amount") as HTMLInputElement).value);
                handleOperationSubmit({ description, amount, id: currentOperation?.id || 0 });
              }}
            >
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  defaultValue={currentOperation?.description || ""}
                  className="w-full p-2 mt-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium">Montant</label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  defaultValue={currentOperation?.amount || ""}
                  className="w-full p-2 mt-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  {editMode ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
