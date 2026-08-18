package com.example.backend.controller.admin;

import com.example.backend.entity.Order;
import com.example.backend.entity.Product;
import com.example.backend.service.OrderService;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardAdminController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    /** GET /api/admin/dashboard - Thống kê tổng quan cho Admin Dashboard */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<Order> orders = orderService.getAllOrders();
        List<Product> products = productService.getAllProducts();
        int totalUsers = userService.getAllUsers().size();

        BigDecimal totalRevenue = orders.stream()
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingOrdersCount = orders.stream()
            .filter(o -> "Pending".equalsIgnoreCase(o.getStatus()) || "Processing".equalsIgnoreCase(o.getStatus()))
            .count();

        List<Product> lowStockProducts = products.stream()
            .filter(p -> p.getStockCount() != null && p.getStockCount() <= 5)
            .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", orders.size());
        stats.put("pendingOrders", pendingOrdersCount);
        stats.put("totalProducts", products.size());
        stats.put("totalUsers", totalUsers);
        stats.put("lowStockCount", lowStockProducts.size());

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", stats,
            "recentOrders", orders.stream().limit(5).collect(Collectors.toList()),
            "lowStockProducts", lowStockProducts
        ));
    }
}
