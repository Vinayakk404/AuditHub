package com.tvsmotor.exception;

/**
 * Exception thrown when custom business validations fail.
 * For example, when actualProductionUnits < plannedProductionUnits or
 * when productionStartTime is not before productionEndTime.
 */
public class ValidationException extends RuntimeException {
    
    /**
     * Constructs a new ValidationException with the specified detail message.
     *
     * @param message the detail message.
     */
    public ValidationException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new ValidationException with the specified detail message and cause.
     *
     * @param message the detail message.
     * @param cause the cause of the exception.
     */
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
