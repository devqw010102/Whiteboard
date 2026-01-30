package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.PostIt;
import org.example.backend.repository.PostItRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postits")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PostItController {

    private final PostItRepository postItRepository;

    @GetMapping
    public List<PostIt> getAllPostIts() {
        return postItRepository.findAll();
    }

    @PostMapping
    public PostIt createPostIt(@RequestBody PostIt postIt) {
        return postItRepository.save(postIt);
    }

    @PutMapping("/{id}/position")
    public PostIt updatePosition(@PathVariable Long id, @RequestParam int x, @RequestParam int y) {
        PostIt postIt = postItRepository.findById(id).orElseThrow();
        postIt.updatePosition(x, y);
        return postItRepository.save(postIt);
    }
}
