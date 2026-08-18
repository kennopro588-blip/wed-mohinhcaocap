package com.example.backend.service;

import com.example.backend.entity.Category;
import com.example.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /** Lấy tất cả danh mục */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /** Lấy danh mục theo ID */
    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    /** Lấy danh mục theo slug */
    public Optional<Category> getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    /** Tạo danh mục mới */
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    /** Cập nhật danh mục */
    public Optional<Category> updateCategory(String id, Category updated) {
        return categoryRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setSlug(updated.getSlug());
            existing.setDescription(updated.getDescription());
            existing.setItemCount(updated.getItemCount());
            existing.setGradient(updated.getGradient());
            return categoryRepository.save(existing);
        });
    }

    /** Xóa danh mục */
    public boolean deleteCategory(String id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
