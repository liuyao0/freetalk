package com.freetalk.freetalk_backend.utils;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

//Warning:测试该类会导致推荐系统的布隆过滤器重置！！
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class RecommenderSetTest {
    @Autowired
    RecommenderSet recommenderSet;

    @BeforeEach
    void beforeEach()
    {
        recommenderSet.reset();
    }

    @AfterEach
    void afterEach()
    {
        recommenderSet.reset();
    }

    @Test
    void put() {
        assertThat(recommenderSet.find(1,1),equalTo(false));
        recommenderSet.put(1,1);
        assertThat(recommenderSet.find(1,1),equalTo(true));
    }

    @Test
    void setBloomFilterByUserId() {
        BloomFilter bloomFilter=BloomFilter.create(Funnels.integerFunnel(),recommenderSet.getExpectedInsertions());
        bloomFilter.put(1);
        assertThat(recommenderSet.find(1,1),equalTo(false));
        recommenderSet.put(1,1);
        recommenderSet.setBloomFilterByUserId(1,bloomFilter);
        assertThat(recommenderSet.find(1,1),equalTo(true));
    }

    @Test
    void find() {
        recommenderSet.put(1,1);
        assertThat(recommenderSet.find(1,1),equalTo(true));
        assertThat(recommenderSet.find(1,2),equalTo(false));
    }

    @Test
    void getBloomFilterByUserId() {
        recommenderSet.put(1,1);
        BloomFilter bloomFilter=recommenderSet.getBloomFilterByUserId(1);
        assertThat(bloomFilter.mightContain(1),equalTo(true));
        assertThat(bloomFilter.mightContain(2),equalTo(false));
    }

    @Test
    void clearFilterByUserId() {
        recommenderSet.put(1,1);
        assertThat(recommenderSet.find(1,1),equalTo(true));
        recommenderSet.clearFilterByUserId(1);
        assertThat(recommenderSet.find(1,1),equalTo(false));
    }
}
