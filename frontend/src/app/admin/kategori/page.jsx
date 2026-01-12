"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import Cookies from 'js-cookie';
import CategoryModal from './CategoryModal';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // API Base URL - Otomatis menambahkan /api jika belum ada
  const getApiBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  };
  
  const API_BASE_URL = getApiBaseUrl();

  // Get auth token
  const getAuthToken = () => {
    return Cookies.get('auth_token');
  };

  // API Headers
  const getHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: getHeaders(),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const categoriesArray = Array.isArray(data) ? data : (data.data || []);
      setCategories(categoriesArray);
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Gagal memuat data kategori');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for adding new category
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Open modal for editing category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const categoryName = category ? category.name : 'kategori ini';
    
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      alert(`Kategori "${categoryName}" berhasil dihapus!`);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Gagal menghapus kategori');
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Handle save from modal
  const handleSaveCategory = () => {
    fetchCategories(); // Refresh the list
    handleCloseModal();
    alert(editingCategory ? 'Kategori berhasil diperbarui!' : 'Kategori berhasil ditambahkan!');
  };

  // Toggle category status
  const toggleCategoryStatus = async (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    try {
      const updatedData = { 
        ...category, 
        is_active: !category.is_active 
      };
      
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: getHeaders(),
        mode: 'cors',
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? result : cat
      ));
    } catch (error) {
      console.error('Error updating category status:', error);
      alert('Gagal mengubah status kategori');
    }
  };

  return (
    <div className="themed-card p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-2xl">Manajemen Kategori</h2>
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Kategori
        </button>
      </div>

      {/* Categories Table */}
      {loading ? (
        <p>Memuat data...</p>
      ) : categories.length === 0 ? (
        <div className="text-center py-8">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Belum ada kategori</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Mulai dengan menambahkan kategori pertama Anda</p>
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" /> Tambah Kategori
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="themed-table-head">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Kategori</th>
                <th className="text-left py-3 px-4 font-semibold">Slug</th>
                <th className="text-left py-3 px-4 font-semibold">Deskripsi</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b dark:border-slate-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color || '#3b82f6' }}
                      ></div>
                      <div className="font-medium">{category.name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {category.slug}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm max-w-xs truncate">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleCategoryStatus(category.id)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                        category.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {category.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit kategori"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus kategori"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={handleCloseModal}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}