import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ModalTambahUser from "../../components/admin/ModalTambahUser";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil data pengguna:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Kelola Pengguna</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Tambah Pengguna Baru
        </button>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <Link
                        to={`/admin/manage-users/${user._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={async () => {
                          if (
                            window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")
                          ) {
                            try {
                              const token = localStorage.getItem("token");
                              await axios.delete(
                                `http://localhost:5000/api/users/${user._id}`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              setUsers(users.filter((u) => u._id !== user._id));
                            } catch (err) {
                              console.error("❌ Gagal menghapus pengguna:", err);
                            }
                          }
                        }}
                        className="ml-4 text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showModal && (
          <ModalTambahUser
            onClose={() => setShowModal(false)}
            onUserAdded={fetchUsers}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
