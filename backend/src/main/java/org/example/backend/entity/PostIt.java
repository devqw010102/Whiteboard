package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostIt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content; // 내용

    private int x; // 화면 가로 좌표
    private int y; // 화면 세로 좌표

    private String color; // 배경색

    // 위치 업데이트
    public void updatePosition(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
