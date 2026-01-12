"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IconButton } from "@material-tailwind/react";
import { FaYoutube, FaRobot } from "react-icons/fa";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

// Database Pengetahuan Kecamatan Taman
const KNOWLEDGE_BASE = {
  profil: {
    camat: {
      nama: "M. Yusuf Asmadi, S.Sos., M.M.",
      nip: "19721020 199803 1 009",
      pangkat: "Pembina (IV/a)",
      pendidikan: "S2"
    },
    alamat: "Jl. Taman Praja No.99, Kelurahan Pandean, Kecamatan Taman, Kota Madiun",
    telepon: "0351-463297",
    email: "kecamatantaman@madiunkota.go.id",
    whatsapp: "085186056056",
    luas: "13,46 Km²",
    kelurahan: [
      "Taman", "Banjarejo", "Demangan", "Kejuron", 
      "Josenan", "Pandean", "Manisrejo", "Mojorejo", "Kuncen"
    ]
  },
  jamPelayanan: {
    seninKamis: "07:30 - 15:30 WIB",
    jumat: "07:00 - 14:30 WIB",
    sabtuMinggu: "Tutup"
  },
  layanan: {
    ktp: {
      nama: "KTP/e-KTP",
      syaratBaru: [
        "Fotokopi Kartu Keluarga (KK)",
        "Untuk usia 17 tahun ke atas",
        "Pas foto terbaru 3x4 (2 lembar)"
      ],
      syaratHilang: [
        "Surat kehilangan dari Kepolisian",
        "Fotokopi Kartu Keluarga (KK)",
        "Pas foto terbaru 3x4 (2 lembar)"
      ]
    },
    kk: {
      nama: "Kartu Keluarga (KK)",
      syaratBaru: [
        "KTP asli suami dan istri",
        "Buku nikah asli dan fotokopi",
        "Surat keterangan pindah (jika dari luar daerah)"
      ],
      syaratTambahAnak: [
        "Surat keterangan lahir dari Bidan/RS",
        "KK asli dan fotokopi",
        "KTP kedua orang tua"
      ]
    },
    aktaLahir: {
      nama: "Akta Kelahiran",
      syarat: [
        "Surat keterangan lahir dari Bidan/Rumah Sakit",
        "KTP kedua orang tua",
        "Kartu Keluarga (KK)",
        "Buku nikah orang tua"
      ]
    },
    skck: {
      nama: "Surat Pengantar SKCK",
      syarat: [
        "Surat pengantar dari RT/RW",
        "Fotokopi KTP",
        "Fotokopi Kartu Keluarga",
        "Pas foto 4x6 (6 lembar, latar merah)",
        "Datang ke Polres Madiun di Jl. Soekarno Hatta No.66, Demangan"
      ],
      biaya: "Rp 30.000",
      lokasi: "Polres Madiun, Jl. Soekarno Hatta No.66, Kel. Demangan, Kec. Taman"
    },
    suratDomisili: {
      nama: "Surat Keterangan Domisili",
      syarat: [
        "Surat pengantar dari RT/RW",
        "Fotokopi KTP",
        "Fotokopi Kartu Keluarga"
      ]
    },
    sktm: {
      nama: "Surat Keterangan Tidak Mampu",
      syarat: [
        "Surat pengantar dari RT/RW",
        "Fotokopi KTP",
        "Fotokopi Kartu Keluarga",
        "Surat pernyataan tidak mampu"
      ],
      fungsi: "Untuk keperluan beasiswa, pengobatan, atau bantuan sosial",
      biaya: "GRATIS"
    },
    skbn: {
      nama: "Surat Keterangan Belum Pernah Menikah",
      syarat: [
        "Surat pengantar dari RT",
        "Surat pernyataan belum menikah bermaterai Rp 10.000",
        "Fotokopi Kartu Keluarga dan tunjukkan yang asli",
        "Fotokopi e-KTP"
      ]
    },
    dispensasiNikah: {
      nama: "Surat Dispensasi Nikah",
      syarat: [
        "Surat pengantar dari RT/RW",
        "Fotokopi KTP calon pengantin",
        "Fotokopi KK",
        "Surat penolakan dari KUA"
      ]
    },
    ijinUsaha: {
      nama: "Rekomendasi Ijin Usaha/UMKM",
      syarat: [
        "Surat pengantar dari RT/RW",
        "Fotokopi KTP",
        "Fotokopi KK",
        "Proposal usaha (jika diperlukan)"
      ]
    },
    ijinKeramaian: {
      nama: "Surat Ijin Keramaian",
      syarat: [
        "Surat pengantar dari RT/RW",
        "Proposal kegiatan",
        "Fotokopi KTP penanggungjawab"
      ]
    },
    skpwni: {
      nama: "Surat Keterangan Persyaratan WNI (untuk TNI/POLRI)",
      syarat: [
        "Surat pengantar dari RT/RW",
        "Fotokopi KTP",
        "Fotokopi KK",
        "Fotokopi Ijazah terakhir"
      ]
    }
  },
  wisata: {
    masjidKunoTaman: {
      nama: "Masjid Kuno Taman",
      deskripsi: "Bangunan peninggalan sejarah Kota Madiun"
    },
    masjidKunoKuncen: {
      nama: "Masjid Kuno Kuncen",
      deskripsi: "Masjid bersejarah di Kelurahan Kuncen"
    },
    pasarSleko: {
      nama: "Pasar Sleko",
      deskripsi: "Pasar tradisional yang ramai di Kecamatan Taman"
    }
  },
  perguruan: [
    "Politeknik Negeri Madiun",
    "Universitas Merdeka Madiun",
    "Universitas Muhammadiyah Madiun",
    "Universitas Katolik Widya Mandala Madiun",
    "STIKES Bhakti Husada Mulia Madiun",
    "STKIP Widya Yuwana Madiun"
  ],
  inovasi: {
    taliJiwo: {
      nama: "TALI JIWO (TAman peduLI JIwa Warga ODGJ)",
      deskripsi: "Program inovasi sosial untuk penanganan Orang Dengan Gangguan Jiwa"
    },
    kampungIklim: {
      nama: "Kampung Iklim",
      prestasi: "Kelurahan Taman meraih Trophy Utama Nasional Program Kampung Iklim dari Kementerian Lingkungan Hidup dan Kehutanan RI"
    }
  }
};

