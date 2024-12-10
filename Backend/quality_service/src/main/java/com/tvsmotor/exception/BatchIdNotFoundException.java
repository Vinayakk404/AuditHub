package com.tvsmotor.exception;

public class BatchIdNotFoundException extends RuntimeException {

    public BatchIdNotFoundException(int id) {
        super("Batch ID not found: " + id);
    }
    public BatchIdNotFoundException(String batchId, Throwable cause) {
        super("Batch ID not found: " + batchId, cause);
    }
}

