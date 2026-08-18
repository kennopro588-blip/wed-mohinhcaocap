package com.example.backend.repository;

import com.example.backend.entity.UserVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserVoucherRepository extends JpaRepository<UserVoucher, Long> {
    List<UserVoucher> findByUserIdAndIsUsedFalse(Long userId);
    boolean existsByUserIdAndCode(Long userId, String code);
}
