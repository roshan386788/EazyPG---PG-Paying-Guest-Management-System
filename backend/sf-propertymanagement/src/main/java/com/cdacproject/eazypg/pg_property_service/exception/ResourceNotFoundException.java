package com.cdacproject.eazypg.pg_property_service.exception;

public class ResourceNotFoundException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 4976781286353837693L;

	public ResourceNotFoundException(String message) {
        super(message);
    }
}
