package id.ac.uinsgd.lembaga_penjaminan_mutu.controller;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.ForgotPasswordRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.JwtResponse;
import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.LoginRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.RegisterRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.ResetPasswordRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.entity.PasswordResetToken;
import id.ac.uinsgd.lembaga_penjaminan_mutu.entity.User;
import id.ac.uinsgd.lembaga_penjaminan_mutu.repository.PasswordResetTokenRepository;
import id.ac.uinsgd.lembaga_penjaminan_mutu.repository.UserRepository;
import id.ac.uinsgd.lembaga_penjaminan_mutu.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String result = authService.registerUser(request);
        
        if (result.startsWith("Gagal")) {
            return ResponseEntity.badRequest().body(result);
        }
        
        return ResponseEntity.ok(result);
    }
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            String jwt = authService.loginUser(loginRequest); 
            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email tidak ditemukan!");
        }

        User user = userOptional.get();

        // Generate Token Acak
        String token = UUID.randomUUID().toString();

        // Simpan ke database dengan masa berlaku 1 jam
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        // Kirim Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Reset Password - Web Sertifikasi LPM");
        message.setText("Gunakan token berikut untuk mereset password Anda:\n" + token);
        
        mailSender.send(message);

        return ResponseEntity.ok("Link reset password telah dikirim ke email Anda.");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(request.getToken());

        if (tokenOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Token tidak valid!");
        }

        PasswordResetToken resetToken = tokenOptional.get();

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body("Error: Token sudah kedaluwarsa!");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Password berhasil diubah. Silakan login dengan password baru.");
    }
}


