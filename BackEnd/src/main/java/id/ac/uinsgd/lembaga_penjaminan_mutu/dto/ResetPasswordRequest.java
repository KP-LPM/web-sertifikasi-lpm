package id.ac.uinsgd.lembaga_penjaminan_mutu.dto;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
}