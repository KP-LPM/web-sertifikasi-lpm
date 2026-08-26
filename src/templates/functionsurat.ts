const [isLoading, setIsLoading] = useState<boolean>(false);
const handleDownloadSuratTugas = async () => {
  try {
    const payload = {
      nomorSurat: "B-005/UN.05/V.7/PP.00.9/07/2025",
      namaAsesor: "M Sandi Marta",
      noRegMet: "MET.000.007354 2024",
      bidangSkema: "Jenjang 5 Kewirausahaan Industri",
      namaTuk: "TUK Sewaktu",
      alamatTuk: "UIN Sunan Gunung Djati Bandung",
      hariTanggal: "Minggu, 06 Juli 2025",
      jam: "08.00 WIB",
      jumlahPeserta: 1,
      jumlahSkema: 1,
      namaAsesi: "Ach.Angga prasetya Harisman",
      spesifikasiRuangTuk: "Gd. Al-Jamiah Lt.6 - Ruangan Rapat Dharma Wanita",
      kegiatanPengujian: "witness",
      kotaSurat: "Bandung",
      tanggalSurat: "02 Juli 2025",
      namaDirektur: "Prof. Dr. Ija Suntana, M.Ag",
    };

    const res = await fetch("/api/surat/penugasanassessor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Gagal mendownload Surat Tugas");

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `Surat_Tugas_${payload.namaAsesor}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error(err);
  }
};

const handleDownloadSkPdf = async () => {
  try {
    setIsLoading(true);

    // Data payload (dapat diambil dari state tabel atau form input admin)
    const payload = {
      nomorSk: "001/SKKL/LSPP1UINSGD/XII/2025",
      tanggalPelaksanaan: "16-19 Desember 2025",
      tempatUji: "Kantor LSP P1 UIN Sunan Gunung Djati Bandung",
      lokasiDitetapkan: "Bandung",
      tanggalDitetapkan: "22 Desember 2025",
      namaDirektur: "Prof. Dr. H. Ija Suntana, M. Ag., CLA",
      asesiList: [
        {
          no: 1,
          nama: "Intan Tania",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 2,
          nama: "Anggita Firdayanti",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 3,
          nama: "Mila Fajariah",
          skema: "Auditor Halal",
          isKompeten: true,
        },
      ],
    };

    const response = await fetch("/api/surat/hasilsidangpleno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Gagal mendownload PDF");

    // Convert response stream menjadi blob file dan picu browser download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `SK_Hasil_Uji_Kompetensi_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error saat download SK:", error);
    alert("Terjadi kesalahan saat membuat dokumen PDF.");
  } finally {
    setIsLoading(false);
  }
};

const handleDownloadBerita = async () => {
  try {
    setIsLoading(true);

    // Data fallback jika tidak dipassing lewat props
    const payloadBeritaAcara = {
      tanggalPleno: "22 Desember tahun 2025",
      tanggalPelaksanaan: "16-19 Desember 2025",
      totalAsesi: 30,
      totalKompeten: 29,
      totalBelumKompeten: 1,
      kotaPleno: "Bandung",
      tanggalSurat: "22 Desember 2025",
      asesiList: [
        // Skema 1: Melaksanakan Komunikasi dengan Pemangku Kepentingan (11 Asesi)
        {
          no: 1,
          nama: "Intan Tania",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 2,
          nama: "Anggita Firdayanti",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 3,
          nama: "Hasna Zahra Annabilah",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 4,
          nama: "Ananda Anggunistiani",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 5,
          nama: "Nurul Hasanah",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 6,
          nama: "Anisa Sapitri",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 7,
          nama: "Nurul Aini",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 8,
          nama: "Puji Anggraeni",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 9,
          nama: "Ira Dian Nurmala",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 10,
          nama: "Sara Magdi Mamdouh Salama",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },
        {
          no: 11,
          nama: "Raisha Srikandi Sekartaji",
          skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
          isKompeten: true,
        },

        // Skema 2: Penerjemah Teks Umum (9 Asesi)
        {
          no: 12,
          nama: "Tri Ramadani",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },
        {
          no: 13,
          nama: "Intan Permata Sari",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },
        {
          no: 14,
          nama: "Zuvika Amoret Syarifatul Ainiyyah",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },
        {
          no: 15,
          nama: "Muhammad Aditia",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },
        {
          no: 16,
          nama: "Khadijah",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },
        {
          no: 17,
          nama: "Rr. Ririh Widowati",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },
        {
          no: 18,
          nama: "Khoerul Amin",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },
        {
          no: 19,
          nama: "Anwar Sudirja",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },
        {
          no: 20,
          nama: "Nur Irmandi",
          skema: "Penerjemah Teks Umum",
          isKompeten: true,
        },

        // Skema 3: Penyelia Halal (8 Asesi)
        {
          no: 21,
          nama: "Gisna Maulida Qurosyiyah",
          skema: "Penyelia Halal",
          isKompeten: true,
        },
        {
          no: 22,
          nama: "Irfan Muhammad Ihsanuddin",
          skema: "Penyelia Halal",
          isKompeten: true,
        },
        {
          no: 23,
          nama: "Annisa Hakim",
          skema: "Penyelia Halal",
          isKompeten: true,
        },
        {
          no: 24,
          nama: "Mayang Sri Rahayu",
          skema: "Penyelia Halal",
          isKompeten: true,
        },
        {
          no: 25,
          nama: "Hanny Aurelya",
          skema: "Penyelia Halal",
          isKompeten: true,
        },
        {
          no: 26,
          nama: "Zulfa Ayu Zahra",
          skema: "Penyelia Halal",
          isKompeten: true,
        },
        {
          no: 27,
          nama: "Falama Fauzia",
          skema: "Penyelia Halal",
          isKompeten: false,
        }, // Contoh asesi Belum Kompeten (BK)
        {
          no: 28,
          nama: "Milatul Afifah",
          skema: "Penyelia Halal",
          isKompeten: true,
        },

        // Skema 4: Auditor Halal (2 Asesi)
        {
          no: 29,
          nama: "Asep Andri",
          skema: "Auditor Halal",
          isKompeten: true,
        },
        {
          no: 30,
          nama: "Muhammad Algi Al Hanafi",
          skema: "Auditor Halal",
          isKompeten: true,
        },
      ],
      anggotaKomiteList: [
        { nama: "Prof. Dr. H. Ija Suntana, M. Ag., CLA" },
        { nama: "Ichsan Taufik, M.T." },
        { nama: "Dr. Elis Ratna Wulan, S. Si., MT" },
      ],
    };

    const res = await fetch("/api/surat/beritasidangpleno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadBeritaAcara),
    });

    if (!res.ok) {
      throw new Error("Gagal menghasilkan dokumen Berita Acara");
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `Berita_Acara_Pleno_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download error:", error);
    alert("Terjadi kesalahan saat mengunduh Berita Acara.");
  } finally {
    setIsLoading(false);
  }
};

const handleDownloadBlankoBnsp = async () => {
  try {
    setIsLoading(true);

    const payload = {
      kotaSurat: "Bandung",
      tanggalSurat: "22 Desember 2025",
      nomorSurat: "003/SP/LSPP1UINSGD/XII/2025",
      lampiran: "1 (Satu) berkas",
      tujuanYth: "Ketua Badan Nasional Sertifikasi Profesi (BNSP)",
      kotaTujuan: "Jakarta",
      jumlahPeserta: 44,
      kompetenBnsp: "-",
      kompetenKementerian: "-",
      kompetenMandiri: 43,
      kompetenRcc: "-",
      belumKompeten: 1,
      totalJumlah: 44,
      jumlahLembarBlanko: 43,
      terbilangLembarBlanko: "empat puluh tiga",
      namaKetua: "Prof. Dr. H. Ija Suntana, M. Ag., CLA",
    };

    const res = await fetch("/api/surat/blankobnsp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Gagal menghasilkan file PDF.");

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `Surat_Permohonan_Blanko_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat mengunduh surat permohonan blanko.");
  } finally {
    setIsLoading(false);
  }
};

