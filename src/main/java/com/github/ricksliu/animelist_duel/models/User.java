package com.github.ricksliu.animelist_duel.models;

public class User {
    private String username;
    private int data;

    public int getData() {
        return data;
    }

    public String getUsername() {
        return username;
    }

    public void setData(int data) {
        this.data = data;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
