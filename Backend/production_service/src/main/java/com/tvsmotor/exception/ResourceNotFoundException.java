package com.tvsmotor.exception;

public class ResourceNotFoundException extends RuntimeException {

	public ResourceNotFoundException(String string) {
		super(string);
	}

	public String getMessage() {
		// TODO Auto-generated method stub
		return "Resource ID Not Found";
	}

}
