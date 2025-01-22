import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const GenreList = ({ handleLogout }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [editedGenre, setEditedGenre] = useState({});
  const [newGenre, setNewGenre] = useState({
    nama_genre: "",
  });
  const [showAddGenreForm, setShowAddGenreForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Fetch genres from API
  const fetchGenres = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://gamingdb-test3.vercel.app/api/genres", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGenres(data.data.genres);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch genres. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while fetching genres.", "error");
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Filter genres based on search term
  const filteredGenres = genres.filter(genre =>
    genre.nama_genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered genres
  const totalPages = Math.ceil(filteredGenres.length / itemsPerPage);
  const paginatedGenres = filteredGenres.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle add genre
  const handleAddGenre = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://gamingdb-test3.vercel.app/api/genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGenre),
      });

      if (response.ok) {
        Swal.fire("Success", "Genre has been added successfully", "success");
        fetchGenres();
        setNewGenre({ nama_genre: "" });
      } else {
        Swal.fire("Error", "Failed to add genre. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle edit genre
  const handleEditGenre = (genre) => {
    setSelectedGenre(genre);
    setEditedGenre(genre);
  };

  // Handle save genre
  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://gamingdb-test3.vercel.app/api/genres/${selectedGenre.id_genre}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedGenre),
      });

      if (response.ok) {
        Swal.fire("Success", "Genre has been updated successfully", "success");
        fetchGenres();
        setSelectedGenre(null);
      } else {
        Swal.fire("Error", "Failed to update genre. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle delete genre
  const handleDeleteGenre = async (genreId) => {
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
          const response = await fetch(`https://gamingdb-test3.vercel.app/api/genres/${genreId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "Genre has been deleted successfully", "success");
            fetchGenres();
          } else {
            Swal.fire("Error", "Failed to delete genre. Please try again later.", "error");
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            onClick={() => setShowAddGenreForm(!showAddGenreForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showAddGenreForm ? "Cancel" : "Add New Genre"}
          </button>
        </header>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
          />
        </div>

        {showAddGenreForm && (
          <div className="mb-6">
            <div className="bg-gray-800 p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Genre</h2>
              <form onSubmit={handleAddGenre} className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nama_genre"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Genre Name
                  </label>
                  <input
                    type="text"
                    id="nama_genre"
                    name="nama_genre"
                    value={newGenre.nama_genre}
                    onChange={(e) => setNewGenre({ ...newGenre, nama_genre: e.target.value })}
                    className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                  Add Genre
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Genre List */}
        <h2 className="text-3xl font-bold mb-4">Genre List</h2>
        {paginatedGenres.length > 0 ? (
          <div className="bg-gray-800 rounded shadow-md">
            <ul className="divide-y divide-gray-700">
              {paginatedGenres.map((genre) => (
                <li key={genre.id_genre} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{genre.nama_genre}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition"
                      onClick={() => handleEditGenre(genre)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                      onClick={() => handleDeleteGenre(genre.id_genre)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">No genres available.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`px-4 py-2 mx-2 rounded ${
                pageNumber === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        {/* Edit Genre Modal */}
        {selectedGenre && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h3 className="text-xl font-bold mb-4">Edit Genre</h3>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama_genre" className="block text-sm font-semibold text-gray-300 mb-2">Genre Name</label>
                    <input
                      type="text"
                      id="nama_genre"
                      name="nama_genre"
                      value={editedGenre.nama_genre}
                      onChange={(e) => setEditedGenre({ ...editedGenre, nama_genre: e.target.value })}
                      className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition ml-2"
                      onClick={() => setSelectedGenre(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreList;
