package id.ac.uinsgd.lembaga_penjaminan_mutu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "profil_pengguna")
public class ProfilPengguna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Relasi One-to-One: Menyambungkan profil ini ke User
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(unique = true, nullable = false, length = 16)
    private String nik;

    @Column(name = "nama_lengkap", nullable = false)
    private String namaLengkap;

    private String kebangsaan = "WNI";

    @Column(name = "tempat_lahir")
    private String tempatLahir;

    @Column(name = "tanggal_lahir")
    private LocalDate tanggalLahir;

    @Column(name = "jenis_kelamin")
    private String jenisKelamin;

    @Column(name = "no_hp")
    private String noHp;

    @Column(name = "pendidikan_terakhir")
    private String pendidikanTerakhir;

    private String pekerjaan;
    private String alamat;

    @Column(name = "alamat_wilayah")
    private String alamatWilayah;

    @Column(name = "kode_pos")
    private String kodePos;

    @Column(name = "tanda_tangan", columnDefinition = "TEXT")
    private String tandaTangan;

    public String getKebangsaan() {
        return kebangsaan;
    }

    public void setKebangsaan(String kebangsaan) {
        this.kebangsaan = kebangsaan;
    }
    
    // (Tambahan khusus Asesor)
    @Column(name = "kode_lsp")
    private String kodeLsp;

    public Integer getId() {
      return id;
    }

    public void setId(Integer id) {
      this.id = id;
    }

    public User getUser() {
      return user;
    }

    public void setUser(User user) {
      this.user = user;
    }

    public String getNik() {
      return nik;
    }

    public void setNik(String nik) {
      this.nik = nik;
    }

    public String getNamaLengkap() {
      return namaLengkap;
    }

    public void setNamaLengkap(String namaLengkap) {
      this.namaLengkap = namaLengkap;
    }

    public String getTempatLahir() {
      return tempatLahir;
    }

    public void setTempatLahir(String tempatLahir) {
      this.tempatLahir = tempatLahir;
    }

    public LocalDate getTanggalLahir() {
      return tanggalLahir;
    }

    public void setTanggalLahir(LocalDate tanggalLahir) {
      this.tanggalLahir = tanggalLahir;
    }

    public String getJenisKelamin() {
      return jenisKelamin;
    }

    public void setJenisKelamin(String jenisKelamin) {
      this.jenisKelamin = jenisKelamin;
    }

    public String getNoHp() {
      return noHp;
    }

    public void setNoHp(String noHp) {
      this.noHp = noHp;
    }

    public String getPendidikanTerakhir() {
      return pendidikanTerakhir;
    }

    public void setPendidikanTerakhir(String pendidikanTerakhir) {
      this.pendidikanTerakhir = pendidikanTerakhir;
    }

    public String getPekerjaan() {
      return pekerjaan;
    }

    public void setPekerjaan(String pekerjaan) {
      this.pekerjaan = pekerjaan;
    }

    public String getAlamat() {
      return alamat;
    }

    public void setAlamat(String alamat) {
      this.alamat = alamat;
    }

    public String getAlamatWilayah() {
      return alamatWilayah;
    }

    public void setAlamatWilayah(String alamatWilayah) {
      this.alamatWilayah = alamatWilayah;
    }

    public String getKodePos() {
      return kodePos;
    }

    public void setKodePos(String kodePos) {
      this.kodePos = kodePos;
    }

    public String getTandaTangan() {
      return tandaTangan;
    }

    public void setTandaTangan(String tandaTangan) {
      this.tandaTangan = tandaTangan;
    }

    public String getKodeLsp() {
      return kodeLsp;
    }

    public void setKodeLsp(String kodeLsp) {
      this.kodeLsp = kodeLsp;
    }

    public String getNamaLsp() {
      return namaLsp;
    }

    public void setNamaLsp(String namaLsp) {
      this.namaLsp = namaLsp;
    }

    @Column(name = "nama_lsp")
    private String namaLsp;

}