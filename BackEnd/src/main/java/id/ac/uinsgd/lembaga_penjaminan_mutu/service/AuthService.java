package id.ac.uinsgd.lembaga_penjaminan_mutu.service;

import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.LoginRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.RegisterRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.entity.ProfilPengguna;
import id.ac.uinsgd.lembaga_penjaminan_mutu.entity.User;
import id.ac.uinsgd.lembaga_penjaminan_mutu.repository.ProfilPenggunaRepository;
import id.ac.uinsgd.lembaga_penjaminan_mutu.repository.UserRepository;
import id.ac.uinsgd.lembaga_penjaminan_mutu.security.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfilPenggunaRepository profilPenggunaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

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
        user.setPassword(passwordEncoder.encode(request.getPassword()));
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

    public String loginUser(LoginRequest request) {
        var userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Gagal: Email tidak terdaftar!");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Gagal: Password salah!");
        }

        return jwtUtils.generateJwtToken(user.getEmail(), user.getRole());
    }
}