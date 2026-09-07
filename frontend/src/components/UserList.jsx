import React from "react";

const UserList = ({ users, onDelete }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Registered Users</h2>

      {/* Center the table */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl overflow-x-auto   p-6 bg-white align-items-center">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Role</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="btn btn-outline-danger d-flex align-items-center rounded-pill px-3 py-2"
                      onClick={() => onDelete(user.id)}
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-4 border"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
