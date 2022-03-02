package com.freetalk.freetalk_backend;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;


@SpringBootApplication
@EnableScheduling
public class FreeTalkBackendApplication {


    public static void main(String[] args) {
        SpringApplication.run(FreeTalkBackendApplication.class, args
        );
    }

    @Bean
    MeterRegistryCustomizer meterRegistryCustomizer(MeterRegistry meterRegistry) {
        return meterRegistry1 -> {
            meterRegistry.config()
                    .commonTags("application", "Tenantapp");
        };
    }


}
