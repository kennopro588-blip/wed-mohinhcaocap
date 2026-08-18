package com.example.backend.controller.admin;

import com.example.backend.entity.Order;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
public class OrderAdminController {

    @Autowired
    private OrderService orderService;

    /** GET /api/admin/orders - Lấy tất cả đơn hàng */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "total", orders.size(),
            "data", orders
        ));
    }

    /** GET /api/admin/orders/{id} - Chi tiết đơn hàng */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
            .map(o -> ResponseEntity.ok(Map.<String, Object>of("status", "success", "data", o)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy đơn hàng với id: " + id
            )));
    }

    /** PATCH /api/admin/orders/{id}/status - Cập nhật trạng thái đơn hàng */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(@PathVariable Long id,
                                                                  @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return orderService.updateOrderStatus(id, status)
            .map(updated -> ResponseEntity.ok(Map.<String, Object>of(
                "status", "success",
                "message", "Cập nhật trạng thái thành công",
                "data", updated
            )))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy đơn hàng với id: " + id
            )));
    }

    /** PUT /api/admin/orders/{id} - Cập nhật toàn bộ đơn hàng */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateOrder(@PathVariable Long id,
                                                            @RequestBody Order order) {
        return orderService.updateOrder(id, order)
            .map(updated -> ResponseEntity.ok(Map.<String, Object>of(
                "status", "success",
                "message", "Cập nhật đơn hàng thành công",
                "data", updated
            )))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "status", "error",
                "message", "Không tìm thấy đơn hàng với id: " + id
            )));
    }

    /** DELETE /api/admin/orders/{id} - Xóa đơn hàng */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteOrder(@PathVariable Long id) {
        if (orderService.deleteOrder(id)) {
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Xóa đơn hàng thành công"
            ));
        }
        return ResponseEntity.status(404).body(Map.of(
            "status", "error",
            "message", "Không tìm thấy đơn hàng với id: " + id
        ));
    }
}
