"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { RotateCcw, Loader2, Users, AlertTriangle, LineChart as LineChartIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const ConfirmModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="themed-card p-6 rounded-lg shadow-xl max-w-sm w-full">
                <div className="flex items-center mb-4"> <AlertTriangle className="text-yellow-500 mr-3 h-6 w-6" /> <h3 className="text-lg font-bold">Konfirmasi Aksi</h3> </div>
                <p className="text-sm mb-6 text-gray-600 dark:text-gray-300"> Apakah Anda yakin ingin mereset statistik? Aksi ini bersifat permanen dan tidak dapat dibatalkan. </p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50"> Batal </button>
                    <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:bg-red-400 flex items-center"> {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null} Ya, Reset </button>
                </div>
            </div>
        </div>
    );
};

export default function PengunjungPage() {
    const { token, isLoading: isAuthLoading } = useAuth();
    const [isResetting, setIsResetting] = useState(false);
    const [message, setMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [stats, setStats] = useState({ total_pengunjung: 0, daily_visits: [] });
    const [isStatLoading, setIsStatLoading] = useState(true);
    const [statError, setStatError] = useState(null);

    const fetchStats = async () => {
        setIsStatLoading(true);
        setStatError(null);
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/statistik-pengunjung?days=30`;
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal memuat data pengunjung.");
            }
            const data = await response.json();
            
            const formattedData = data.daily_visits.map(item => ({
                ...item,
                tanggal: format(new Date(item.visit_date), 'd MMM', { locale: id })
            }));
            
            setStats({
                total_pengunjung: data.total_pengunjung,
                daily_visits: formattedData
            });

        } catch (error) {
            setStatError(error.message);
        } finally {
            setIsStatLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthLoading && token) {
            fetchStats();
        } else if (!isAuthLoading && !token) {
             setIsStatLoading(false);
             setStatError("Autentikasi diperlukan untuk melihat statistik.");
        }
    }, [token, isAuthLoading]);

    const handleResetConfirm = async () => {
        setIsResetting(true);
        setMessage(null);
        try {
            if (!token) throw new Error("Token otentikasi tidak ditemukan.");
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/statistik-pengunjung/reset`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}`,'Accept': 'application/json' },
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal mereset statistik.");
            setMessage({ text: result.message, type: "success" });
            fetchStats();
        } catch (error) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setIsResetting(false);
            setIsModalOpen(false);
        }
    };
    
    if (isAuthLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <>
            <div className="p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-bold">Statistik Pengunjung</h1>
                
                {statError ? (
                    <div className="text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
                        <p className="font-bold">Gagal memuat statistik:</p>
                        <p className="text-sm">{statError}</p>
                    </div>
                ) : (
                    <>
                        <div className="themed-card p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-300">
                                <Users className="mr-3 text-blue-500 h-5 w-5" />
                                Total Pengunjung
                            </h2>
                            {isStatLoading ? (
                                <div className="flex items-center justify-center h-24"><Loader2 className="h-6 w-6 animate-spin" /></div>
                            ) : (
                                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mt-4">
                                    {stats.total_pengunjung?.toLocaleString('id-ID') ?? '0'}
                                </p>
                            )}
                        </div>

                        <div className="themed-card p-6 rounded-lg shadow">
                             <h2 className="text-xl font-semibold mb-4 flex items-center">
                                 <LineChartIcon className="mr-3 text-green-500"/>
                                 Grafik Pengunjung (30 Hari Terakhir)
                             </h2>
                            <div style={{ width: '100%', height: 400 }}>
                               {isStatLoading ? (
                                    <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
                                ) : stats.daily_visits.length > 0 ? (
                                    <ResponsiveContainer>
                                        <LineChart data={stats.daily_visits} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="tanggal" />
                                            <YAxis />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#cbd5e1', border: '1px solid #334155' }}/>
                                            <Legend />
                                            <Line type="monotone" dataKey="visits" name="Kunjungan Harian" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full"><p>Belum ada data kunjungan harian.</p></div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className="themed-card p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold border-b pb-3 mb-4">Reset Jumlah Pengunjung</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Tombol ini akan mereset semua data statistik pengunjung (total dan harian) kembali ke 0.
                    </p>
                    <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        <span>Reset Statistik</span>
                    </button>
                    {message && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${ message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
            
            <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleResetConfirm} isLoading={isResetting} />
        </>
    );
}

