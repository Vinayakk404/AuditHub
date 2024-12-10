package com.tvsmotor.exception;

public class InvalidDataException extends RuntimeException {

	public InvalidDataException(String string) {
		// TODO Auto-generated constructor stub
		super(string);
	}

	public String getMessage() {
		// TODO Auto-generated method stub
		return "Invalid data exception";
	}

}
