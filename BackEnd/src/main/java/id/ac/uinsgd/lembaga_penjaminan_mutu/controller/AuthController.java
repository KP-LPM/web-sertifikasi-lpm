package id.ac.uinsgd.lembaga_penjaminan_mutu.controller;

import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.JwtResponse;
import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.LoginRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.dto.RegisterRequest;
import id.ac.uinsgd.lembaga_penjaminan_mutu.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private AuthService authService;

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
}


