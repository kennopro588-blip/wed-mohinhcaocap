package com.example.backend.controller.admin;

import com.example.backend.entity.Employee;
import com.example.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/employees")
public class EmployeeAdminController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        if (employee.getId() == null || employee.getId().isBlank()) {
            employee.setId("NV" + String.format("%03d", employeeRepository.count() + 1));
        }
        if (employee.getStatus() == null) employee.setStatus("ACTIVE");
        if (employee.getBaseSalary() == null) employee.setBaseSalary(new BigDecimal("8500000"));
        if (employee.getWorkDays() == null) employee.setWorkDays(26);
        if (employee.getCommissionRate() == null) employee.setCommissionRate(new BigDecimal("1.50"));
        if (employee.getAllowance() == null) employee.setAllowance(new BigDecimal("1000000"));
        if (employee.getBonus() == null) employee.setBonus(new BigDecimal("1000000"));
        if (employee.getDeduction() == null) employee.setDeduction(BigDecimal.ZERO);

        Employee saved = employeeRepository.save(employee);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable String id, @RequestBody Employee details) {
        Optional<Employee> opt = employeeRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Employee emp = opt.get();
        if (details.getName() != null) emp.setName(details.getName());
        if (details.getPhone() != null) emp.setPhone(details.getPhone());
        if (details.getEmail() != null) emp.setEmail(details.getEmail());
        if (details.getPosition() != null) emp.setPosition(details.getPosition());
        if (details.getShift() != null) emp.setShift(details.getShift());
        if (details.getBaseSalary() != null) emp.setBaseSalary(details.getBaseSalary());
        if (details.getWorkDays() != null) emp.setWorkDays(details.getWorkDays());
        if (details.getCommissionRate() != null) emp.setCommissionRate(details.getCommissionRate());
        if (details.getSalesRevenue() != null) emp.setSalesRevenue(details.getSalesRevenue());
        if (details.getAllowance() != null) emp.setAllowance(details.getAllowance());
        if (details.getBonus() != null) emp.setBonus(details.getBonus());
        if (details.getDeduction() != null) emp.setDeduction(details.getDeduction());
        if (details.getStatus() != null) emp.setStatus(details.getStatus());

        return ResponseEntity.ok(employeeRepository.save(emp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        if (!employeeRepository.existsById(id)) return ResponseEntity.notFound().build();
        employeeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
