package id.ac.uinsgd.lembaga_penjaminan_mutu.service;

import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.RegisterRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.entity.ProfilPengguna;
import id.ac.uinsgd.lembaga_penjaminan_mutu.entity.User;
import id.ac.uinsgd.lembaga_penjaminan_mutu.repository.ProfilPenggunaRepository;
import id.ac.uinsgd.lembaga_penjaminan_mutu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfilPenggunaRepository profilPenggunaRepository;

    @Transactional
    public String registerUser(RegisterRequest request) {
        
        // 1. Validasi Pengecekan Data Ganda
        if (userRepository.existsByUsername(request.getUsername())) {
            return "Gagal: Username sudah digunakan!";
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Gagal: Email sudah terdaftar!";
        }
        if (profilPenggunaRepository.existsByNik(request.getNik())) {
            return "Gagal: NIK sudah pernah didaftarkan!";
        }

        // 2. Simpan Data Akun 
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); 
        user.setRole(request.getRole());
        user.setIsVerified(false);
        
        User savedUser = userRepository.save(user);

        // 3. Simpan Biodata Awal 
        ProfilPengguna profil = new ProfilPengguna();
        profil.setUser(savedUser); 
        profil.setNik(request.getNik());
        profil.setNamaLengkap(request.getNamaLengkap());
        
        profilPenggunaRepository.save(profil);

        return "Sukses: Registrasi berhasil!";
    }
}