// Sistem AI Kontekstual dengan Memori Percakapan
class SmartChatBot {
  constructor() {
    this.context = {
      lastTopic: null,
      lastIntent: null,
      waitingFor: null,
      conversationHistory: []
    };
  }

  // Normalisasi teks
  normalize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Deteksi intent (maksud) user
  detectIntent(text) {
    const normalized = this.normalize(text);
    
    // Sapaan
    if (/^(halo|hai|hi|assalamualaikum|selamat|pagi|siang|sore|malam)/.test(normalized)) {
      return { type: 'greeting', confidence: 1.0 };
    }
    
    // Terima kasih
    if (/(terima kasih|makasih|thanks|thx)/.test(normalized)) {
      return { type: 'thanks', confidence: 1.0 };
    }
    
    // Profil & Identitas
    if (/(camat|pimpinan|kepala kecamatan)/.test(normalized)) {
      if (/(nama|siapa)/.test(normalized)) {
        return { type: 'camat_nama', topic: 'profil', confidence: 0.95 };
      }
      return { type: 'camat_info', topic: 'profil', confidence: 0.9 };
    }
    
    // Kontak & Lokasi
    if (/(alamat|lokasi|dimana|di mana|tempat|kantor)/.test(normalized)) {
      if (/(kecamatan|kantor)/.test(normalized)) {
        return { type: 'alamat', topic: 'kontak', confidence: 0.95 };
      }
    }
    
    if (/(telepon|telp|telefon|nomor|kontak|hubungi|call)/.test(normalized)) {
      return { type: 'kontak', topic: 'kontak', confidence: 0.9 };
    }
    
    if (/(email|surel|surat elektronik)/.test(normalized)) {
      return { type: 'email', topic: 'kontak', confidence: 0.9 };
    }
    
    if (/(whatsapp|wa|wassap)/.test(normalized)) {
      return { type: 'whatsapp', topic: 'kontak', confidence: 0.9 };
    }
    
    // Jam Pelayanan
    if (/(jam|waktu|pukul|kapan)/.test(normalized)) {
      if (/(buka|mulai|pelayanan|operasional)/.test(normalized)) {
        return { type: 'jam_buka', topic: 'jam', confidence: 0.95 };
      }
      if (/(tutup|selesai|akhir)/.test(normalized)) {
        return { type: 'jam_tutup', topic: 'jam', confidence: 0.95 };
      }
    }
    
    // Kelurahan
    if (/(kelurahan|desa|wilayah)/.test(normalized)) {
      if (/(apa|mana|sebutkan|daftar|list)/.test(normalized)) {
        return { type: 'kelurahan_list', topic: 'wilayah', confidence: 0.9 };
      }
    }
    
    // KTP
    if (/(ktp|e-ktp|ektp|kartu tanda penduduk)/.test(normalized)) {
      if (/(hilang|kehilangan)/.test(normalized)) {
        return { type: 'ktp_hilang', topic: 'layanan_ktp', confidence: 0.95 };
      }
      if (/(baru|bikin|buat|urus|cara|syarat)/.test(normalized)) {
        return { type: 'ktp_baru', topic: 'layanan_ktp', confidence: 0.95 };
      }
      return { type: 'ktp_info', topic: 'layanan_ktp', confidence: 0.85 };
    }
    
    // KK
    if (/(kk|kartu keluarga)/.test(normalized)) {
      if (/(tambah|anggota|anak|bayi|lahir|kelahiran)/.test(normalized)) {
        return { type: 'kk_tambah', topic: 'layanan_kk', confidence: 0.95 };
      }
      if (/(baru|bikin|buat|urus|cara|syarat)/.test(normalized)) {
        return { type: 'kk_baru', topic: 'layanan_kk', confidence: 0.95 };
      }
      return { type: 'kk_info', topic: 'layanan_kk', confidence: 0.85 };
    }
    
    // Akta Lahir
    if (/(akta|akte)/.test(normalized) && /(lahir|kelahiran)/.test(normalized)) {
      return { type: 'akta_lahir', topic: 'layanan_akta', confidence: 0.95 };
    }
    
    // SKCK
    if (/(skck|surat keterangan catatan kepolisian)/.test(normalized)) {
      return { type: 'skck', topic: 'layanan_skck', confidence: 0.95 };
    }
    
    // Surat Domisili
    if (/(domisili|tinggal)/.test(normalized) && /(surat|keterangan)/.test(normalized)) {
      return { type: 'domisili', topic: 'layanan_domisili', confidence: 0.9 };
    }
    
    // SKTM
    if (/(sktm|tidak mampu|miskin)/.test(normalized)) {
      return { type: 'sktm', topic: 'layanan_sktm', confidence: 0.95 };
    }
    
    // Surat Belum Menikah
    if (/(belum menikah|belum nikah|single)/.test(normalized)) {
      return { type: 'skbn', topic: 'layanan_skbn', confidence: 0.9 };
    }
    
    // Dispensasi Nikah
    if (/(dispensasi)/.test(normalized) && /(nikah|menikah|kawin)/.test(normalized)) {
      return { type: 'dispensasi_nikah', topic: 'layanan_nikah', confidence: 0.95 };
    }
    
    // Ijin Usaha
    if (/(ijin|izin)/.test(normalized) && /(usaha|umkm|dagang|toko)/.test(normalized)) {
      return { type: 'ijin_usaha', topic: 'layanan_usaha', confidence: 0.9 };
    }
    
    // Ijin Keramaian
    if (/(ijin|izin)/.test(normalized) && /(acara|keramaian|event)/.test(normalized)) {
      return { type: 'ijin_keramaian', topic: 'layanan_acara', confidence: 0.9 };
    }
    
    // TNI/POLRI
    if (/(tni|polri|tentara|polisi)/.test(normalized)) {
      return { type: 'tni_polri', topic: 'layanan_tni', confidence: 0.9 };
    }
    
    // Wisata
    if (/(wisata|tempat|objek|kunjungan|masjid|pasar)/.test(normalized)) {
      return { type: 'wisata', topic: 'wisata', confidence: 0.85 };
    }
    
    // Perguruan Tinggi
    if (/(kampus|universitas|kuliah|perguruan tinggi|politeknik|sekolah tinggi)/.test(normalized)) {
      return { type: 'perguruan', topic: 'pendidikan', confidence: 0.9 };
    }
    
    // Inovasi
    if (/(inovasi|program|prestasi|kampung iklim|tali jiwo)/.test(normalized)) {
      return { type: 'inovasi', topic: 'inovasi', confidence: 0.9 };
    }
    
    // Layanan Umum
    if (/(layanan|pelayanan|urus|bikin|buat)/.test(normalized)) {
      if (/(apa|ada|melayani)/.test(normalized)) {
        return { type: 'layanan_list', topic: 'layanan', confidence: 0.8 };
      }
    }
    
    // Follow-up questions
    if (/(lagi|lain|selanjutnya|terus)/.test(normalized)) {
      return { type: 'follow_up', confidence: 0.7 };
    }
    
    return { type: 'unknown', confidence: 0.0 };
  }

  // Generate response berdasarkan intent
  getResponse(userInput) {
    const intent = this.detectIntent(userInput);
    this.context.lastIntent = intent.type;
    
    if (intent.topic) {
      this.context.lastTopic = intent.topic;
    }
    
    this.context.conversationHistory.push({
      user: userInput,
      intent: intent.type,
      topic: intent.topic
    });

    switch (intent.type) {
      case 'greeting':
        return "Halo! Selamat datang di layanan Kecamatan Taman, Kota Madiun. Saya siap membantu Anda! 😊\n\nAnda bisa tanyakan tentang:\n• Jam pelayanan\n• Syarat pembuatan KTP, KK, Akta\n• Surat-surat (SKCK, Domisili, SKTM)\n• Alamat dan kontak kami\n• Wisata dan informasi lainnya\n\nAda yang bisa saya bantu?";
      
      case 'thanks':
        return "Sama-sama! Senang bisa membantu Anda. Jika ada pertanyaan lain seputar layanan Kecamatan Taman, jangan ragu untuk bertanya ya! 😊";
      
      case 'camat_nama':
        const camat = KNOWLEDGE_BASE.profil.camat;
        return `Camat Kecamatan Taman saat ini adalah Bapak ${camat.nama}.\n\n📋 Profil lengkap:\n• NIP: ${camat.nip}\n• Pangkat: ${camat.pangkat}\n• Pendidikan: ${camat.pendidikan}\n\nAda yang ingin ditanyakan lagi?`;
      
      case 'camat_info':
        return "Silakan tanyakan informasi spesifik tentang Camat, misalnya nama, kontak, atau hal lain yang ingin Anda ketahui.";
      
      case 'alamat':
        const p = KNOWLEDGE_BASE.profil;
        return `📍 Kantor Kecamatan Taman beralamat di:\n\n${p.alamat}\n\nAnda bisa mencari "Kecamatan Taman Kota Madiun" di Google Maps untuk petunjuk arah.\n\nButuh info kontak lainnya?`;
      
      case 'kontak':
        return `📞 Kontak Kecamatan Taman:\n\n• Telepon: ${KNOWLEDGE_BASE.profil.telepon}\n• WhatsApp: ${KNOWLEDGE_BASE.profil.whatsapp}\n• Email: ${KNOWLEDGE_BASE.profil.email}\n\nJangan ragu untuk menghubungi kami!`;
      
      case 'email':
        return `📧 Email Kecamatan Taman:\n${KNOWLEDGE_BASE.profil.email}\n\nAnda bisa mengirim pertanyaan atau pengaduan melalui email ini.`;
      
      case 'whatsapp':
        return `💬 WhatsApp Kecamatan Taman:\n${KNOWLEDGE_BASE.profil.whatsapp}\n\nKlik untuk chat langsung dengan kami!`;
      
      case 'jam_buka':
        const jam = KNOWLEDGE_BASE.jamPelayanan;
        return `⏰ Jam Pelayanan Kecamatan Taman:\n\n📅 Senin - Kamis: ${jam.seninKamis}\n📅 Jumat: ${jam.jumat}\n🚫 Sabtu - Minggu: ${jam.sabtuMinggu}\n\nPastikan datang di jam pelayanan ya!`;
      
      case 'jam_tutup':
        return `🕐 Pelayanan kami tutup pada:\n\n• Senin-Kamis: 15:30 WIB\n• Jumat: 14:30 WIB\n• Sabtu-Minggu: Libur\n\nPastikan mengurus dokumen sebelum jam tutup!`;
      
      case 'kelurahan_list':
        const kelurahans = KNOWLEDGE_BASE.profil.kelurahan;
        return `🏘️ Kecamatan Taman terdiri dari ${kelurahans.length} kelurahan:\n\n${kelurahans.map((k, i) => `${i + 1}. Kelurahan ${k}`).join('\n')}\n\nLuas wilayah: ${KNOWLEDGE_BASE.profil.luas}\n\nAda kelurahan tertentu yang ingin Anda ketahui?`;
      
      case 'ktp_baru':
        const ktpBaru = KNOWLEDGE_BASE.layanan.ktp.syaratBaru;
        return `🆔 Syarat Membuat KTP Baru (17 tahun ke atas):\n\n${ktpBaru.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n📍 Datang ke Kantor Kecamatan Taman dengan membawa persyaratan tersebut.\n\nAda dokumen lain yang ingin diurus?`;
      
      case 'ktp_hilang':
        const ktpHilang = KNOWLEDGE_BASE.layanan.ktp.syaratHilang;
        return `🆔 Syarat Urus KTP Hilang:\n\n${ktpHilang.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n⚠️ Penting: Buat surat kehilangan di Polsek terdekat terlebih dahulu!\n\nPerlu bantuan lain?`;
      
      case 'ktp_info':
        return "Untuk KTP, apakah Anda ingin:\n1. Membuat KTP baru (17 tahun)?\n2. Mengurus KTP hilang?\n\nSilakan ketik pilihan Anda!";
      
      case 'kk_baru':
        const kkBaru = KNOWLEDGE_BASE.layanan.kk.syaratBaru;
        return `👨‍👩‍👧‍👦 Syarat Membuat KK Baru (Pasangan Menikah):\n\n${kkBaru.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n📍 Bawa dokumen ke Kantor Kecamatan Taman.\n\nAda yang ingin ditanyakan lagi?`;
      
      case 'kk_tambah':
        const kkTambah = KNOWLEDGE_BASE.layanan.kk.syaratTambahAnak;
        return `👶 Syarat Menambah Anggota KK (Kelahiran Anak):\n\n${kkTambah.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n✅ Sekaligus bisa mengurus Akta Kelahiran!\n\nPerlu info dokumen lain?`;
      
      case 'kk_info':
        return "Untuk Kartu Keluarga, apakah Anda ingin:\n1. Membuat KK baru?\n2. Menambah anggota keluarga (kelahiran)?\n\nSilakan ketik pilihan Anda!";
      
      case 'akta_lahir':
        const akta = KNOWLEDGE_BASE.layanan.aktaLahir.syarat;
        return `👶 Syarat Membuat Akta Kelahiran:\n\n${akta.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n💡 Tips: Urus segera setelah bayi lahir untuk menghindari prosedur tambahan!\n\nAda pertanyaan lain?`;
      
      case 'skck':
        const skck = KNOWLEDGE_BASE.layanan.skck;
        return `🔐 Syarat Pengantar SKCK dari Kecamatan:\n\n${skck.syarat.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n💰 Biaya di Polres: ${skck.biaya}\n📍 Lokasi: ${skck.lokasi}\n\n⚠️ Setelah dapat pengantar dari kecamatan, langsung ke Polres untuk proses SKCK!\n\nPerlu bantuan lain?`;
      
      case 'domisili':
        const domisili = KNOWLEDGE_BASE.layanan.suratDomisili.syarat;
        return `🏠 Syarat Surat Keterangan Domisili:\n\n${domisili.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n💡 Surat ini berguna untuk berbagai keperluan administrasi di luar daerah asal.\n\nAda yang lain?`;
      
      case 'sktm':
        const sktm = KNOWLEDGE_BASE.layanan.sktm;
        return `💰 Surat Keterangan Tidak Mampu (SKTM)\n\n📋 Syarat:\n${sktm.syarat.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n✅ Fungsi: ${sktm.fungsi}\n💵 Biaya: ${sktm.biaya}\n\n⏱️ Proses cepat, biasanya selesai dalam 15 menit - 1 hari kerja.\n\nAda pertanyaan lagi?`;
      
      case 'skbn':
        const skbn = KNOWLEDGE_BASE.layanan.skbn;
        return `💍 Surat Keterangan Belum Pernah Menikah\n\n📋 Syarat:\n${skbn.syarat.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n💡 Biasanya untuk persyaratan menikah atau melamar kerja.\n\nPerlu info lain?`;
      
      case 'dispensasi_nikah':
        const nikah = KNOWLEDGE_BASE.layanan.dispensasiNikah;
        return `💑 Surat Dispensasi Nikah\n\n📋 Syarat:\n${nikah.syarat.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n⚠️ Diperlukan jika calon pengantin di bawah umur dan ditolak KUA.\n\nAda yang mau ditanyakan?`;
      
      case 'ijin_usaha':
        const usaha = KNOWLEDGE_BASE.layanan.ijinUsaha;
        return `🏪 Rekomendasi Ijin Usaha/UMKM\n\n📋 Syarat:\n${usaha.syarat.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n💡 Rekomendasi ini membantu proses perizinan usaha Anda.\n\nButuh info lain?`;
      
      case 'ijin_keramaian':
        const acara = KNOWLEDGE_BASE.layanan.ijinKeramaian;
        return `🎉 Surat Ijin Keramaian/Acara\n\n📋 Syarat:\n${acara.syarat.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n💡 Untuk acara seperti resepsi, hajatan, atau event lainnya.\n\nAda pertanyaan?`;
      
      case 'tni_polri':
        const tni = KNOWLEDGE_BASE.layanan.skpwni;
        return `🎖️ Surat Keterangan untuk Pendaftaran TNI/POLRI\n\n📋 Syarat:\n${tni.syarat.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n💡 Surat ini diperlukan untuk melengkapi berkas pendaftaran TNI/POLRI.\n\nPerlu bantuan lain?`;
      
      case 'wisata':
        const wisata = KNOWLEDGE_BASE.wisata;
        return `🏛️ Objek Wisata di Kecamatan Taman:\n\n1. ${wisata.masjidKunoTaman.nama}\n   ${wisata.masjidKunoTaman.deskripsi}\n\n2. ${wisata.masjidKunoKuncen.nama}\n   ${wisata.masjidKunoKuncen.deskripsi}\n\n3. ${wisata.pasarSleko.nama}\n   ${wisata.pasarSleko.deskripsi}\n\nKecamatan Taman memiliki nilai sejarah dan budaya yang kaya!\n\nAda yang ingin ditanyakan lagi?`;
      
      case 'perguruan':
        const kampus = KNOWLEDGE_BASE.perguruan;
        return `🎓 Perguruan Tinggi di Kecamatan Taman:\n\n${kampus.map((k, i) => `${i + 1}. ${k}`).join('\n')}\n\nKecamatan Taman adalah pusat pendidikan tinggi di Kota Madiun dengan 6 kampus!\n\nAda info lain yang Anda butuhkan?`;
      
      case 'inovasi':
        const inovasi = KNOWLEDGE_BASE.inovasi;
        return `🏆 Inovasi & Prestasi Kecamatan Taman:\n\n1. ${inovasi.taliJiwo.nama}\n   ${inovasi.taliJiwo.deskripsi}\n\n2. ${inovasi.kampungIklim.nama}\n   🏆 ${inovasi.kampungIklim.prestasi}\n\nKecamatan Taman terus berinovasi untuk kesejahteraan masyarakat!\n\nAda pertanyaan lain?`;
      
      case 'layanan_list':
        return `📋 Layanan yang tersedia di Kecamatan Taman:\n\n📄 Administrasi Kependudukan:\n• KTP/e-KTP\n• Kartu Keluarga (KK)\n• Akta Kelahiran\n\n📝 Surat Keterangan:\n• Pengantar SKCK\n• Domisili\n• SKTM (Tidak Mampu)\n• Belum Menikah\n• Dispensasi Nikah\n• TNI/POLRI\n\n🏢 Perizinan:\n• Rekomendasi Ijin Usaha/UMKM\n• Ijin Keramaian/Acara\n\nSilakan tanyakan detail syarat dokumen yang Anda butuhkan!`;
      
      case 'follow_up':
        if (this.context.lastTopic) {
          return `Silakan tanyakan lebih detail tentang ${this.context.lastTopic}, atau tanyakan hal lain yang ingin Anda ketahui!`;
        }
        return "Ada hal lain yang bisa saya bantu? Tanyakan saja!";
      
      default:
        return this.getSmartDefault(userInput);
    }
  }

  // Smart default response dengan konteks
  getSmartDefault(userInput) {
    const normalized = this.normalize(userInput);
    
    // Cek kata kunci penting
    if (/(biaya|bayar|gratis|tarif|harga)/.test(normalized)) {
      return "💰 Sebagian besar layanan administrasi di Kecamatan Taman adalah GRATIS!\n\nKhusus SKCK, biaya Rp 30.000 dibayarkan di Polres Madiun, bukan di kecamatan.\n\nAda dokumen spesifik yang ingin ditanyakan?";
    }
    
    if (/(lama|proses|berapa hari|berapa lama)/.test(normalized)) {
      return "⏱️ Waktu proses tergantung jenis dokumen:\n\n• Surat pengantar: 15 menit - 1 hari\n• KTP/KK: 3-14 hari kerja\n• Akta Kelahiran: 1-7 hari kerja\n\nUntuk info lebih detail, sebutkan dokumen yang ingin diurus!";
    }
    
    if (/(online|internet|website|daftar online)/.test(normalized)) {
      return "💻 Beberapa layanan sudah bisa diakses online melalui:\n\n• Website: madiunkota.go.id\n• WhatsApp: 085186056056\n\nNamun untuk pengambilan dokumen tetap harus datang ke kantor.\n\nAda yang ingin ditanyakan?";
    }

    if (this.context.lastTopic) {
      return `Maaf, saya kurang memahami pertanyaan Anda tentang "${this.context.lastTopic}".\n\nCoba tanyakan dengan cara lain, atau tanyakan hal lain seperti:\n• Jam pelayanan\n• Syarat dokumen (KTP, KK, SKCK, dll)\n• Alamat dan kontak\n• Informasi umum Kecamatan Taman`;
    }
    
    return "Maaf, saya belum memahami pertanyaan Anda. 😊\n\nSaya bisa membantu dengan:\n• Syarat pembuatan dokumen (KTP, KK, Akta, SKCK, dll)\n• Jam pelayanan\n• Alamat dan kontak\n• Info kelurahan dan wisata\n• Perguruan tinggi di Kecamatan Taman\n\nSilakan tanyakan hal spesifik!";
  }

  // Reset context
  resetContext() {
    this.context = {
      lastTopic: null,
      lastIntent: null,
      waitingFor: null,
      conversationHistory: []
    };
  }
}

// Inisialisasi bot
const chatBot = new SmartChatBot();

// --- Komponen Widget Chat ---
function ChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { 
      text: "Halo! Selamat datang di Kecamatan Taman, Kota Madiun! 👋\n\nSaya asisten virtual yang siap membantu Anda. Silakan tanyakan tentang:\n• Layanan administrasi\n• Jam pelayanan\n• Persyaratan dokumen\n• Kontak dan alamat\n\nAda yang bisa saya bantu?", 
      sender: "bot" 
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const userInput = inputValue;
    setInputValue("");

    // Simulasi typing delay
    setTimeout(() => {
      const botResponse = chatBot.getResponse(userInput);
      const botMessage = { text: botResponse, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickReply = (question: string) => {
    const userMessage = { text: question, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = chatBot.getResponse(question);
      const botMessage = { text: botResponse, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-white rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <FaRobot className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-base">Asisten Virtual</h3>
            <p className="text-xs text-blue-100">Kecamatan Taman</p>
          </div>
        </div>
        <IconButton variant="text" color="white" size="sm" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </div>

      {/* Chat Area */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-3`}>
            <div className={`p-3 rounded-lg max-w-[85%] shadow-sm ${
              message.sender === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
            }`}>
              <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Replies - Selalu Tampil */}
      <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 overflow-x-auto">
        <p className="text-xs text-gray-600 mb-2">Pertanyaan cepat:</p>
        <div className="flex space-x-2 overflow-x-auto pb-1">
          <button 
            onClick={() => handleQuickReply("Jam pelayanan")}
            className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 whitespace-nowrap transition-all hover:shadow-md"
          >
            ⏰ Jam Pelayanan
          </button>
          <button 
            onClick={() => handleQuickReply("Syarat KTP baru")}
            className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 whitespace-nowrap transition-all hover:shadow-md"
          >
            🆔 Syarat KTP
          </button>
          <button 
            onClick={() => handleQuickReply("Alamat kantor")}
            className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 whitespace-nowrap transition-all hover:shadow-md"
          >
            📍 Alamat
          </button>
          <button 
            onClick={() => handleQuickReply("Syarat SKCK")}
            className="text-xs bg-white border border-green-300 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-50 whitespace-nowrap transition-all hover:shadow-md"
          >
            🔐 SKCK
          </button>
          <button 
            onClick={() => handleQuickReply("Nomor kontak")}
            className="text-xs bg-white border border-purple-300 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-50 whitespace-nowrap transition-all hover:shadow-md"
          >
            📞 Kontak
          </button>
          <button 
            onClick={() => handleQuickReply("Layanan apa saja")}
            className="text-xs bg-white border border-orange-300 text-orange-700 px-3 py-1.5 rounded-full hover:bg-orange-50 whitespace-nowrap transition-all hover:shadow-md"
          >
            📋 Semua Layanan
          </button>
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex items-center bg-white rounded-b-xl">
        <input
          type="text"
          placeholder="Ketik pertanyaan Anda..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <IconButton 
          type="submit" 
          color="blue" 
          className="ml-2"
          disabled={inputValue.trim() === ""}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </IconButton>
      </form>
    </div>
  );
}

// --- Komponen Utama Plugin ---
export function FixedPlugin() {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  const hiddenPaths = ['/login', '/admin'];
  const shouldHide = hiddenPaths.some(path => pathname.startsWith(path));

  const handleOpenChat = () => {
    setMenuOpen(false);
    setChatOpen(true);
  };

  if (shouldHide) {
    return null;
  }

  if (isChatOpen) {
    return <ChatWidget onClose={() => setChatOpen(false)} />;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-center space-y-2">
        {isMenuOpen && (
          <>
            <IconButton className="bg-blue-500 hover:bg-blue-600 transition-all" onClick={handleOpenChat}>
              <FaRobot className="h-6 w-6" />
            </IconButton>
            <a href="https://www.youtube.com/@PemkotMadiun" target="_blank" rel="noopener noreferrer">
              <IconButton className="bg-red-500 hover:bg-red-600 transition-all">
                <FaYoutube className="h-6 w-6" />
              </IconButton>
            </a>
          </>
        )}
      </div>

      <IconButton
        color="white"
        size="lg"
        className="mt-2 !w-16 !h-16 rounded-full border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all hover:scale-110"
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        <Image
          width={128}
          height={128}
          src="/icons/diskominfo.png"
          alt="Hubungi Kami"
          className={`w-10 h-10 transition-transform duration-300 ${isMenuOpen ? "rotate-90" : ""}`}
        />
      </IconButton>
    </div>
  );
}