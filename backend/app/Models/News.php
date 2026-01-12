<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;
use App\Models\Innovation;

class News extends Model
{
    protected $fillable = [
        'title',
        'published_at',
        'author',
        'views',
        'slug',
        'excerpt',
        'status',
        'source_url',
        'thumbnail_image_id'
    ];

    protected $appends = ['thumbnail_url'];

    protected $casts = [
        'published_at' => 'datetime'
    ];

    /**
     * Relasi ke NewsImage
     */
    public function images(): HasMany
    {
        return $this->hasMany(NewsImage::class, 'news_id')->orderBy('urutan');
    }

    /**
     * Relasi ke gambar thumbnail spesifik (BARU)
     */
    public function thumbnailImage()
    {
        return $this->belongsTo(NewsImage::class, 'thumbnail_image_id');
    }

    /**
     * Relasi many-to-many ke Categories
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'news_categories');
    }
    
    /**
     * Relasi ke NewsPdf
     */
    public function pdfs(): HasMany
    {
        return $this->hasMany(NewsPdf::class)->orderBy('urutan');
    }

    /**
     * Relasi ke NewsContent
     */
    public function contents(): HasMany
    {
        return $this->hasMany(NewsContent::class)->where('is_active', true)->orderBy('urutan');
    }

    /**
     * Accessor untuk thumbnail URL (UPDATED)
     */
    public function getThumbnailUrlAttribute()
    {
        if ($this->thumbnail_image_id && $this->thumbnailImage) {
            return Storage::url($this->thumbnailImage->path);
        }
        
        // Fallback: ambil gambar pertama jika tidak ada thumbnail yang diset
        $firstImage = $this->images->first();
        if ($firstImage) {
            return Storage::url($firstImage->path);
        }
        
        return null;
    }

    /**
     * Accessor untuk mendapat semua konten sebagai text
     */
    public function getFullContentAttribute()
    {
        return $this->contents->pluck('content')->implode(' ');
    }

    /**
     * Get images for content display (BARU: exclude thumbnail dari konten)
     */
    public function getContentImagesAttribute()
    {
        if ($this->thumbnail_image_id) {
            return $this->images->where('id', '!=', $this->thumbnail_image_id)->values();
        }
        return $this->images;
    }

    /**
     * Get the Table for the news.
    */
    public function Table()
    {
        return $this->hasMany(Innovation::class)->orderBy('urutan');
    }
}