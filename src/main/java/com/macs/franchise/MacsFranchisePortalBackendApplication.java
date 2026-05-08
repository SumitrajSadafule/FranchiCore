package com.macs.franchise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@EntityScan(basePackages = "com.macs.franchise.model")
@EnableJpaRepositories(basePackages = "com.macs.franchise.repository")
@ComponentScan(basePackages = "com.macs.franchise")
public class MacsFranchisePortalBackendApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MacsFranchisePortalBackendApplication.class, args);
        
        System.out.println("\n=== DEBUG: CHECKING REGISTERED BEANS ===");
        
        // Check if controllers are being registered
        System.out.println("\nControllers found:");
        String[] controllerBeans = context.getBeanNamesForAnnotation(RestController.class);
        if (controllerBeans.length == 0) {
            System.out.println("  ❌ NO CONTROLLERS FOUND!");
        } else {
            for (String beanName : controllerBeans) {
                System.out.println("  ✅ " + beanName + ": " + context.getBean(beanName).getClass().getName());
            }
        }
        
        // Check package scanning
        System.out.println("\nBeans in controller package:");
        String[] controllerPackageBeans = context.getBeanNamesForType(org.springframework.stereotype.Controller.class);
        Arrays.stream(controllerPackageBeans).forEach(name -> System.out.println("  " + name));
        
        System.out.println("\n=== APPLICATION STARTUP COMPLETE ===");
        System.out.println("Test endpoints:");
        System.out.println("  GET http://localhost:8080/api/health/check");
        System.out.println("  GET http://localhost:8080/api/simple/ping");
        System.out.println("  GET http://localhost:8080/api/test/public");
        System.out.println("========================================");
        
     // ===== FUN ASCII ART BANNER =====
        System.out.println("\n" +
        "   ███╗   ███╗ █████╗  ██████╗███████╗    ███████╗██████╗  █████╗ ███╗   ██╗ ██████╗██╗  ██╗██╗███████╗███████╗███████╗\n" +
        "   ████╗ ████║██╔══██╗██╔════╝██╔════╝    ██╔════╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██║  ██║██║██╔════╝██╔════╝██╔════╝\n" +
        "   ██╔████╔██║███████║██║     █████╗      █████╗  ██████╔╝███████║██╔██╗ ██║██║     ███████║██║███████╗█████╗  █████╗  \n" +
        "   ██║╚██╔╝██║██╔══██║██║     ██╔══╝      ██╔══╝  ██╔══██╗██╔══██║██║╚██╗██║██║     ██╔══██║██║╚════██║██╔══╝  ██╔══╝  \n" +
        "   ██║ ╚═╝ ██║██║  ██║╚██████╗███████╗    ██║     ██║  ██║██║  ██║██║ ╚████║╚██████╗██║  ██║██║███████║███████╗███████╗\n" +
        "   ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝\n");
        
        
    }
}