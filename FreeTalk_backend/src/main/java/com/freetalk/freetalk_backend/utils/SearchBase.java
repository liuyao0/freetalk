package com.freetalk.freetalk_backend.utils;

import java.util.*;

public class SearchBase {
    private final HashMap<String, Object> details = new HashMap<>();

    private final static int maxLength = Character.MAX_VALUE;
    @SuppressWarnings("unchecked")
    private final HashSet<String>[] keySearch = new HashSet[maxLength];

    /**
     *@Description: 实现单例模式，采用Initialization on Demand Holder加载
     */
    private static class lazyLoadSerachBase {
        private static final SearchBase searchBase = new SearchBase();
    }

    /**
     * 这里把构造方法设置成私有为的是单例模式
     */
    private  SearchBase() {

    }

    /**
     * @Description: 获取单例
     */
    public static SearchBase getSearchBase() {
        return lazyLoadSerachBase.searchBase;
    }

    /**
     * @Description: 根据id获取详细
     */
    public Object getObject(String id) {
        return details.get(id);
    }

    /**
     * @Description: 根据ids获取详细，id之间用","隔开
     */
    public List<Object> getObjects(String ids) {
        if (ids == null || "".equals(ids)) {
            return null;
        }
        List<Object> objs = new ArrayList<>();
        String[] idArray = ids.split(",");
        for (String id : idArray) {
            objs.add(getObject(id));
        }
        return objs;
    }

    /**
     * @Description: 根据搜索词查找对应的id，id之间用","分割
     */
    public String getIds(String key) {
        if (key == null || "".equals(key)) {
            return null;
        }
        HashMap<String, Integer> idTimes = new HashMap<>();
        HashSet<String> ids = new HashSet<>();

        for (int i = 0; i < key.length(); i++) {
            int at = key.charAt(i);
            if (keySearch[at] == null) {
                continue;
            }
            for (Object obj : keySearch[at].toArray()) {
                String id = (String) obj;
                int times = 1;
                if (ids.contains(id)) {
                    times += idTimes.get(id);
                } else {
                    ids.add(id);
                }
                idTimes.put(id, times);
            }
        }

        List<SortBean> sortBeans = new ArrayList<>();
        for (String id : ids) {
            SortBean sortBean = new SortBean();
            sortBeans.add(sortBean);
            sortBean.setId(id);
            sortBean.setTimes(idTimes.get(id));
        }
        sortBeans.sort((o1, o2) -> o2.getTimes() - o1.getTimes());

        StringBuilder sb = new StringBuilder();
        for (SortBean sortBean : sortBeans) {
            sb.append(sortBean.getId());
            sb.append(",");
        }

        idTimes.clear();
        ids.clear();
        sortBeans.clear();

        return sb.toString();
    }

    /**
     * @Description: 添加搜索记录
     */
    public void add(String id, String searchKey, Object obj) {
        if (id == null || searchKey == null || obj == null) {
            return;
        }
        details.put(id, obj);
        addSearchKey(id, searchKey);
    }

    /**
     * @Description: 将搜索词加入到搜索域中
     */
    private void addSearchKey(String id, String searchKey) {
        if (id == null || searchKey == null) {
            return;
        }
        for (int i = 0; i < searchKey.length(); i++) {
            int at = searchKey.charAt(i);
            if (keySearch[at] == null) {
                HashSet<String> value = new HashSet<>();
                keySearch[at] = value;
            }
            keySearch[at].add(id);
        }
    }
}
