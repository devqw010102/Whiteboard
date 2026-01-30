package org.example.backend;

import org.example.backend.entity.PostIt;
import org.example.backend.repository.PostItRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(PostItRepository repository) {
        return args -> {
            repository.save(PostIt.builder().content("첫 번째 메모").x(100).y(100).color("#FFEB3B").build());
            repository.save(PostIt.builder().content("두 번째 메모").x(300).y(150).color("#FFCCBC").build());
        };
    }
}
