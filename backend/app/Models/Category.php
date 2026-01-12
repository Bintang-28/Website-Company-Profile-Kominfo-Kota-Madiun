<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug', 
        'description',
        'color',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * Relasi many-to-many dengan News
     */
    public function news(): BelongsToMany
    {
        return $this->belongsToMany(News::class, 'news_categories');
    }
}