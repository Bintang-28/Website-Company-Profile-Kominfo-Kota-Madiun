"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'penulis',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'penulis',
      });
    } else {
       setFormData(prev => ({ ...prev, role: 'penulis' }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const token = Cookies.get('auth_token');
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/users`;

    const submissionData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
    };
    if (formData.password) {
        submissionData.password = formData.password;
        submissionData.password_confirmation = formData.password_confirmation;
    }

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const resData = await response.json();
      if (!response.ok) {
        let errorMsg = resData.message || 'Gagal menyimpan data.';
        if (resData.errors) {
            errorMsg = Object.values(resData.errors).flat().join(' ');
        }
        throw new Error(errorMsg);
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-2 border rounded bg-gray-50 dark:bg-[#1E293B] dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="themed-card p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Akun' : 'Tambah Akun Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Nama</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
            </div>

            {/* 4. Tambahkan dropdown untuk Role di sini */}
            <div>
              <label className="block mb-1">Peran (Role)</label>
              <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
                <option value="penulis">Penulis</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Password {isEditing && '(Kosongkan jika tidak diubah)'}</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} required={!isEditing} />
            </div>
            <div>
              <label className="block mb-1">Konfirmasi Password</label>
              <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} className={inputClass} required={!isEditing && !!formData.password} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-500 transition">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-300">
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}