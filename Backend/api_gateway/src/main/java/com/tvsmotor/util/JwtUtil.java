package com.tvsmotor.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

	public static final String SECRET = "ik77MQezKvtGgZspU8BvWKQy6Cr4We0iU8nuiY14J+GmVWIswYh+b4ac57qD6t3N9WYdnuQejYUumtQQfD3LRw==";

	public void validateToken(final String token) {
		try {
			Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
		} catch (io.jsonwebtoken.security.SecurityException | io.jsonwebtoken.MalformedJwtException e) {
			throw new RuntimeException("Invalid JWT signature" + e.getMessage());
		} catch (io.jsonwebtoken.ExpiredJwtException e) {
			throw new RuntimeException("Expired JWT token" + e.getMessage());
		} catch (io.jsonwebtoken.UnsupportedJwtException e) {
			throw new RuntimeException("Unsupported JWT token" + e.getMessage());
		} catch (Exception e) {
			throw new RuntimeException("JWT claims string is empty" + e.getMessage());
		}
	}

	private Key getSignKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
