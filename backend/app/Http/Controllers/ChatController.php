<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function handle(Request $request)
    {
        $userMessage = $request->input('message');
        $apiKey = env('GOOGLE_API_KEY'); // Pastikan GOOGLE_API_KEY ada di file .env Laravel
        $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$apiKey}";

        $systemInstruction = "Kamu adalah 'Asisten Kominfo', chatbot yang ramah dan membantu untuk Dinas Komunikasi dan Informatika (Kominfo) Kota Madiun..."; // Masukkan instruksi lengkap di sini

        try {
            $response = Http::post($apiUrl, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $systemInstruction . "\n\nPertanyaan Pengguna: " . $userMessage]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                // Path untuk mengambil teks bisa berbeda, sesuaikan dengan response Gemini
                $reply = $response->json('candidates.0.content.parts.0.text');
                return response()->json(['reply' => $reply]);
            }

            return response()->json(['error' => 'Gagal berkomunikasi dengan AI.'], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}