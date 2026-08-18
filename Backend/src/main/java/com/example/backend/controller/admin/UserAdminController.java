package com.example.backend.controller.admin;

import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class UserAdminController {

    @Autowired
    private UserService userService;

    /** GET /api/admin/users - Lấy tất cả người dùng */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "total", users.size(),
            "data", users
        ));
    }

    /** GET /api/admin/users/{id} - Chi tiết người dùng */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(u -> ResponseEntity.ok(Map.<String, Object>of("status", "success", "data", u)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy người dùng với id: " + id
            )));
    }

    /** POST /api/admin/users - Tạo người dùng mới */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        try {
            User saved = userService.createUser(user);
            return ResponseEntity.status(201).body(Map.of(
                "status", "success",
                "message", "Tạo người dùng thành công",
                "data", saved
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of(
                "status", "error",
                "message", e.getMessage()
            ));
        }
    }

    /** PUT /api/admin/users/{id} - Cập nhật người dùng */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id,
                                                           @RequestBody User user) {
        return userService.updateUser(id, user)
            .map(updated -> ResponseEntity.ok(Map.<String, Object>of(
                "status", "success",
                "message", "Cập nhật người dùng thành công",
                "data", updated
            )))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy người dùng với id: " + id
            )));
    }

    /** DELETE /api/admin/users/{id} - Xóa người dùng */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Xóa người dùng thành công"
            ));
        }
        return ResponseEntity.status(404).body(Map.of(
            "status", "error",
            "message", "Không tìm thấy người dùng với id: " + id
        ));
    }
}
