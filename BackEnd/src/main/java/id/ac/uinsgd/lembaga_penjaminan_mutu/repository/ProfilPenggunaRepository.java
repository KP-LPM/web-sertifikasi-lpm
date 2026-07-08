package id.ac.uinsgd.lembaga_penjaminan_mutu.repository;

import id.ac.uinsgd.lembaga_penjaminan_mutu.entity.ProfilPengguna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfilPenggunaRepository extends JpaRepository<ProfilPengguna, Integer> {
    
    // Mencari data profil berdasarkan ID dari tabel users
    Optional<ProfilPengguna> findByUserId(Integer userId);
    
    // Mencari profil berdasarkan NIK untuk validasi
    Optional<ProfilPengguna> findByNik(String nik);
    
    // Mengecek apakah NIK sudah pernah didaftarkan sebelumnya
    boolean existsByNik(String nik);
}