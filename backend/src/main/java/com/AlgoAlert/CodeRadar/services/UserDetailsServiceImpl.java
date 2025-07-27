package com.AlgoAlert.CodeRadar.services;

import com.AlgoAlert.CodeRadar.model.User;
import com.AlgoAlert.CodeRadar.model.UserPrincipal;
import com.AlgoAlert.CodeRadar.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
//    @Lazy
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(usernameOrEmail);
        if (user == null) {
            user = userRepo.findByEmail(usernameOrEmail);
        }
        if (user == null) throw new UsernameNotFoundException("User not found");
        return new UserPrincipal(user);
    }
}
