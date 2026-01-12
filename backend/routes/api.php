<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StatistikPengunjungController;
use App\Http\Controllers\ChatController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/chat', [ChatController::class, 'handle']);

Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/slug/{slug}', [NewsController::class, 'showBySlug']);
Route::get('/news/{id}', [NewsController::class, 'show']);
Route::get('/categories', [NewsController::class, 'getCategories']);
Route::get('/news-by-category/{categorySlug}', [NewsController::class, 'getByCategory']);

Route::get('/news/stats/popular-categories', [NewsController::class, 'getCategoryStats']);

Route::get('/statistik-pengunjung', [StatistikPengunjungController::class, 'getStatistik']);

Route::get('/pdfs/download/{pdf}', [NewsController::class, 'downloadPdf'])->name('pdfs.download');
Route::get('/pdfs/view/{pdf}', [NewsController::class, 'viewPdf'])->name('pdfs.view');

Route::get('/stream-pdf/{path}', [NewsController::class, 'streamPdf'])->where('path', '.*');

Route::post('/check-user', function (Request $request) {
    $email = $request->email;
    $exists = \App\Models\User::where('email', $email)->exists();
    return response()->json(['exists' => $exists]);
});

Route::post('/statistik-pengunjung/catat', [StatistikPengunjungController::class, 'tambahDanTampilkan']);

Route::get('news/{news}/tables', [NewsController::class, 'indexTables']);
Route::post('news/{news}/tables', [NewsController::class, 'storeTable']);
Route::get('news/{news}/tables/{table}', [NewsController::class, 'showTable']);
Route::put('news/{news}/tables/{table}', [NewsController::class, 'updateTable']);
Route::delete('news/{news}/tables/{table}', [NewsController::class, 'destroyTable']);
Route::put('news/{news}/tables/orders', [NewsController::class, 'updateTableOrders']);

Route::apiResource('categories', CategoryController::class)->except(['create', 'edit']);

Route::get('/debug-search', [NewsController::class, 'debugSearch']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/auth/me', function (Request $request) {
        return $request->user();
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/statistik-pengunjung/reset', [StatistikPengunjungController::class, 'resetPengunjung']);

    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);

    Route::post('/news/{news}/set-thumbnail', [NewsController::class, 'setThumbnail']);
    
    Route::post('/news/{news}/reorder-content', [NewsController::class, 'reorderContent']);
    Route::patch('/news/{news}/content/{contentId}/toggle', [NewsController::class, 'toggleContent']);

    Route::apiResource('users', UserController::class)->except(['create', 'edit']);

    Route::post('news/{news}/tables', [NewsController::class, 'storeTable']);
    Route::put('news/{news}/tables/{table}', [NewsController::class, 'updateTable']);
    Route::delete('news/{news}/tables/{table}', [NewsController::class, 'destroyTable']);
    Route::put('news/{news}/tables/orders', [NewsController::class, 'updateTableOrders']);
});