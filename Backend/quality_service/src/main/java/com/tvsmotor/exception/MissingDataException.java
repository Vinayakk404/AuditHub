package com.tvsmotor.exception;

public class MissingDataException extends RuntimeException {
    private String fieldName;  // the name of the missing field
    private String errorMessage;  // additional error message

    // Constructor that accepts two String parameters
    public MissingDataException(String  i, String errorMessage) {
        super(errorMessage);  // Call the parent class (RuntimeException) constructor
        this.fieldName = i;
        this.errorMessage = errorMessage;
    }

    // Getter for fieldName
    public String getFieldName() {
        return fieldName;
    }

    // Getter for errorMessage
    @Override
    public String getMessage() {
        return errorMessage;
    }
}




