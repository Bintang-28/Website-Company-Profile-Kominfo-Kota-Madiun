"use client";

import { useEffect, useState } from 'react';
// HAPUS: import AdminLayout from '@/app/admin/layout';
import UserModal from '@/components/admin/UserModal';
import Cookies from 'js-cookie';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const token = Cookies.get('auth_token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = () => {
    handleCloseModal();
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      const token = Cookies.get('auth_token');
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        fetchUsers();
      } catch (error) {
        console.error("Gagal menghapus user:", error);
      }
    }
  };

  return (
    // HAPUS: Tag <AdminLayout> pembuka
    <>
      <div className="themed-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-2xl">Manajemen Akun</h2>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" /> Tambah Akun
          </button>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="themed-table-head">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Nama</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Tgl Dibuat</th>
                  <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b dark:border-slate-700">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 capitalize">{user.role}</td>
                    <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button onClick={() => handleOpenModal(user)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}