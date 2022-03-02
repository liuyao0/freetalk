package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dao.UserRatingDao;
import com.freetalk.freetalk_backend.entity.UserRating;
import com.freetalk.freetalk_backend.repository.UserRatingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional

class UserRatingDaoImplTest {
    @Autowired
    UserRatingDao userRatingDao;
    @Autowired
    UserRatingRepository userRatingRepository;

    @Test
    void deleteAll() {
        UserRating userRating=new UserRating();
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        userRating.setRating(1);
        userRating.setUserId(1);
        userRating.setTopicId(2);
        userRating.setPostTime(timestamp.getTime());

        userRatingDao.deleteAll();
        assertThat(userRatingRepository.findAll().size(),equalTo(0));
        userRatingRepository.save(userRating);

        assertThat(userRatingRepository.findAll().size(),equalTo(1));

    }

    @Test
    void saveAllAndFlush() {
        List<UserRating> userRatingList=new ArrayList<>();
        Integer oldSize= Math.toIntExact(userRatingRepository.count());
        UserRating userRating=new UserRating();
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        userRating.setRating(1);
        userRating.setUserId(1);
        userRating.setTopicId(2);
        userRating.setPostTime(timestamp.getTime());
        userRatingList.add(userRating);

        userRating=new UserRating();
        userRating.setRating(2);
        userRating.setUserId(2);
        userRating.setTopicId(3);
        userRating.setPostTime(timestamp.getTime());
        userRatingList.add(userRating);

        userRatingDao.saveAllAndFlush(userRatingList);
        assertThat(userRatingRepository.findAll().size(),equalTo(oldSize+2));

    }
}
