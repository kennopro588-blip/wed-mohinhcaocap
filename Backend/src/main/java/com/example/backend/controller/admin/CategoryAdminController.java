package com.example.backend.controller.admin;

import com.example.backend.entity.Category;
import com.example.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
public class CategoryAdminController {

    @Autowired
    private CategoryService categoryService;

    /** GET /api/admin/categories - Lấy tất cả danh mục */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "total", categories.size(),
            "data", categories
        ));
    }

    /** GET /api/admin/categories/{id} - Chi tiết danh mục */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCategoryById(@PathVariable String id) {
        return categoryService.getCategoryById(id)
            .map(c -> ResponseEntity.ok(Map.<String, Object>of("status", "success", "data", c)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy danh mục với id: " + id
            )));
    }

    /** POST /api/admin/categories - Tạo danh mục mới */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCategory(@RequestBody Category category) {
        Category saved = categoryService.createCategory(category);
        return ResponseEntity.status(201).body(Map.of(
            "status", "success",
            "message", "Tạo danh mục thành công",
            "data", saved
        ));
    }

    /** PUT /api/admin/categories/{id} - Cập nhật danh mục */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCategory(@PathVariable String id,
                                                               @RequestBody Category category) {
        return categoryService.updateCategory(id, category)
            .map(updated -> ResponseEntity.ok(Map.<String, Object>of(
                "status", "success",
                "message", "Cập nhật danh mục thành công",
                "data", updated
            )))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy danh mục với id: " + id
            )));
    }

    /** DELETE /api/admin/categories/{id} - Xóa danh mục */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable String id) {
        if (categoryService.deleteCategory(id)) {
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Xóa danh mục thành công"
            ));
        }
        return ResponseEntity.status(404).body(Map.of(
            "status", "error",
            "message", "Không tìm thấy danh mục với id: " + id
        ));
    }
}
