package com.example.backend.service;

import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    /** Lấy tất cả sản phẩm */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /** Lấy sản phẩm theo ID */
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    /** Lấy sản phẩm theo category */
    public List<Product> getProductsByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    /** Lấy sản phẩm nổi bật */
    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue();
    }

    /** Lấy sản phẩm mới */
    public List<Product> getNewProducts() {
        return productRepository.findByIsNewTrue();
    }

    /** Tạo sản phẩm mới */
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    /** Cập nhật sản phẩm (Null-safe partial update) */
    public Optional<Product> updateProduct(String id, Product updated) {
        return productRepository.findById(id).map(existing -> {
            if (updated.getName() != null) existing.setName(updated.getName());
            if (updated.getBrand() != null) existing.setBrand(updated.getBrand());
            if (updated.getPrice() != null) existing.setPrice(updated.getPrice());
            if (updated.getOriginalPrice() != null) existing.setOriginalPrice(updated.getOriginalPrice());
            if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
            if (updated.getCategoryId() != null) existing.setCategoryId(updated.getCategoryId());
            if (updated.getSubcategory() != null) existing.setSubcategory(updated.getSubcategory());
            if (updated.getScaleRatio() != null) existing.setScaleRatio(updated.getScaleRatio());
            if (updated.getManufacturer() != null) existing.setManufacturer(updated.getManufacturer());
            if (updated.getMaterial() != null) existing.setMaterial(updated.getMaterial());
            if (updated.getRating() != null) existing.setRating(updated.getRating());
            if (updated.getReviewCount() != null) existing.setReviewCount(updated.getReviewCount());
            if (updated.getIsNew() != null) existing.setIsNew(updated.getIsNew());
            if (updated.getIsSale() != null) existing.setIsSale(updated.getIsSale());
            if (updated.getIsFeatured() != null) existing.setIsFeatured(updated.getIsFeatured());
            if (updated.getInStock() != null) existing.setInStock(updated.getInStock());
            if (updated.getStockCount() != null) existing.setStockCount(updated.getStockCount());
            if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl());
            return productRepository.save(existing);
        });
    }

    /** Xóa sản phẩm */
    public boolean deleteProduct(String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
