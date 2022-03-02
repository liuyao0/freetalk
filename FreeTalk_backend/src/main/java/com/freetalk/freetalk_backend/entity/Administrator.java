package com.freetalk.freetalk_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name="administrator")
@Data
@NoArgsConstructor
public class Administrator {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="administrator_id")
    private Integer administratorId;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;
}
