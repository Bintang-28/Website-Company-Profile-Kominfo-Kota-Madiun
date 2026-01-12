<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Table extends Model
{
    protected $table = 'table';

    protected $fillable = [
        'news_id',
        'nama_inovasi',
        'uraian', 
        'link',
        'urutan'
    ];

    protected $casts = [
        'urutan' => 'integer',
    ];

    /**
     * Get the news that owns the Table.
     */
    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}