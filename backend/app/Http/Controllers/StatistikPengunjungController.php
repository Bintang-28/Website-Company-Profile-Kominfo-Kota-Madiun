<?php

namespace App\Http\Controllers;

use App\Models\StatistikPengunjung;
use App\Models\KunjunganHarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class StatistikPengunjungController extends Controller
{
    public function tambahDanTampilkan()
    {
        try {
            DB::transaction(function () {
                KunjunganHarian::firstOrCreate(['tanggal_kunjungan' => today()])
                    ->increment('jumlah_kunjungan');

                StatistikPengunjung::firstOrCreate([], ['jumlah' => 0])->increment('jumlah');
            });
            
            $totalPengunjung = StatistikPengunjung::value('jumlah') ?? 0;
            return response()->json(['jumlah' => $totalPengunjung]);

        } catch (\Exception $e) {
            Log::error('Error saat menambah statistik pengunjung: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal mencatat statistik.'], 500);
        }
    }
    
    public function getStatistik(Request $request)
    {
        try {
            $totalPengunjung = StatistikPengunjung::value('jumlah') ?? 0;

            $days = $request->get('days', 30);
            
            $dailyVisits = KunjunganHarian::where('tanggal_kunjungan', '>=', today()->subDays($days - 1))
                ->orderBy('tanggal_kunjungan', 'asc')
                ->get()
                ->map(function ($kunjungan) {
                    return [
                        'visit_date' => $kunjungan->tanggal_kunjungan->format('Y-m-d'),
                        'visits' => $kunjungan->jumlah_kunjungan,
                    ];
                });

            return response()->json([
                'total_pengunjung' => $totalPengunjung,
                'daily_visits' => $dailyVisits
            ]);
        } catch (\Exception $e) {
            Log::error('Error saat mengambil statistik pengunjung: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal mengambil data statistik.', 'message' => $e->getMessage()], 500);
        }
    }

    public function resetPengunjung()
    {
        try {
            DB::transaction(function () {
                StatistikPengunjung::query()->update(['jumlah' => 0]);
                KunjunganHarian::query()->delete();
            });

            return response()->json([
                'message' => 'Semua statistik pengunjung berhasil direset.',
                'jumlah_baru' => 0
            ]);
        } catch (\Exception $e) {
            Log::error('Error saat mereset statistik pengunjung: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal mereset statistik.'], 500);
        }
    }
}

