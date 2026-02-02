package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.PostIt;
import org.example.backend.service.PostItService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class PostItMessageController {

    private final PostItService postItService;

    @MessageMapping("/move")
    @SendTo("/topic/public")
    public PostIt movePostIt(PostIt postIt) {
        return postItService.updatePosition(postIt.getId(), postIt.getX(),  postIt.getY());
    }

    @MessageMapping("/create")
    @SendTo("/topic/public")
    public PostIt createPostIt(PostIt postIt) {
        return postItService.createPostIt(postIt);
    }

    @MessageMapping("/delete")
    @SendTo("/topic/public")
    public Long deletePostIt(Long id) {
        postItService.deletePostIt(id);
        return id;
    }

    @MessageMapping("/edit")
    @SendTo("/topic/public")
    public PostIt editPostIt(Map<String, Object> payload) {
        Long id = Long.valueOf(payload.get("id").toString());
        String content = (String) payload.get("content");

        return postItService.updateContent(id, content);
    }

    @MessageMapping("/color")
    @SendTo("/topic/public")
    public PostIt updateColor(Map<String, Object> payload) {
        Long id = Long.valueOf(payload.get("id").toString());
        String color = (String) payload.get("color");
        return postItService.updateColor(id, color);
    }

    @MessageMapping("/front")
    @SendTo("/topic/public")
    public PostIt bringToFront(Map<String, Object> payload) {
        Long id = Long.valueOf(payload.get("id").toString());
        int zIndex =  (int) payload.get("zIndex");
        return postItService.updateZIndex(id, zIndex);
    }

    @MessageMapping("/cursor")
    @SendTo("/topic/public")
    public Map<String, Object> streamCursor(Map<String, Object> cursorData){
        return cursorData;
    }
}
