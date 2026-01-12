<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Menampilkan semua data kategori.
     */
    public function index()
    {
        return response()->json(Category::all());
    }

    /**
     * Menyimpan kategori baru ke database.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:categories,name',
            'slug' => 'required|string|unique:categories,slug',
            'is_active' => 'nullable|boolean',
        ]);

        $category = Category::create($data);

        return response()->json($category, 201); // 201 = Created
    }

    /**
     * Menampilkan satu data kategori spesifik.
     */
    public function show(Category $category) // Laravel akan otomatis mencari kategori berdasarkan ID
    {
        return response()->json($category);
    }

    /**
     * Memperbarui data kategori yang ada.
     */
    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:categories,name,' . $category->id,
            'slug' => 'required|string|unique:categories,slug,' . $category->id,
            'is_active' => 'nullable|boolean',
        ]);

        $category->update($data);

        return response()->json($category);
    }

    /**
     * Menghapus data kategori.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(null, 204); // 204 = No Content
    }
}