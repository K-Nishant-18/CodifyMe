package com.codifyme.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskUpdateRequest {

    @NotNull(message = "Completion status is required")
    private Boolean completed;
}
