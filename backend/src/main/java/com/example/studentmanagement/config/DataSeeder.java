package com.example.studentmanagement.config;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final StudentRepository studentRepository;

    public DataSeeder(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        if (studentRepository.count() == 0) {
            log.info("Seeding initial student records for demonstration...");

            List<Student> initialStudents = Arrays.asList(
                new Student("Aarav Sharma", "CS2024-001", "Computer Science", 92.5),
                new Student("Priya Patel", "CS2024-002", "Computer Science", 84.0),
                new Student("Rohan Verma", "IT2024-015", "Information Technology", 76.5),
                new Student("Ananya Iyer", "EC2024-042", "Electronics & Communication", 89.0),
                new Student("Vikram Singh", "ME2024-008", "Mechanical Engineering", 68.0),
                new Student("Sneha Kulkarni", "CV2024-023", "Civil Engineering", 95.0),
                new Student("Devansh Gupta", "EE2024-019", "Electrical Engineering", 38.0) // Sample student to demonstrate FAIL status
            );

            studentRepository.saveAll(initialStudents);
            log.info("Successfully seeded {} student records.", initialStudents.size());
        } else {
            log.info("Database already contains {} student records. Skipping seeding.", studentRepository.count());
        }
    }
}
