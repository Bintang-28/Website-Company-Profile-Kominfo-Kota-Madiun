<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\NewsImage;
use App\Models\NewsPdf;
use App\Models\NewsContent;
use App\Models\Category;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource with search functionality.
     */
    public function index(Request $request)
    {
        try {
            $query = News::with([
                'images', 
                'categories', 
                'pdfs', 
                'contents',
                'thumbnailImage'
            ]);
            
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = trim($request->search);
                
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('excerpt', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('author', 'LIKE', "%{$searchTerm}%")
                      ->orWhereHas('contents', function($contentQuery) use ($searchTerm) {
                          $contentQuery->where('content', 'LIKE', "%{$searchTerm}%");
                      });
                });
                
                Log::info('Search Query:', [
                    'term' => $searchTerm,
                    'sql' => $query->toSql(),
                    'bindings' => $query->getBindings()
                ]);
            }
            
            if ($request->has('category') && !empty($request->category)) {
                $query->whereHas('categories', function ($q) use ($request) {
                    $q->where('slug', $request->category);
                });
            }
            
            if (!$request->has('admin') || $request->get('admin') !== 'true') {
                $query->where('status', 'published');
            }
            
            $query->orderBy('published_at', 'desc');
            
            $perPage = $request->get('per_page', 10);
            
            if ($request->has('search') || $request->has('per_page')) {
                $news = $query->paginate($perPage);
                
                if ($request->has('search')) {
                    Log::info('Search Results:', [
                        'term' => $request->search,
                        'total_found' => $news->total(),
                        'current_page_count' => $news->count()
                    ]);
                }
                
                return response()->json($news);
            } else {
                $news = $query->get();
                return response()->json($news);
            }
            
        } catch (\Exception $e) {
            Log::error('News index error:', [
                'error' => $e->getMessage(),
                'search_term' => $request->get('search'),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Terjadi kesalahan saat mengambil berita',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Show the form for creating a new resource.
     */
    public function showBySlug($slug)
    {
        $news = News::with([
            'images', 
            'categories', 
            'pdfs', 
            'contents',
            'thumbnailImage'
        ])->where('slug', $slug)->firstOrFail();
        $news->increment('views');
        return response()->json($news);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'published_at' => 'nullable|date',
            'author' => 'nullable|string',
            'slug' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
            'source_url' => 'nullable|url',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'image_captions' => 'nullable|array',
            'image_captions.*' => 'nullable|string',
            'pdfs' => 'nullable|array',
            'pdfs.*' => 'file|mimes:pdf|max:10240',
            'pdf_titles' => 'nullable|array',
            'pdf_titles.*' => 'nullable|string',
            'pdf_descriptions' => 'nullable|array', 
            'pdf_descriptions.*' => 'nullable|string',
            'pdf_display_modes' => 'nullable|array',
            'pdf_display_modes.*' => 'nullable|in:link,embed',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'contents' => 'nullable|array',
            'contents.*.type' => 'required|string',
            'contents.*.content' => 'required',
            'contents.*.metadata' => 'nullable|array',
            'block_orders' => 'nullable|array',
            'block_orders.*.id' => 'nullable|string',
            'block_orders.*.type' => 'required|string',
            'block_orders.*.order' => 'required|integer',
            'thumbnail_block_id' => 'nullable|integer',
        ]);
        
        if (empty($data['slug'])) {
            $data['slug'] = \Str::slug($data['title']);
        }
        
        DB::beginTransaction();
        try {
            $news = News::create($data);
            $thumbnailImageId = null;

            $orderMapping = [];
            if (!empty($data['block_orders'])) {
                foreach ($data['block_orders'] as $blockOrder) {
                    $orderMapping[$blockOrder['type']][] = $blockOrder['order'];
                }
            }

            if ($request->hasFile('images')) {
                $imageCaptions = $request->get('image_captions', []);
                $imageOrders = $orderMapping['image'] ?? [];
                $thumbnailBlockId = $request->get('thumbnail_block_id');
                
                foreach ($request->file('images') as $key => $file) {
                    $path = $file->store('news_gallery', 'public');
                    $newsImage = $news->images()->create([
                        'path' => $path,
                        'caption' => $imageCaptions[$key] ?? null,
                        'urutan' => $imageOrders[$key] ?? ($key + 1)
                    ]);
                    
                    if ($key === 0 && !$thumbnailImageId) {
                        $thumbnailImageId = $newsImage->id;
                    }
                }
            }

            if ($request->hasFile('documents')) {
                $documentTitles = $request->get('document_titles', []);
                $documentDescriptions = $request->get('document_descriptions', []);
                $documentDisplayModes = $request->get('document_display_modes', []);
                $documentOrders = $orderMapping['document'] ?? [];
                
                foreach ($request->file('documents') as $key => $file) {
                    $path = $file->store('news_documents', 'public');
                    $news->pdfs()->create([
                        'path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'file_type' => $file->getClientOriginalExtension(),
                        'title' => $documentTitles[$key] ?? null,
                        'description' => $documentDescriptions[$key] ?? null,
                        'display_mode' => $documentDisplayModes[$key] ?? 'link',
                        'file_size' => $file->getSize(),
                        'urutan' => $documentOrders[$key] ?? ($key + 1)
                    ]);
                }
            }

            if (!empty($data['category_ids'])) {
                $news->categories()->attach($data['category_ids']);
            }

            if (!empty($data['contents'])) {
                $contentOrders = $orderMapping['heading'] ?? $orderMapping['paragraph'] ?? [];
                
                foreach ($data['contents'] as $key => $contentData) {
                    $news->contents()->create([
                        'type' => $contentData['type'],
                        'content' => $contentData['content'],
                        'metadata' => $contentData['metadata'] ?? null,
                        'urutan' => $contentOrders[$key] ?? ($key + 1)
                    ]);
                }
            }

            if ($thumbnailImageId) {
                $news->update(['thumbnail_image_id' => $thumbnailImageId]);
            }

            DB::commit();
            
            return response()->json($news->load([
                'images', 
                'categories', 
                'pdfs', 
                'contents',
                'thumbnailImage'
            ]), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menyimpan data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $news = News::with([
            'images', 
            'categories', 
            'pdfs', 
            'contents',
            'thumbnailImage'
        ])->findOrFail($id);
        $news->increment('views');
        return response()->json($news);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, News $news)
    {
        $data = $request->validate([
            'title' => 'sometimes|required',
            'published_at' => 'nullable|date',
            'author' => 'nullable|string',
            'slug' => 'nullable|string|unique:news,slug,' . $news->id,
            'excerpt' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
            'source_url' => 'nullable|url',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'image_captions' => 'nullable|array',
            'image_captions.*' => 'nullable|string',
            'delete_images' => 'nullable|array',
            'delete_images.*' => 'integer|exists:news_images,id',
            'pdfs' => 'nullable|array',
            // PERBAIKAN 1: Izinkan file .doc dan .docx saat update
            'pdfs.*' => 'file|mimes:pdf,doc,docx|max:10240',
            'pdf_titles' => 'nullable|array',
            'pdf_descriptions' => 'nullable|array',
            'pdf_display_modes' => 'nullable|array',
            'pdf_display_modes.*' => 'nullable|in:link,embed',
            'updated_pdfs' => 'nullable|array',
            'updated_pdfs.*.id' => 'required|integer|exists:news_pdfs,id',
            'updated_pdfs.*.display_mode' => 'nullable|in:link,embed',
            'updated_pdfs.*.title' => 'nullable|string',
            'updated_pdfs.*.description' => 'nullable|string',
            'delete_pdfs' => 'nullable|array',
            'delete_pdfs.*' => 'integer|exists:news_pdfs,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'contents' => 'nullable|array',
            'contents.*.id' => 'nullable|integer|exists:news_contents,id',
            'contents.*.type' => 'required|string',
            'contents.*.content' => 'required|string',
            'contents.*.metadata' => 'nullable|array',
            'contents.*.order' => 'nullable|integer',
            'delete_contents' => 'nullable|array',
            'delete_contents.*' => 'integer|exists:news_contents,id',
            'block_orders' => 'nullable|array',
            'block_orders.*.id' => 'nullable',
            'block_orders.*.type' => 'required|string',
            'block_orders.*.order' => 'required|integer',
            'thumbnail_image_id' => 'nullable|integer|exists:news_images,id',
        ]);

        DB::beginTransaction();
        try {
            $news->update($request->except([
                'images', 'image_captions', 'delete_images', 'pdfs', 'delete_pdfs', 
                'pdf_titles', 'pdf_descriptions', 'pdf_display_modes', 'updated_pdfs',
                'category_ids', 'contents', 'delete_contents', 
                'block_orders', 'thumbnail_image_id'
            ]));

            if ($request->has('thumbnail_image_id')) {
                $news->update(['thumbnail_image_id' => $request->input('thumbnail_image_id')]);
            }

            if ($request->has('block_orders')) {
                $this->updateBlockOrders($news, $request->input('block_orders'));
            }

            if ($request->has('delete_images')) {
                $imagesToDelete = NewsImage::where('news_id', $news->id)->whereIn('id', $request->delete_images)->get();
                foreach($imagesToDelete as $image) {
                    if ($news->thumbnail_image_id == $image->id) {
                        $news->update(['thumbnail_image_id' => null]);
                    }
                    Storage::disk('public')->delete($image->path);
                    $image->delete();
                }
            }

            if ($request->hasFile('images')) {
                $imageCaptions = $request->get('image_captions', []);
                $maxOrder = $news->images()->max('urutan') ?? 0;
                
                foreach ($request->file('images') as $key => $file) {
                    $path = $file->store('news_gallery', 'public');
                    $newsImage = $news->images()->create([
                        'path' => $path,
                        'caption' => $imageCaptions[$key] ?? null,
                        'urutan' => $maxOrder + $key + 1,
                    ]);
                    
                    if (!$news->thumbnail_image_id) {
                        $news->update(['thumbnail_image_id' => $newsImage->id]);
                    }
                }
            }

            if ($request->has('delete_pdfs')) {
                $pdfsToDelete = $news->pdfs()->whereIn('id', $request->delete_pdfs)->get();
                foreach($pdfsToDelete as $pdf) {
                    Storage::disk('public')->delete($pdf->path);
                    $pdf->delete();
                }
            }

            if ($request->has('updated_pdfs')) {
                foreach ($request->input('updated_pdfs') as $pdfUpdate) {
                    $pdf = $news->pdfs()->where('id', $pdfUpdate['id'])->first();
                    if ($pdf) {
                        $pdf->update([
                            'display_mode' => $pdfUpdate['display_mode'] ?? $pdf->display_mode,
                            'title' => $pdfUpdate['title'] ?? $pdf->title,
                            'description' => $pdfUpdate['description'] ?? $pdf->description,
                        ]);
                    }
                }
            }

            if ($request->hasFile('pdfs')) {
                $pdfTitles = $request->get('pdf_titles', []);
                $pdfDescriptions = $request->get('pdf_descriptions', []);
                $pdfDisplayModes = $request->get('pdf_display_modes', []);
                $maxOrder = $news->pdfs()->max('urutan') ?? 0;
                
                foreach ($request->file('pdfs') as $key => $file) {
                    $path = $file->store('news_documents', 'public');
                    $news->pdfs()->create([
                        'path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'file_type' => $file->getClientOriginalExtension(),
                        'title' => $pdfTitles[$key] ?? null,
                        'description' => $pdfDescriptions[$key] ?? null,
                        'display_mode' => $pdfDisplayModes[$key] ?? 'link',
                        'file_size' => $file->getSize(),
                        'urutan' => $maxOrder + $key + 1
                    ]);
                }
            }

            if ($request->has('category_ids')) {
                $news->categories()->sync($request->category_ids);
            }

            if ($request->has('delete_contents')) {
                $news->contents()->whereIn('id', $request->delete_contents)->delete();
            }

            if (!empty($data['contents'])) {
                foreach ($data['contents'] as $contentData) {
                    if (isset($contentData['id'])) {
                        $news->contents()->where('id', $contentData['id'])->update([
                            'type' => $contentData['type'],
                            'content' => $contentData['content'],
                            'metadata' => $contentData['metadata'] ?? null,
                            'urutan' => $contentData['order'] ?? null
                        ]);
                    } else {
                        $maxOrder = $news->contents()->max('urutan') ?? 0;
                        $news->contents()->create([
                            'type' => $contentData['type'],
                            'content' => $contentData['content'],
                            'metadata' => $contentData['metadata'] ?? null,
                            'urutan' => $contentData['order'] ?? ($maxOrder + 1)
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json($news->load([
                'images', 
                'categories', 
                'pdfs', 
                'contents',
                'thumbnailImage'
            ]));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal memperbarui data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update block orders for existing news items.
     */
    private function updateBlockOrders($news, $blockOrders)
    {
        foreach ($blockOrders as $blockOrder) {
            $type = $blockOrder['type'];
            $order = $blockOrder['order'];
            $id = $blockOrder['id'] ?? null;

            switch ($type) {
                case 'image':
                    if ($id && is_numeric($id)) {
                        $news->images()->where('id', $id)->update(['urutan' => $order]);
                    }
                    break;
                
                case 'pdf':
                    if ($id && is_numeric($id)) {
                        $news->pdfs()->where('id', $id)->update(['urutan' => $order]);
                    }
                    break;
                
                case 'heading':
                case 'paragraph':
                    if ($id && is_numeric($id)) {
                        $news->contents()->where('id', $id)->update(['urutan' => $order]);
                    }
                    break;
            }
        }
    }

    /**
     * Set thumbnail image for news.
     */
    public function setThumbnail(Request $request, News $news)
    {
        $request->validate([
            'image_id' => 'required|integer|exists:news_images,id'
        ]);

        $image = $news->images()->where('id', $request->image_id)->first();
        if (!$image) {
            return response()->json(['message' => 'Image not found for this news'], 404);
        }

        $news->update(['thumbnail_image_id' => $request->image_id]);
        
        return response()->json([
            'message' => 'Thumbnail updated successfully',
            'thumbnail_image_id' => $request->image_id
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(News $news)
    {
        DB::beginTransaction();
        try {
            foreach ($news->images as $image) {
                Storage::disk('public')->delete($image->path);
            }
            foreach ($news->pdfs as $pdf) {
                Storage::disk('public')->delete($pdf->path);
            }
            $news->delete();
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menghapus data: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Get all active categories.
     */
    public function getCategories()
    {
        return response()->json(Category::where('is_active', true)->get());
    }

    /**
     * Get news by category slug.
     */
    public function getNewsByCategory($categorySlug)
    {
        $category = Category::where('slug', $categorySlug)->firstOrFail();
        
        $news = News::with(['images', 'categories', 'pdfs', 'contents'])
                      ->whereHas('categories', function($query) use ($category) {
                           $query->where('categories.id', $category->id);
                      })
                      ->orderBy('published_at', 'desc')
                      ->get();
        
        return response()->json([
            'category' => $category,
            'news' => $news
        ]);
    }
    
    /**
     * Get news by category.
     */
    public function getByCategory(string $categorySlug, Request $request)
    {
        try {
            $query = News::with(['categories', 'images', 'thumbnailImage'])
                ->whereHas('categories', function ($q) use ($categorySlug) {
                    $q->where('slug', $categorySlug);
                })
                ->where('status', 'published')
                ->orderBy('published_at', 'desc');
                
            $perPage = $request->get('per_page', 10);
            $news = $query->paginate($perPage);
            
            return response()->json($news);
            
        } catch (\Exception $e) {
            Log::error("Error in getByCategory for slug: {$categorySlug}", [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan di server saat mengambil berita berdasarkan kategori.'
            ], 500);
        }
    }

    /**
    * Display a listing of tables for a specific news.
    */
    public function indexTables($newsId)
    {
        try {
            $tables = Table::where('news_id', $newsId)
                            ->orderBy('urutan', 'asc')
                            ->get();
            
            return response()->json($tables);
            
        } catch (\Exception $e) {
            Log::error('Tables index error:', [
                'error' => $e->getMessage(),
                'news_id' => $newsId,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Terjadi kesalahan saat mengambil data tabel',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
    * Store a newly created table in storage.
    */
    public function storeTable(Request $request, $newsId)
    {
        $data = $request->validate([
            'nama_inovasi' => 'required|string|max:255',
            'uraian' => 'required|string',
            'link' => 'nullable|url',
            'urutan' => 'nullable|integer'
        ]);

        try {
            $news = News::findOrFail($newsId);
            
            if (!isset($data['urutan'])) {
                $lastOrder = Table::where('news_id', $newsId)->max('urutan');
                $data['urutan'] = $lastOrder ? $lastOrder + 1 : 1;
            }
            
            $data['news_id'] = $newsId;
            $table = Table::create($data);
            
            return response()->json($table, 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal menyimpan data tabel',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
    * Display the specified table.
    */
    public function showTable($newsId, $tableId)
    {
        try {
            $table = Table::where('news_id', $newsId)
                        ->where('id', $tableId)
                        ->firstOrFail();
            
            return response()->json($table);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Data tabel tidak ditemukan',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
    * Update the specified table in storage.
    */
    public function updateTable(Request $request, $newsId, $tableId)
    {
        $data = $request->validate([
            'nama_inovasi' => 'sometimes|required|string|max:255',
            'uraian' => 'sometimes|required|string',
            'link' => 'nullable|url',
            'urutan' => 'nullable|integer'
        ]);

        try {
            $table = Table::where('news_id', $newsId)
                        ->where('id', $tableId)
                        ->firstOrFail();
            
            $table->update($data);
            
            return response()->json($table);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal memperbarui data tabel',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
    * Remove the specified table from storage.
    */
    public function destroyTable($newsId, $tableId)
    {
        try {
            $table = Table::where('news_id', $newsId)
                        ->where('id', $tableId)
                        ->firstOrFail();
            
            $table->delete();
            
            return response()->json(null, 204);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal menghapus data tabel',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
    * Update table orders (bulk update).
    */
    public function updateTableOrders(Request $request, $newsId)
    {
        $data = $request->validate([
            'tables' => 'required|array',
            'tables.*.id' => 'required|integer|exists:tables,id',
            'tables.*.urutan' => 'required|integer'
        ]);

        DB::beginTransaction();
        try {
            foreach ($data['tables'] as $tableData) {
                $table = Table::where('id', $tableData['id'])
                                ->where('news_id', $newsId)
                                ->first();
                
                if ($table) {
                    $table->update(['urutan' => $tableData['urutan']]);
                }
            }
            
            DB::commit();
            
            return response()->json(['message' => 'Urutan tabel berhasil diperbarui']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Gagal memperbarui urutan tabel',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle the download request for a specific PDF.
     */
    public function downloadPdf(NewsPdf $pdf)
    {
        $pathDiServer = $pdf->path;
        $namaAsli = $pdf->original_name;

        if (!Storage::disk('public')->exists($pathDiServer)) {
            return response()->json(['message' => 'File tidak ditemukan.'], 404);
        }

        return Storage::disk('public')->download($pathDiServer, $namaAsli);
    }

    /**
     * Get statistics for the most viewed categories.
     */
    public function getCategoryStats(Request $request)
    {
        try {
            $limit = $request->get('limit', 10);

            $stats = Category::select('categories.name', 'categories.slug')
                ->addSelect(DB::raw('SUM(news.views) as total_views'))
                ->join('news_categories', 'categories.id', '=', 'news_categories.category_id')
                ->join('news', 'news_categories.news_id', '=', 'news.id')
                ->where('categories.is_active', true)
                ->where('news.status', 'published')
                ->groupBy('categories.id', 'categories.name', 'categories.slug')
                ->orderByDesc('total_views')
                ->limit($limit)
                ->get();
            
            return response()->json($stats);

        } catch (\Exception $e) {
            Log::error('Error getting category stats: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal mengambil statistik kategori', 'message' => $e->getMessage()], 500);
        }
    }
}