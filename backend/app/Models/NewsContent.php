<?php

// File: app/Models/NewsContent.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsContent extends Model
{
    protected $fillable = [
        'news_id',
        'type',
        'content',
        'metadata',
        'urutan',
        'is_active'
    ];

    protected $casts = [
        'metadata' => 'array', // Otomatis convert JSON ke array
        'is_active' => 'boolean'
    ];

    /**
     * Relasi ke News
     */
    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}