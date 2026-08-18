package com.example.backend.service;

import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    /** Lấy tất cả đơn hàng */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /** Lấy đơn hàng theo ID */
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    /** Lấy đơn hàng theo mã order code */
    public Optional<Order> getOrderByCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode);
    }

    /** Lấy đơn hàng theo user */
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    /** Tạo đơn hàng mới */
    public Order createOrder(Order order) {
        if (order.getItems() != null) {
            for (com.example.backend.entity.OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        if (order.getOrderCode() == null || order.getOrderCode().trim().isEmpty()) {
            order.setOrderCode("LX-" + (System.currentTimeMillis() % 1000000));
        }
        if (order.getStatus() == null) {
            order.setStatus("Pending");
        }
        return orderRepository.save(order);
    }

    /** Cập nhật trạng thái đơn hàng */
    public Optional<Order> updateOrderStatus(Long id, String status) {
        return orderRepository.findById(id).map(existing -> {
            existing.setStatus(status);
            return orderRepository.save(existing);
        });
    }

    /** Cập nhật toàn bộ đơn hàng */
    public Optional<Order> updateOrder(Long id, Order updated) {
        return orderRepository.findById(id).map(existing -> {
            existing.setFullName(updated.getFullName());
            existing.setPhone(updated.getPhone());
            existing.setEmail(updated.getEmail());
            existing.setAddress(updated.getAddress());
            existing.setCity(updated.getCity());
            existing.setDistrict(updated.getDistrict());
            existing.setPaymentMethod(updated.getPaymentMethod());
            existing.setTotalAmount(updated.getTotalAmount());
            existing.setStatus(updated.getStatus());
            return orderRepository.save(existing);
        });
    }

    /** Xóa đơn hàng */
    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
