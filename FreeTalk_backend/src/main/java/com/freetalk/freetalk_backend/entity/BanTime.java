package com.freetalk.freetalk_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 *
 * @ClassName: BanTime
 * @author: He Jingkai
 * @date: 2021.8.2
 */

@Entity
@Table(name="ban_time")
@Data
@NoArgsConstructor
public class BanTime {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="ban_item_id")
    private Integer banItemId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "begin")
    private Timestamp beginTime;

    @Column(name = "end")
    private Timestamp endTime;
}
