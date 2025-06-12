package com.AlgoAlert.CodeRadar.dto;


import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class LoginRequest {
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @AssertTrue(message = "Either email or username must be provided")
    private boolean isEmailOrUsernamePresent() {
        return (email != null && !email.trim().isEmpty()) ||
                (username != null && !username.trim().isEmpty());
    }
}
