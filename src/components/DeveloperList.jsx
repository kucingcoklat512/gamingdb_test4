import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const DeveloperList = ({ handleLogout }) => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [editedDeveloper, setEditedDeveloper] = useState({});
  const [newDeveloper, setNewDeveloper] = useState({ nama_dev: "" });
  const [showAddDeveloperForm, setShowAddDeveloperForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Fetch developers from API
  const fetchDevelopers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://gamingdb-test3.vercel.app/api/developers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDevelopers(data.data.developers);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch developers. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while fetching developers.", "error");
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Filter developers based on search term
  const filteredDevelopers = developers.filter(developer =>
    developer.nama_dev.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered developers
  const totalPages = Math.ceil(filteredDevelopers.length / itemsPerPage);
  const paginatedDevelopers = filteredDevelopers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle add developer
  const handleAddDeveloper = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/developers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDeveloper),
      });

      if (response.ok) {
        Swal.fire("Success", "Developer has been added successfully", "success");
        fetchDevelopers();
        setNewDeveloper({ nama_dev: "" });
      } else {
        Swal.fire("Error", "Failed to add developer. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle edit developer
  const handleEditDeveloper = (developer) => {
    setSelectedDeveloper(developer);
    setEditedDeveloper(developer);
  };

  // Handle save developer
  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/developers/${selectedDeveloper.id_dev}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedDeveloper),
      });

      if (response.ok) {
        Swal.fire("Success", "Developer has been updated successfully", "success");
        fetchDevelopers();
        setSelectedDeveloper(null);
      } else {
        Swal.fire("Error", "Failed to update developer. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle delete developer
  const handleDeleteDeveloper = async (developerId) => {
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
          const response = await fetch(`http://127.0.0.1:5000/api/developers/${developerId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "Developer has been deleted successfully", "success");
            fetchDevelopers();
          } else {
            Swal.fire("Error", "Failed to delete developer. Please try again later.", "error");
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
            onClick={() => setShowAddDeveloperForm(!showAddDeveloperForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showAddDeveloperForm ? "Cancel" : "Add New Developer"}
          </button>
        </header>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search developers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
          />
        </div>

        {showAddDeveloperForm && (
          <div className="mb-6">
            <div className="bg-gray-800 p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Developer</h2>
              <form onSubmit={handleAddDeveloper} className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nama_dev"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Developer Name
                  </label>
                  <input
                    type="text"
                    id="nama_dev"
                    name="nama_dev"
                    value={newDeveloper.nama_dev}
                    onChange={(e) => setNewDeveloper({ ...newDeveloper, nama_dev: e.target.value })}
                    className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                  Add Developer
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Developer List */}
        <h2 className="text-3xl font-bold mb-4">Developer List</h2>
        {paginatedDevelopers.length > 0 ? (
          <div className="bg-gray-800 rounded shadow-md">
            <ul className="divide-y divide-gray-700">
              {paginatedDevelopers.map((developer) => (
                <li key={developer.id_dev} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{developer.nama_dev}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition"
                      onClick={() => handleEditDeveloper(developer)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                      onClick={() => handleDeleteDeveloper(developer.id_dev)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">No developers available.</p>
        )}

        {/* Pagination */}
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
        {/* Edit Developer Modal */}
        {selectedDeveloper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h3 className="text-xl font-bold mb-4">Edit Developer</h3>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama_dev" className="block text-sm font-semibold text-gray-300 mb-2">Developer Name</label>
                    <input
                      type="text"
                      id="nama_dev"
                      name="nama_dev"
                      value={editedDeveloper.nama_dev}
                      onChange={(e) => setEditedDeveloper({ ...editedDeveloper, nama_dev: e.target.value })}
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
                      onClick={() => setSelectedDeveloper(null)}
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

export default DeveloperList;
