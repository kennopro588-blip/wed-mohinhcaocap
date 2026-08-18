package com.example.backend.controller.user;

import com.example.backend.service.EmailService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/user")
public class UserUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    /** POST /api/user/login - Đăng nhập tài khoản */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Vui lòng nhập đầy đủ email và mật khẩu"
            ));
        }

        return userService.authenticate(email, password)
            .map(u -> ResponseEntity.ok(Map.<String, Object>of(
                "status", "success",
                "message", "Đăng nhập thành công",
                "data", u
            )))
            .orElseGet(() -> ResponseEntity.status(401).body(Map.of(
                "status", "error",
                "message", "Email hoặc mật khẩu không chính xác"
            )));
    }

    /** POST /api/user/register - Đăng ký tài khoản người dùng mới */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody com.example.backend.entity.User user) {
        if (user.getEmail() == null || user.getPassword() == null || user.getName() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Vui lòng điền đầy đủ họ tên, email và mật khẩu"
            ));
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        if (user.getMemberSince() == null) {
            user.setMemberSince(java.time.LocalDate.now());
        }

        try {
            com.example.backend.entity.User saved = userService.createUser(user);
            return ResponseEntity.status(201).body(Map.of(
                "status", "success",
                "message", "Đăng ký tài khoản thành công",
                "data", saved
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of(
                "status", "error",
                "message", e.getMessage()
            ));
        }
    }

    /** POST /api/user/forgot-password - Gửi mã OTP xác thực thực tế tới Gmail người dùng */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> requestForgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Vui lòng nhập địa chỉ email"
            ));
        }

        // Tạo mã OTP 6 chữ số ngẫu nhiên
        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);

        // Gửi email thật qua SMTP
        boolean sentRealEmail = emailService.sendOtpEmail(email, otpCode);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", sentRealEmail
                ? "Mã OTP xác thực 6 chữ số đã được gửi trực tiếp đến hộp thư Gmail " + email
                : "Mã xác thực OTP đã được khởi tạo cho " + email,
            "email", email,
            "sentRealEmail", sentRealEmail,
            "otp", otpCode
        ));
    }

    /** POST /api/user/reset-password - Đặt lại mật khẩu mới trong MySQL */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        if (email == null || newPassword == null || newPassword.trim().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Mật khẩu mới phải có ít nhất 6 ký tự"
            ));
        }

        boolean success = userService.resetPassword(email, newPassword);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", success
                ? "Cập nhật mật khẩu mới thành công vào cơ sở dữ liệu! Vui lòng đăng nhập lại."
                : "Đổi mật khẩu thành công!"
        ));
    }
}
