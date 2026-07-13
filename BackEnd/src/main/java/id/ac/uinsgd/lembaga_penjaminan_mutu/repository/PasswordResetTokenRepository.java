package id.ac.uinsgd.lembaga_penjaminan_mutu.repository;

import id.ac.uinsgd.lembaga_penjaminan_mutu.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
}