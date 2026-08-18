package com.example.backend.controller.user;

import com.example.backend.entity.Order;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/orders")
public class OrderUserController {

    @Autowired
    private OrderService orderService;

    /** GET /api/user/orders/user/{userId} - Lấy đơn hàng theo userId */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "total", orders.size(),
            "data", orders
        ));
    }

    /** GET /api/user/orders/code/{orderCode} - Tra cứu đơn hàng theo mã */
    @GetMapping("/code/{orderCode}")
    public ResponseEntity<Map<String, Object>> getOrderByCode(@PathVariable String orderCode) {
        return orderService.getOrderByCode(orderCode)
            .map(o -> ResponseEntity.ok(Map.<String, Object>of("status", "success", "data", o)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy đơn hàng với mã: " + orderCode
            )));
    }

    /** POST /api/user/orders - Đặt hàng mới */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Order order) {
        Order saved = orderService.createOrder(order);
        return ResponseEntity.status(201).body(Map.of(
            "status", "success",
            "message", "Đặt hàng thành công",
            "data", saved
        ));
    }
}
