"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Mengubah path import untuk mengatasi error resolusi modul
import { useAuth } from '../../../context/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function StatistikKategoriPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("Autentikasi diperlukan untuk melihat halaman ini.");
            return;
        }

        const fetchStats = async () => {
            try {
                setLoading(true);
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/news/stats/popular-categories?limit=10`;
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Gagal mengambil data statistik.');
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 themed-heading">Statistik Kategori Terpopuler</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
                Grafik ini menampilkan 10 kategori dengan total jumlah tayangan (views) berita terbanyak.
            </p>
            
            <div className="themed-card p-4 rounded-lg shadow-lg" style={{ width: '100%', height: 500 }}>
                {data.length > 0 ? (
                    <ResponsiveContainer>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={100}
                            />
                            <YAxis allowDataOverflow={true} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                    borderColor: '#334155',
                                    color: '#f1f5f9'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="total_views" fill="#3b82f6" name="Total Tayangan" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                     <div className="flex justify-center items-center h-full">
                        <p>Tidak ada data statistik yang tersedia.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