const handleDownloadSertifikat = async () => {
  try {
    setIsLoading(true);

    const samplePayload = {
      nomorSertifikat: "70203 2432 0000000 2025",
      nomorRegistrasi: "HMS 001 00000 2025",
      namaPemegang: "Intan Tania",
      bidangId: "Kehumasan",
      bidangEn: "Public Relation",
      kualifikasiId:
        "Klaster Melaksanakan Komunikasi dengan Pemangku Kepentingan",
      kualifikasiEn: "Cluster Implementing Communication with Stakeholders",
      kotaTerbit: "Bandung",
      tanggalTerbitId: "22 Desember 2025",
      tanggalTerbitEn: "December 22, 2025",
      namaDirektur: "Prof. Dr. H. Ija Suntana, M.Ag., CLA.",
      namaManajerSertifikasi: "Ichsan Taufik, MT., CIQA",
      unitList: [
        {
          no: 1,
          kodeUnit: "M.70HMS00.031.3",
          judulUnitId: "Melaksanakan Media Relations",
          judulUnitEn: "Implementing Media Relations",
        },
        {
          no: 2,
          kodeUnit: "M.70HMS00.032.2",
          judulUnitId: "Melaksanakan Community Relations",
          judulUnitEn: "Implementing Community Relations",
        },
        {
          no: 3,
          kodeUnit: "M.70HMS00.033.3",
          judulUnitId: "Melaksanakan Corporate Social Responsibility (CSR)",
          judulUnitEn: "Implementing Corporate Social Responsibility (CSR)",
        },
        {
          no: 4,
          kodeUnit: "M.70HMS00.034.1",
          judulUnitId: "Melaksanakan Industrial Relations",
          judulUnitEn: "Implementing Industrial Relations",
        },
        {
          no: 5,
          kodeUnit: "M.70HMS00.035.3",
          judulUnitId: "Melaksanakan Government Relations",
          judulUnitEn: "Implementing Government Relations",
        },
        {
          no: 6,
          kodeUnit: "M.70HMS00.036.1",
          judulUnitId: "Melaksanakan Institusional Relations",
          judulUnitEn: "Implementing Institutional Relations",
        },
        {
          no: 7,
          kodeUnit: "M.70HMS00.037.3",
          judulUnitId: "Melaksanakan Internal Relations",
          judulUnitEn: "Implementing Internal Relations",
        },
        {
          no: 8,
          kodeUnit: "M.70HMS00.038.3",
          judulUnitId: "Melaksanakan Marketing Public Relations",
          judulUnitEn: "Implementing Marketing Public Relations",
        },
        {
          no: 9,
          kodeUnit: "M.70HMS00.039.1",
          judulUnitId: "Melaksanakan Customer Relations",
          judulUnitEn: "Implementing Customer Relations",
        },
        {
          no: 10,
          kodeUnit: "M.70HMS00.040.3",
          judulUnitId: "Melaksanakan Investor Relations",
          judulUnitEn: "Implementing Investor Relations",
        },
      ],
    };

    const res = await fetch("/api/surat/sertifikat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(samplePayload),
    });

    if (!res.ok) throw new Error("Gagal download sertifikat");

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `Sertifikat_${samplePayload.namaPemegang}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat mengunduh sertifikat.");
  } finally {
    setIsLoading(false);
  }
};
