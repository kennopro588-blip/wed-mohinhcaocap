package com.example.backend.controller.admin;

import com.example.backend.entity.Product;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
public class ProductAdminController {

    @Autowired
    private ProductService productService;

    /** GET /api/admin/products - Lấy tất cả sản phẩm (admin) */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Danh sách quản lý sản phẩm",
            "total", products.size(),
            "data", products
        ));
    }

    /** GET /api/admin/products/{id} - Lấy chi tiết sản phẩm */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
            .map(p -> ResponseEntity.ok(Map.<String, Object>of("status", "success", "data", p)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy sản phẩm với id: " + id
            )));
    }

    /** POST /api/admin/products - Tạo sản phẩm mới */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Product product) {
        Product saved = productService.createProduct(product);
        return ResponseEntity.status(201).body(Map.of(
            "status", "success",
            "message", "Tạo sản phẩm thành công",
            "data", saved
        ));
    }

    /** PUT /api/admin/products/{id} - Cập nhật sản phẩm */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable String id,
                                                              @RequestBody Product product) {
        return productService.updateProduct(id, product)
            .map(updated -> ResponseEntity.ok(Map.<String, Object>of(
                "status", "success",
                "message", "Cập nhật sản phẩm thành công",
                "data", updated
            )))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy sản phẩm với id: " + id
            )));
    }

    /** DELETE /api/admin/products/{id} - Xóa sản phẩm */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable String id) {
        if (productService.deleteProduct(id)) {
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Xóa sản phẩm thành công"
            ));
        }
        return ResponseEntity.status(404).body(Map.of(
            "status", "error",
            "message", "Không tìm thấy sản phẩm với id: " + id
        ));
    }
}
