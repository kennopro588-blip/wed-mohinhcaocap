package com.example.backend.controller.user;

import com.example.backend.entity.Review;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/reviews")
public class ReviewUserController {

    @Autowired
    private ReviewService reviewService;

    /** GET /api/user/reviews/product/{productId} - Lấy danh sách đánh giá của sản phẩm */
    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getReviewsByProduct(@PathVariable String productId) {
        List<Review> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "total", reviews.size(),
            "data", reviews
        ));
    }

    /** POST /api/user/reviews - Gửi đánh giá mới cho sản phẩm */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createReview(@RequestBody Review review) {
        if (review.getProductId() == null || review.getUserName() == null || review.getComment() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Vui lòng nhập đầy đủ thông tin đánh giá"
            ));
        }

        Review saved = reviewService.createReview(review);
        return ResponseEntity.status(201).body(Map.of(
            "status", "success",
            "message", "Cảm ơn bạn đã gửi đánh giá!",
            "data", saved
        ));
    }
}
