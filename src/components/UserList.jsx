import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const UserList = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [editedUser , setEditedUser ] = useState({});
  const [newUser , setNewUser ] = useState({
    username: "",
    password: "",
    fullname: "",
    role: "user", // Default role
  });
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const navigate = useNavigate();

  // Fetch users from API
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://gamingdb-test3.vercel.app/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch users. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred during fetching users.", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle add user
  const handleAddUser  = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://gamingdb-test3.vercel.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser ),
      });

      if (response.ok) {
        Swal.fire("Success", "User  has been added successfully", "success");
        fetchUsers();
        setNewUser ({
          username: "",
          password: "",
          fullname: "",
          role: "user", // Reset to default role
        });
      } else {
        Swal.fire("Error", "Failed to add user. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle edit user
  const handleEditUser  = (user) => {
    setSelectedUser (user);
    setEditedUser (user);
  };

  // Handle save user
  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://gamingdb-test3.vercel.app/api/users/${selectedUser .id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser ),
      });

      if (response.ok) {
        Swal.fire("Success", "User  has been updated successfully", "success");
        fetchUsers();
        setSelectedUser (null);
      } else {
        Swal.fire("Error", "Failed to update user. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle delete user
  const handleDeleteUser  = async (userId) => {
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
          const response = await fetch(`https://gamingdb-test3.vercel.app/api/users/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "User  has been deleted successfully", "success");
            fetchUsers();
          } else {
            Swal.fire("Error", "Failed to delete user. Please try again later.", "error");
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showAddUserForm ? "Cancel" : "Add New User"}
          </button>
        </header>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
          />
        </div>

        {showAddUserForm && (
          <div className="mb-6">
            <div className="bg-gray-800 p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <form onSubmit={handleAddUser } className="grid grid-cols-2 gap-4">
                {Object.keys(newUser ).map((key) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type={key === "password" ? "password" : "text"}
                      id={key}
                      name={key}
                      value={newUser [key]}
                      onChange={(e) => setNewUser ({ ...newUser , [key]: e.target.value })}
                      className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                  Add User
                </button>
              </form>
            </div>
          </div>
        )}

        {/* User List */}
        <h2 className="text-3xl font-bold mb-4">User  List</h2>
        {filteredUsers.length > 0 ? (
          <div className="bg-gray-800 rounded shadow-md">
            <ul className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <li key={user.id} className="p-4 flex justify-between items-center">
                  <div className="flex-grow text-left"> {/* Added flex-grow and text-left */}
  <h3 className="text-xl font-bold text-gray-100">{user.username}</h3>
  <p className="text-gray-400">Full Name: {user.fullname}</p>
  <p className="text-gray-400">Role: {user.role}</p>
</div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition"
                      onClick={() => handleEditUser (user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                      onClick={() => handleDeleteUser (user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">No users available.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, index) => index + 1).map((pageNumber) => (
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

        {/* Edit User Modal */}
        {selectedUser  && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h3 className="text-xl font-bold mb-4">Edit User</h3>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={editedUser .username}
                      onChange={(e) => setEditedUser ({ ...editedUser , username: e.target.value })}
                      className="w-full border-gray-700 bg-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="fullname" className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={editedUser .fullname}
                      onChange={(e) => setEditedUser ({ ...editedUser , fullname: e.target.value })}
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
                      onClick={() => setSelectedUser (null)}
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

export default UserList;
