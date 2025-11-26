package com.codifyme.controller;

import com.codifyme.model.DailyTask;
import com.codifyme.payload.request.TaskUpdateRequest;
import com.codifyme.repository.DailyTaskRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class DailyTaskController {

    @Autowired
    private DailyTaskRepository dailyTaskRepository;

    @GetMapping("/roadmap/{roadmapId}")
    public ResponseEntity<List<DailyTask>> getTasksByRoadmap(@PathVariable Long roadmapId) {
        List<DailyTask> tasks = dailyTaskRepository.findByRoadmapIdOrderByDayNumberAsc(roadmapId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> updateTaskCompletion(
            @PathVariable Long id,
            @Valid @RequestBody TaskUpdateRequest request) {

        DailyTask task = dailyTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(request.getCompleted());
        dailyTaskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<DailyTask> createTask(@RequestBody DailyTask task) {
        DailyTask savedTask = dailyTaskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }
}
