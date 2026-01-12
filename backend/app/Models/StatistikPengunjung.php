<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatistikPengunjung extends Model
{
    use HasFactory;
    protected $table = 'statistik_pengunjung';
    protected $fillable = ['jumlah'];
}

