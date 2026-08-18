package com.example.backend.controller.user;

import com.example.backend.entity.Product;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/products")
public class ProductUserController {

    @Autowired
    private ProductService productService;

    /** GET /api/user/products - Lấy tất cả sản phẩm */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Danh sách sản phẩm",
            "total", products.size(),
            "data", products
        ));
    }

    /** GET /api/user/products/{id} - Lấy sản phẩm theo ID */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
            .map(p -> ResponseEntity.ok(Map.<String, Object>of("status", "success", "data", p)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy sản phẩm với id: " + id
            )));
    }

    /** GET /api/user/products/category/{categoryId} - Lấy sản phẩm theo danh mục */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, Object>> getProductsByCategory(@PathVariable String categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "category", categoryId,
            "total", products.size(),
            "data", products
        ));
    }

    /** GET /api/user/products/featured - Lấy sản phẩm nổi bật */
    @GetMapping("/featured")
    public ResponseEntity<Map<String, Object>> getFeaturedProducts() {
        List<Product> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Sản phẩm nổi bật",
            "total", products.size(),
            "data", products
        ));
    }

    /** GET /api/user/products/new - Lấy sản phẩm mới */
    @GetMapping("/new")
    public ResponseEntity<Map<String, Object>> getNewProducts() {
        List<Product> products = productService.getNewProducts();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Sản phẩm mới",
            "total", products.size(),
            "data", products
        ));
    }
}
