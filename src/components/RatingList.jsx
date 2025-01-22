import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RatingList = ({ handleLogout }) => {
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [editedRating, setEditedRating] = useState({});
  const [newRating, setNewRating] = useState({ nama_rate: "" });
  const [showAddRatingForm, setShowAddRatingForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 7;

  const navigate = useNavigate();

  // Fetch ratings from API
  const fetchRatings = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://gamingdb-test3.vercel.app/api/ratings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRatings(data.data.ratings);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch ratings. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while fetching ratings.", "error");
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  // Filter ratings based on search term
  const filteredRatings = ratings.filter(rating =>
    rating.nama_rate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered ratings
  const totalPages = Math.ceil(filteredRatings.length / itemsPerPage);
  const paginatedRatings = filteredRatings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle add rating
  const handleAddRating = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://gamingdb-test3.vercel.app/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRating),
      });

      if (response.ok) {
        Swal.fire("Success", "Rating has been added successfully", "success");
        fetchRatings();
        setNewRating({ nama_rate: "" });
      } else {
        Swal.fire("Error", "Failed to add rating. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle edit rating
  const handleEditRating = (rating) => {
    setSelectedRating(rating);
    setEditedRating(rating);
  };

  // Handle save rating
  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://gamingdb-test3.vercel.app/api/ratings/${selectedRating.id_rate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedRating),
      });

      if (response.ok) {
        Swal.fire("Success", "Rating has been updated successfully", "success");
        fetchRatings();
        setSelectedRating(null);
      } else {
        Swal.fire("Error", "Failed to update rating. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle delete rating
  const handleDeleteRating = async (ratingId) => {
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
          const response = await fetch(`https://gamingdb-test3.vercel.app/api/ratings/${ratingId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "Rating has been deleted successfully", "success");
            fetchRatings();
          } else {
            Swal.fire("Error", "Failed to delete rating. Please try again later.", "error");
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
            onClick={() => setShowAddRatingForm(!showAddRatingForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showAddRatingForm ? "Cancel" : "Add New Rating"}
          </button>
        </header>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search ratings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
          />
        </div>

        {showAddRatingForm && (
          <div className="mb-6">
            <div className="bg-gray-800 p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Rating</h2>
              <form onSubmit={handleAddRating} className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nama_rate"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Rating Name
                  </label>
                  <input
                    type="text"
                    id="nama_rate"
                    name="nama_rate"
                    value={newRating.nama_rate}
                    onChange={(e) => setNewRating({ ...newRating, nama_rate: e.target.value })}
                    className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                  Add Rating
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Rating List */}
        <h2 className="text-3xl font-bold mb-4">Rating List</h2>
        {paginatedRatings.length > 0 ? (
          <div className="bg-gray-800 rounded shadow-md">
            <ul className="divide-y divide-gray-700">
              {paginatedRatings.map((rating) => (
                <li key={rating.id_rate} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{rating.nama_rate}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition"
                      onClick={() => handleEditRating(rating)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                      onClick={() => handleDeleteRating(rating.id_rate)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">No ratings available.</p>
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

        {/* Edit Rating Modal */}
        {selectedRating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h3 className="text-xl font-bold mb-4">Edit Rating</h3>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama_rate" className="block text-sm font-semibold text-gray-300 mb-2">Rating Name</label>
                    <input
                      type="text"
                      id="nama_rate"
                      name="nama_rate"
                      value={editedRating.nama_rate}
                      onChange={(e) => setEditedRating({ ...editedRating, nama_rate: e.target.value })}
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
                      onClick={() => setSelectedRating(null)}
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

export default RatingList;
