"use client";

import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import Cookies from 'js-cookie';

export default function CategoryModal({ category, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!category;

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

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        color: category.color || '#3b82f6',
        is_active: category.is_active !== undefined ? category.is_active : true
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        color: '#3b82f6',
        is_active: true
      });
    }
  }, [category]);

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Auto-generate slug when name changes
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama kategori wajib diisi';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${API_BASE_URL}/categories/${category.id}`
        : `${API_BASE_URL}/categories`;

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        mode: 'cors',
        body: JSON.stringify(formData)
      });

      const resData = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(resData.errors || {});
          return;
        }
        let errorMsg = resData.message || 'Gagal menyimpan kategori.';
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
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-1">Nama Kategori *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Masukkan nama kategori"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`${inputClass} ${errors.slug ? 'border-red-500' : ''}`}
                placeholder="slug-kategori"
                required
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1">Deskripsi</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={inputClass}
                placeholder="Deskripsi kategori (opsional)"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block mb-1">Warna</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-12 h-10 border border-gray-300 dark:border-slate-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="ml-2 text-sm font-medium">
                Kategori aktif
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading} 
              className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-500 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditing ? 'Mengupdate...' : 'Menyimpan...'}
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEditing ? 'Update' : 'Simpan'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}