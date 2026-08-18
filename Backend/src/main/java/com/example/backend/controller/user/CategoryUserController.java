package com.example.backend.controller.user;

import com.example.backend.entity.Category;
import com.example.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/categories")
public class CategoryUserController {

    @Autowired
    private CategoryService categoryService;

    /** GET /api/user/categories - Lấy tất cả danh mục */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "total", categories.size(),
            "data", categories
        ));
    }

    /** GET /api/user/categories/{id} - Lấy danh mục theo ID */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCategoryById(@PathVariable String id) {
        return categoryService.getCategoryById(id)
            .map(c -> ResponseEntity.ok(Map.<String, Object>of("status", "success", "data", c)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy danh mục với id: " + id
            )));
    }

    /** GET /api/user/categories/slug/{slug} - Lấy danh mục theo slug */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Map<String, Object>> getCategoryBySlug(@PathVariable String slug) {
        return categoryService.getCategoryBySlug(slug)
            .map(c -> ResponseEntity.ok(Map.<String, Object>of("status", "success", "data", c)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy danh mục với slug: " + slug
            )));
    }
}
