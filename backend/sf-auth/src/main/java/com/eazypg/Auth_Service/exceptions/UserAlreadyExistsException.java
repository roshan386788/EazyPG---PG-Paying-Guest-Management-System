package com.eazypg.Auth_Service.exceptions;

import java.io.Serial;

public class UserAlreadyExistsException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = -5395740249297805147L;

    public UserAlreadyExistsException(String s) {
        super(s);
    }
}
