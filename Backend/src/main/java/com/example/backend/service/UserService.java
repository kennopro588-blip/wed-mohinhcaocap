package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /** Lấy tất cả người dùng */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /** Lấy người dùng theo ID */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /** Lấy người dùng theo email */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /** Kiểm tra email đã tồn tại chưa */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /** Xác thực đăng nhập (Email & Password) */
    public Optional<User> authenticate(String email, String password) {
        return userRepository.findByEmail(email)
            .filter(u -> u.getPassword() != null && u.getPassword().equals(password));
    }

    /** Tạo người dùng mới */
    public User createUser(User user) {
        if (emailExists(user.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    /** Đổi mật khẩu theo Email (Quên mật khẩu) */
    public boolean resetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    /** Cập nhật người dùng */
    public Optional<User> updateUser(Long id, User updated) {
        return userRepository.findById(id).map(existing -> {
            if (updated.getName() != null) existing.setName(updated.getName());
            if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
            if (updated.getRole() != null) existing.setRole(updated.getRole());
            if (updated.getAvatar() != null) existing.setAvatar(updated.getAvatar());
            if (updated.getMemberSince() != null) existing.setMemberSince(updated.getMemberSince());
            if (updated.getPassword() != null) existing.setPassword(updated.getPassword());
            return userRepository.save(existing);
        });
    }

    /** Xóa người dùng */
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
