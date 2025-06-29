package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
//@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

//    @Autowired
//    @Lazy
    private final UserService userService;

    public CustomOAuth2UserService(UserService userService) {
        this.userService = userService;
    }

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