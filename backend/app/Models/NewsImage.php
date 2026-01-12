<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsImage extends Model
{
    use HasFactory;
    protected $table = 'news_images';
    protected $guarded = ['id'];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}