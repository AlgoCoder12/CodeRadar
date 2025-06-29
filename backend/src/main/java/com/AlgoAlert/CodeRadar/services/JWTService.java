package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static io.jsonwebtoken.Jwts.*;

@Service
@Component
public class JWTService {

    private String secretKey = "lL1Qexe9FLsn37nplIkWroTOxvdr0/tntEx825WnApdnDOSDQZk0PoLfcZS306n3iMslaeOelKRN+Kvwf+dP29dLKsN7VVkK+vVfHg44iMlhyTGtjH1aPjSb8VeF4pZ2xEki7208afNzBHjt+rNlZe5lyWgTK3S30cIBtBvN+91pifn1fWFY0y1YuCxokoippY498CMteZxv0wSIhC9X/D0WZhTvohmB3izYKhIQdaxx/47Vr02TvYh5IINh6iTdkJ9fS0WD0tDdnfvsj20HbHUCWV4m9Pl4o1mSOma2ZUEzhLyRYDM3nkEI97nO0TI2fCewKrm7j4AdZ+5Pl7hX"; //to be changed later

    // public JWTService() {
    //     try {
    //         KeyGenerator keyGen = KeyGenerator.getInstance("hmacSHA256");
    //         SecretKey sk = keyGen.generateKey();
    //         secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
    //     } catch (NoSuchAlgorithmException e) {
    //         throw new RuntimeException(e);
    //     }
    // }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();

        return builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 3 * 24 * 60 * 60 * 1000))
                .and()
                .signWith(getKey())
                .compact();

    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claim = extractAllClaims(token);
        return claimResolver.apply(claim);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @Service
    public static class CustomOAuth2UserService extends DefaultOAuth2UserService {

        @Autowired
        private UserService userService;

        @Override
        public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
            OAuth2User oauthUser = super.loadUser(userRequest);

            // Extract user details from OAuth2 user
            String email = oauthUser.getAttribute("email");
            String name = oauthUser.getAttribute("name");

            if (email == null) {
                throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
            }

            // Find or create user in your database
            User user = userService.findByEmail(email);
            if (user == null) {
                // Create new user
                user = new User();
                user.setEmail(email);
                user.setUsername(email);
                user.setFullName(name != null ? name : email);
                String randomPassword = java.util.UUID.randomUUID().toString();
                user.setPassword(randomPassword);
                userService.saveUser(user);
            }

            return oauthUser;
        }
    }
}
