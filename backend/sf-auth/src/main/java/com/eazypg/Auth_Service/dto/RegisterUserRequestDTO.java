package com.eazypg.Auth_Service.dto;


import com.eazypg.Auth_Service.models.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserRequestDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private Role role;
}
