import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const GameList = ({ handleLogout }) => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [editedGame, setEditedGame] = useState({});
  const [newGame, setNewGame] = useState({
    name: "",
    platform: "",
    released: "",
    genre: "",
    developer: "",
    publisher: "",
    score: "",
    rating: "",
  });
  const [showAddGameForm, setShowAddGameForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGameInfo, setSelectedGameInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const fetchGames = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/games", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        if (data && data.data && data.data.games) {
          setGames(data.data.games);
        } else {
          Swal.fire("Error", "Unexpected response structure.", "error");
        }
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch games. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred during fetching games.", "error");
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const paginatedGames = filteredGames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddGame = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGame),
      });

      if (response.ok) {
        Swal.fire("Success", "Game has been added successfully", "success");
        fetchGames();
        setNewGame({
          name: "",
          platform: "",
          released: "",
          genre: "",
          developer: "",
          publisher: "",
          score: "",
          rating: "",
        });
        setShowAddGameForm(false);
      } else {
        Swal.fire("Error", "Failed to add game. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEditGame = (game) => {
    setSelectedGame(game);
    setEditedGame(game);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/games/${selectedGame.id_game}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedGame),
      });

      if (response.ok) {
        Swal.fire("Success", "Game has been updated successfully", "success");
        fetchGames();
        setSelectedGame(null);
      } else {
        Swal.fire("Error", "Failed to update game. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDeleteGame = async (gameId) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/games/${gameId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "Game has been deleted successfully", "success");
            fetchGames();
          } else {
            Swal.fire("Error", "Failed to delete game. Please try again later.", "error");
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Searching for:", searchTerm);
    }
  };

  const handleGameClick = (game) => {
    setSelectedGameInfo(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGameInfo(null);
  };
const navigate = useNavigate();
  return (
    <div className="flex bg-gray-900 min-h-screen">
      {/* Sidebar */}
      

      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          
          <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
            >
              Back
            </button>
    <h1 className="text-4xl font-extrabold text-gray-100">GameList</h1>
          <button
            onClick={() => setShowAddGameForm(!showAddGameForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showAddGameForm ? "Cancel" : "Add New Game"}
          </button>
        </header>

        {/* Input Pencarian */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
          />
        </div>

        {showAddGameForm && (
          <div className="mb-6">
            <div className="bg-gray-800 p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Game</h2>
              <form onSubmit={handleAddGame} className="grid grid-cols-2 gap-4">
                {Object.keys(newGame).map((key) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type={key === "released" || key === "score" ? "number" : "text"}
                      id={key}
                      name={key}
                      value={newGame[key]}
                      onChange={(e) => setNewGame({ ...newGame, [key]: e.target.value })}
                      className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                  Add Game
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedGames.map((game) => (
            <div
              key={game.id_game}
              className="bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleGameClick(game)}
            >
              <h3 className="text-lg font-bold text-gray-100">{game.name}</h3>
              <p className="text-sm text-gray-400">{game.genre} | {game.released}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-400">Score: {game.score}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditGame(game)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-full shadow hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game.id_game)}
                    className="bg-red-500 text-white px-3 py-1 rounded-full shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal untuk menampilkan informasi lengkap dari game yang dipilih */}
        {isModalOpen && selectedGameInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`bg-gray-900 p-6 rounded shadow-lg w-11/12 md:w-1/2`}>
              <h2 className="text-xl font-bold mb-4">{selectedGameInfo.name}</h2>
              <p className="text-gray-400">Platform: {selectedGameInfo.platform}</p>
              <p className="text-gray-400">Released: {selectedGameInfo.released}</p>
              <p className="text-gray-400">Genre: {selectedGameInfo.genre}</p>
              <p className="text-gray-400">Developer: {selectedGameInfo.developer}</p>
              <p className="text-gray-400">Publisher: {selectedGameInfo.publisher}</p>
              <p className="text-gray-400">Score: {selectedGameInfo.score}</p>
              <p className="text-gray-400">Rating: {selectedGameInfo.rating}</p>
              <button
                onClick={closeModal}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            Sebelumnya
          </button>

          {Array.from({ length: 5 }, (_, index) => {
            const pageNumber = currentPage - 2 + index;
            if (pageNumber < 1) return null;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="mx-1 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            Selanjutnya
          </button>
        </div>

        {selectedGame && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-xl font-bold mb-4">Edit Game</h2>
              <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                {Object.keys(editedGame).map((key) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type={
                        key === "released" || key === "score" ? "number" : "text"
                      }
                      id={key}
                      name={key}
                      value={editedGame[key] || ""}
                      onChange={(e) =>
                        setEditedGame({ ...editedGame, [key]: e.target.value })
                      }
                      className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="col-span-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </form>
              <button
                onClick={() => setSelectedGame(null)}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameList;