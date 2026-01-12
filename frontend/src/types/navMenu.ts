export interface NavChild {
  name: string;
  href: string;
}

export interface NavItem {
  name: string;
  href?: string;
  children?: NavChild[];
}

const NAV_MENU: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Berita", href: "/berita" },
  {
    name: "Pemerintah Kota Madiun",
    children: [
      { name: "PPID Kota Madiun", href: "https://ppid.madiunkota.go.id/" },
      { name: "Kecamatan Taman", href: "/" },
      { name: "Maguharjo", href: "https://kecamatan-manguharjo.madiunkota.go.id/" },
      { name: "Kartoharjo", href: "http://kecamatan-kartoharjo.madiunkota.go.id/" },
    ],
  },
  {
    name: "Kelurahan",
    children: [
      { name: "Kelurahan Taman", href: "http://kecamatan-kartoharjo.madiunkota.go.id/" },
      { name: "Kelurahan Banjarejo", href: "https://kelurahan-banjarejo.madiunkota.go.id/" },
      { name: "Kelurahan Demangan", href: "https://kelurahan-demangan.madiunkota.go.id/" },
      { name: "Kelurahan Kejuron", href: "https://kelurahan-kejuron.madiunkota.go.id/" },
      { name: "Kelurahan Josenan", href: "https://kelurahan-josenan.madiunkota.go.id/" },
      { name: "Kelurahan Pandean", href: "https://kelurahan-pandean.madiunkota.go.id/" },
      { name: "Kelurahan Manisrejo", href: "https://kelurahan-manisrejo.madiunkota.go.id/" },
      { name: "Kelurahan Mojorejo", href: "https://kelurahan-mojorejo.madiunkota.go.id/" },
      { name: "Kelurahan Kuncen", href: "https://kelurahan-kuncen.madiunkota.go.id/" },
      { name: "Prodeskel PMD", href: "https://prodeskel.binapemdes.kemendagri.go.id/mpublik/" },
    ],
  },
  {
    name: "Tentang",
    children: [
      { name: "Profil OPD", href: "/berita/kategori/8" },
      { name: "Profil Camat Taman Kota Madiun", href: "/berita/profil-camat-taman-kota-madiun" },
      { name: "Visi Dan Misi", href: "/berita/visi-dan-misi-kecamatan-taman-kota-madiun" },
      { name: "STANDAR PELAYANAN KECAMATAN TAMAN TAHUN 2024 (6 Komponen)", href: "/berita/standar-pelayanan-kecamatan-taman-tahun-2024-6-komponen" },
      { name: "Data Pegawai", href: "/berita/kategori/6" },
      { name: "Tupoksi", href: "/berita/tupoksi-kecamatan-taman-kota-madiun" },
      { name: "SK", href: "/berita/kategori/14" },
      { name: "Struktur Organisasi", href: "/berita/kategori/7" },
      { name: "Maklumat Pelayanan", href: "/berita/maklumat-pelayanan" },
    ],
  },
  {
    name: "PPID",
    children: [
      { name: "Kontak, Struktur Organisasi, Visi Misi PPID Kecamatan Taman", href: "/berita/kontak-struktur-organisasi-visi-misi-ppid-kecamatan-taman" 
 },
      { name: "TUGAS DAN FUNGSI PPID PELAKSANA KECAMATAN TAMAN", href: "/berita/tugas-dan-fungsi-ppid-pelaksana-kecamatan-taman" },
      { name: "Informasi Secara Berkala", href: "/berita/kategori/4" },
      { name: "SK PPID", href: "/berita/kategori/16" },
      { name: "Informasi Setiap Saat", href: "/berita/kategori/17" },
      { name: "Informasi Serta Merta", href: "/berita/kategori/18" },
      { name: "Informasi Dikecualikan", href: "/berita/kategori/19" },
      { name: "Laporan PPID", href: "/berita/kategori/20" },
      { name: "Daftar Informasi Publik Kecamatan Taman", href: "/berita/kategori/21" },
    ],
  },
  {
    name: "Layanan Publik",
    children: [
      { name: "Jam Pelayanan Kecamatan Taman", href: "/berita/jam-pelayanan-kecamatan-taman" },
      { name: "Standar Pelayanan Kecamatan Taman", href: "/berita/standar-pelayanan-kecamatan-taman-tahun-2024-6-komponen" },
      { name: "Rekapitulasi Umpan Balik Konsultasi Dan Pengaduan Di Kecamatan Taman", href: "/berita/rekapitulasi-umpan-balik-konsultasi-dan-pengaduan-di-kecamatan-taman" },
      { name: "RINGKASAN PERMOHONAN INFORMASI PUBLIK KECAMATAN TAMAN TAHUN 2022", href: "/berita/ringkasan-permohonan-informasi-publik-kecamatan-taman-tahun-2022" },
      { name: "Permohonan Informasi Publik", href: "#" },
      { name: "Pengajuan Keberatan Informasi", href: "#" },
      { name: "INOVASI", href: "/berita/inovasi-kecamatan-taman" },
    ],
  },
  {
    name: "Hubungi Kami",
    children: [
      { name: "TATA CARA PERMOHONAN INFORMASI PUBLIK", href: "/berita/tata-cara-permohonan-informasi-publik" },
      { name: "TATA CARA PENGAJUAN KEBERATAN DAN PROSES PENYELESAIAN SENGKETA INFORMASI PUBLIK", href: "/berita/tata-cara-pengajuan-keberatan-dan-proses-penyelesaian-sengketa-informasi-publik" },
      { name: "Tata Cara Aspirasi Dan Pengaduan Masyarakat", href: "/berita/tata-cara-aspirasi-dan-pengaduan-masyarakat" },
      { name: "APLIKASI ONLINE KECAMATAN TAMAN", href: "/berita/aplikasi-online-kecamatan-taman" },
    ],
  },
  { name: "FAQ", href: "/berita/faq" },
  { name: "VISIT TAMAN", href : "/visit-taman"},
  { name: "JALUR WISATA", href: "https://www.google.com/maps/d/u/0/viewer?ll=-7.642359646339356%2C111.52741&z=14&mid=1t8-sRMlLijK-tNVcdTStI8x_29FMDKQ"  },
];

export default NAV_MENU;