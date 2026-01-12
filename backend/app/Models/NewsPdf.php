<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class NewsPdf extends Model
{
    protected $fillable = [
        'news_id',
        'path',
        'original_name',
        'file_type',
        'title',
        'description',
        'display_mode',
        'file_size',
        'urutan'
    ];

    protected $appends = ['url', 'size_formatted'];

    /**
     * Relasi ke News
     */
    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }

    /**
     * Accessor untuk mendapat URL PDF
     */
    public function getUrlAttribute()
    {
        return Storage::url($this->path);
    }

    /**
     * Accessor untuk format ukuran file yang readable
     */
    public function getSizeFormattedAttribute()
    {
        if (!$this->file_size) return null;
        
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}   