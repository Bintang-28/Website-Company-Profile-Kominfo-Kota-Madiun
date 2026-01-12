<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KunjunganHarian extends Model
{
    use HasFactory;

    // Menentukan nama tabel secara eksplisit
    protected $table = 'kunjungan_harian';

    protected $fillable = [
        'tanggal_kunjungan',
        'jumlah_kunjungan',
    ];

    protected $casts = [
        'tanggal_kunjungan' => 'date:Y-m-d',
    ];
}
