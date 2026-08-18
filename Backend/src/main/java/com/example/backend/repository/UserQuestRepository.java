package com.example.backend.repository;

import com.example.backend.entity.UserQuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserQuestRepository extends JpaRepository<UserQuest, String> {
}
