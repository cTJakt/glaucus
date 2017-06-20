package com.jtang.entity;

import org.springframework.data.annotation.Id;

/**
 * Test entity by mongoDB
 * Created by lucas on 2016/10/12.
 */
public class Test {
    @Id
    private String id;

    private String name;
    private int age;
    private String gender;

    public Test() {}

    public Test(String name, int age, String gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    @Override
    public String toString() {
        return String.format(
                "Test[id=%s, firstName='%s', age=%d, lastName='%s']",
                id, name, age, gender);
    }
}
