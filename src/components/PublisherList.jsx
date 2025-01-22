import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PublisherList = ({ handleLogout }) => {
  const [publishers, setPublishers] = useState([]);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [editedPublisher, setEditedPublisher] = useState({});
  const [newPublisher, setNewPublisher] = useState({
    nama_pub: "",});
  const [showAddPublisherForm, setShowAddPublisherForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const navigate = useNavigate();

  // Fetch publishers from API
  const fetchPublishers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/publishers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPublishers(data.data.publishers);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch publishers. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while fetching publishers.", "error");
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  // Filter publishers based on search term
  const filteredPublishers = publishers.filter(publisher =>
    publisher.nama_pub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered publishers
  const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);
  const paginatedPublishers = filteredPublishers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle add publisher
  const handleAddPublisher = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/publishers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPublisher),
      });

      if (response.ok) {
        Swal.fire("Success", "Publisher has been added successfully", "success");
        fetchPublishers();
        setNewPublisher({ nama_pub: "" });
      } else {
        Swal.fire("Error", "Failed to add publisher. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle edit publisher
  const handleEditPublisher = (publisher) => {
    setSelectedPublisher(publisher);
    setEditedPublisher(publisher);
  };

  // Handle save publisher
  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/publishers/${selectedPublisher.id_pub}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedPublisher),
      });

      if (response.ok) {
        Swal.fire("Success", "Publisher has been updated successfully", "success");
        fetchPublishers();
        setSelectedPublisher(null);
      } else {
        Swal.fire("Error", "Failed to update publisher. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle delete publisher
  const handleDeletePublisher = async (publisherId) => {
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
          const response = await fetch(`http://127.0.0.1:5000/api/publishers/${publisherId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "Publisher has been deleted successfully", "success");
            fetchPublishers();
          } else {
            Swal.fire("Error", "Failed to delete publisher. Please try again later.", "error");
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
            onClick={() => setShowAddPublisherForm(!showAddPublisherForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showAddPublisherForm ? "Cancel" : "Add New Publisher"}
          </button>
        </header>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search publishers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
          />
        </div>

        {showAddPublisherForm && (
          <div className="mb-6">
            <div className="bg-gray-800 p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Publisher</h2>
              <form onSubmit={handleAddPublisher} className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nama_pub"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Publisher Name
                  </label>
                  <input
                    type="text"
                    id="nama_pub"
                    name="nama_pub"
                    value={newPublisher.nama_pub}
                    onChange={(e) => setNewPublisher({ ...newPublisher, nama_pub: e.target.value })}
                    className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                  Add Publisher
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Publisher List */}
        <h2 className="text-3xl font-bold mb-4">Publisher List</h2>
        {paginatedPublishers.length > 0 ? (
          <div className="bg-gray-800 rounded shadow-md">
            <ul className="divide-y divide-gray-700">
              {paginatedPublishers.map((publisher) => (
                <li key={publisher.id_pub} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{publisher.nama_pub}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition"
                      onClick={() => handleEditPublisher(publisher)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                      onClick={() => handleDeletePublisher(publisher.id_pub)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">No publishers available.</p>
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

        {/* Edit Publisher Modal */}
        {selectedPublisher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h3 className="text-xl font-bold mb-4">Edit Publisher</h3>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama_pub" className="block text-sm font-semibold text-gray-300 mb-2">Publisher Name</label>
                    <input
                      type="text"
                      id="nama_pub"
                      name="nama_pub"
                      value={editedPublisher.nama_pub}
                      onChange={(e) => setEditedPublisher({ ...editedPublisher, nama_pub: e.target.value })}
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
                      onClick={() => setSelectedPublisher(null)}
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

export default PublisherList;