package com.example.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:luxemodels.store@gmail.com}")
    private String fromEmail;

    /**
     * Gửi email OTP xác thực thật đến Gmail của người dùng
     */
    public boolean sendOtpEmail(String toEmail, String otpCode) {
        if (mailSender == null) {
            System.out.println("⚠️ JavaMailSender chưa được cấu hình. Mã OTP cho [" + toEmail + "] là: " + otpCode);
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "LUXE Models - Khôi Phục Mật Khẩu");
            helper.setTo(toEmail);
            helper.setSubject("[LUXE MODELS] Mã xác thực OTP khôi phục mật khẩu của bạn");

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #30363d;\">"
                + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                + "<h1 style=\"color: #d97706; margin: 0; font-size: 28px;\">◆ LUXE MODELS ◆</h1>"
                + "<p style=\"color: #8b949e; font-size: 14px;\">Thánh Địa Mô Hình Cao Cấp</p>"
                + "</div>"
                + "<hr style=\"border: none; border-top: 1px solid #30363d; margin: 20px 0;\" />"
                + "<h2 style=\"color: #ffffff; font-size: 20px; text-align: center;\">Mã Xác Thực Khôi Phục Mật Khẩu</h2>"
                + "<p style=\"color: #c9d1d9; font-size: 15px; line-height: 1.6;\">Chào bạn,</p>"
                + "<p style=\"color: #c9d1d9; font-size: 15px; line-height: 1.6;\">Bạn vừa gửi yêu cầu đặt lại mật khẩu cho tài khoản <strong>" + toEmail + "</strong>. Vui lòng nhập mã xác thực OTP 6 chữ số dưới đây để tiến hành đổi mật khẩu mới:</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<span style=\"display: inline-block; background: linear-gradient(135deg, #d97706, #b45309); color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 15px 35px; borderRadius: 8px; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4);\">" + otpCode + "</span>"
                + "</div>"
                + "<p style=\"color: #8b949e; font-size: 13px; text-align: center;\">Mã OTP có hiệu lực trong vòng 10 phút. Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email.</p>"
                + "<hr style=\"border: none; border-top: 1px solid #30363d; margin: 25px 0;\" />"
                + "<p style=\"color: #8b949e; font-size: 12px; text-align: center; margin: 0;\">© 2026 LUXE Models. All rights reserved.</p>"
                + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✅ Đã gửi Email OTP thật thành công đến: " + toEmail);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi gửi Email OTP đến [" + toEmail + "]: " + e.getMessage());
            return false;
        }
    }
}
