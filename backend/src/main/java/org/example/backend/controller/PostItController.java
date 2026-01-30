package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.PostIt;
import org.example.backend.repository.PostItRepository;
import org.example.backend.service.PostItService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postits")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = "*")
public class PostItController {

    private final PostItService postItService;

    @GetMapping
    public List<PostIt> getAllPostIts() {
        return postItService.getAllPostIts();
    }

    @PostMapping
    public PostIt createPostIt(@RequestBody PostIt postIt) {
        return postItService.createPostIt(postIt);
    }

    @PutMapping("/{id}/position")
    public PostIt updatePosition(@PathVariable Long id, @RequestParam int x, @RequestParam int y) {
        return postItService.updatePosition(id, x, y);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostIt(@PathVariable("id") Long id) {
        postItService.deletePostIt(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/content")
    public ResponseEntity<PostIt> updateContent(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        String newContent = body.get("content");
        PostIt updatedPostIt = postItService.updateContent(id, newContent);
        return ResponseEntity.ok(updatedPostIt);
    }
}
