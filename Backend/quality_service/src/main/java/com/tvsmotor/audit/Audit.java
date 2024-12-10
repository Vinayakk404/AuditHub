package com.tvsmotor.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class Audit {

    private static final Logger logger = LoggerFactory.getLogger(Audit.class);

    public void logException(int id, Exception exception) {
        logger.error("Exception occurred for Batch ID {}: {} - {}", id, exception.getClass().getSimpleName(), exception.getMessage(), exception);
    }
}

