package family.themartinez.mealplanner.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.headers().httpStrictTransportSecurity().maxAgeInSeconds(31536000).includeSubDomains(true);
    http.httpBasic().disable();
  }

  @Override
  public void configure(WebSecurity web) {
    // Disable security on static resources to allow caching configuration.
    web.ignoring().antMatchers("/static/**", "/resources/**", "/js/**", "/css/**", "/images/**");
  }
}
