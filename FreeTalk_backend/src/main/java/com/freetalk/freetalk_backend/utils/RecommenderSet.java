package com.freetalk.freetalk_backend.utils;

import com.freetalk.freetalk_backend.dao.UserDao;
import com.freetalk.freetalk_backend.entity.User;
import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.*;
import java.util.List;

/**
 *
 * @ClassName: RecommenderSet
 * @Description: 利用布隆过滤器，存储已点击过的推荐内容。
 * @author: Liu Yao
 * @date: 2021.7.21
 */

@Component
@Data
@NoArgsConstructor
public class RecommenderSet
{
    @Autowired
    private UserDao userDao;

    static Integer expectedInsertions=1024*5;

    private static RecommenderSet recommenderSet;

    private String getPathName()
    {
        return ("."+File.separator+"bf"+File.separator);
    }

    private String getFileName(Integer userId)
    {
        return getPathName()+userId.toString()+".bf";
    }

    /**
     *
     * @FunctionName: init
     * @Description: 构造、依赖注入后行初始化，若持久化目录不存在则创建。
     * @author: Liu Yao
     * @date: 2021.7.23
     */
    @PostConstruct
    public void init()
    {
        File bloomFilterDir=new File(getPathName());
        bloomFilterDir.mkdirs();
    }

    /**
     *
     * @FunctionName: reset
     * @Description: 重置布隆过滤器（全部置空）
     * @author: Liu Yao
     * @date: 2021.7.23
     */
    public void reset()
    {
        List<User> userList = userDao.findAll();
        for (User user : userList) {
            clearFilterByUserId(user.getUserId());
        }
    }


    /**
     *
     * @FunctionName: put
     * @Description: 指定用户id和话题id，加入布隆过滤器
     * @author: Liu Yao
     * @date: 2021.7.23
     */
    public void put(Integer userId, Integer topicId){
        try {
            BloomFilter<Integer> bloomFilter;
            File bloomFilterFile=new File(getFileName(userId));
            if(!bloomFilterFile.exists())
            {
                bloomFilter = BloomFilter.create(Funnels.integerFunnel(), expectedInsertions);
                bloomFilterFile.createNewFile();
            }
            else
            {
                InputStream inputStream=new FileInputStream(bloomFilterFile);
                bloomFilter=BloomFilter.readFrom(inputStream,Funnels.integerFunnel());
            }
            bloomFilter.put(topicId);
            OutputStream outputStream=new FileOutputStream(bloomFilterFile);
            bloomFilter.writeTo(outputStream);
        }
        catch (IOException ioException)
        {
            ioException.printStackTrace();
        }

    }

    /**
     *
     * @FunctionName: setBloomFilterByUserId
     * @Description: 设置某用户的布隆过滤器
     * @author: Liu Yao
     * @date: 2021.7.23
     */

    public void setBloomFilterByUserId(Integer userId,BloomFilter  bloomFilter){
        try {
            File bloomFilterFile=new File(getFileName(userId));
            if(!bloomFilterFile.exists())
            {
                bloomFilter = BloomFilter.create(Funnels.integerFunnel(), expectedInsertions);
                bloomFilterFile.createNewFile();
            }
            OutputStream outputStream=new FileOutputStream(bloomFilterFile);
            bloomFilter.writeTo(outputStream);
        }
        catch (IOException ioException)
        {
            ioException.printStackTrace();
        }

    }

    /**
     *
     * @FunctionName: find
     * @Description: 指定用户id和话题id，查询是否存在
     * @author: Liu Yao
     * @date: 2021.7.23
     */
    public Boolean find(Integer userId,Integer topicId){
        try{
            BloomFilter<Integer> bloomFilter;
            File bloomFilterFile=new File(getFileName(userId));
            if(!bloomFilterFile.exists())
            {
                bloomFilter = BloomFilter.create(Funnels.integerFunnel(), expectedInsertions);
                bloomFilterFile.createNewFile();
                OutputStream outputStream=new FileOutputStream(bloomFilterFile);
                bloomFilter.writeTo(outputStream);
                return false;
            }
            InputStream inputStream=new FileInputStream(bloomFilterFile);
            bloomFilter=BloomFilter.readFrom(inputStream,Funnels.integerFunnel());
            return bloomFilter.mightContain(topicId);
        }
        catch (IOException ioException)
        {
            ioException.printStackTrace();
            return false;
        }
    }

    /**
     *
     * @FunctionName: getBloomFilterByUserId
     * @Description: 指定用户id，取得其布隆过滤器
     * @author: Liu Yao
     * @date: 2021.7.23
     */
    public BloomFilter getBloomFilterByUserId(Integer userId){
        try {
            BloomFilter<Integer> bloomFilter;
            File bloomFilterFile=new File(getFileName(userId));
            if(!bloomFilterFile.exists())
            {
                bloomFilter = BloomFilter.create(Funnels.integerFunnel(), expectedInsertions);
                bloomFilterFile.createNewFile();
                OutputStream outputStream=new FileOutputStream(bloomFilterFile);
                bloomFilter.writeTo(outputStream);
                return bloomFilter;
            }
            InputStream inputStream=new FileInputStream(bloomFilterFile);
            bloomFilter=BloomFilter.readFrom(inputStream,Funnels.integerFunnel());
            return bloomFilter;
        }
        catch (IOException ioException)
        {
            ioException.printStackTrace();
            return null;
        }

    }


    /**
     *
     * @FunctionName: clearFilterByUserId
     * @Description: 指定某用户的布隆过滤器将其置空
     * @author: Liu Yao
     * @date: 2021.7.23
     */
    public void clearFilterByUserId(Integer userId){
        try {
            File bloomFilterFile=new File(getFileName(userId));
            BloomFilter bloomFilter=BloomFilter.create(Funnels.integerFunnel(), expectedInsertions);
            if(!bloomFilterFile.exists())
                bloomFilterFile.createNewFile();
            OutputStream outputStream=new FileOutputStream(bloomFilterFile);
            bloomFilter.writeTo(outputStream);
        }
        catch (IOException ioException)
        {
            ioException.printStackTrace();
        }
    }

    public Integer getExpectedInsertions() {return expectedInsertions;}
}
