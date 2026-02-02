package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.PostIt;
import org.example.backend.repository.PostItRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostItService {

    private final PostItRepository postItRepository;

    public List<PostIt> getAllPostIts() {
        return postItRepository.findAll();
    }

    @Transactional
    public PostIt createPostIt(PostIt postIt) {
        return postItRepository.save(postIt);
    }

    @Transactional
    public PostIt updatePosition(Long id, int x, int y) {
        PostIt postIt = postItRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ID " + id + "를 찾을 수 없습니다."));
        postIt.updatePosition(x, y);
        return postItRepository.save(postIt);
    }

    @Transactional
    public void deletePostIt(Long id) {
        if (!postItRepository.existsById(id)) {
            throw new IllegalArgumentException("ID " + id + "가 존재하지 않습니다.");
        }
        postItRepository.deleteById(id);
    }

    @Transactional
    public PostIt updateContent(Long id, String newContent) {
                PostIt postIt = postItRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 포스트잇이 존재하지 않습니다. ID: " + id));

        postIt.setContent(newContent);

        return postItRepository.save(postIt);
    }

    @Transactional
    public PostIt updateZIndex(Long id, int zIndex) {
        PostIt postIt = postItRepository.findById(id).orElseThrow();
        postIt.updateZIndex(zIndex);
        return postItRepository.save(postIt);
    }

    @Transactional
    public PostIt updateColor(Long id, String color) {
        PostIt postIt = postItRepository.findById(id).orElseThrow();
        postIt.updateColor(color);
        return postItRepository.save(postIt);
    }
}