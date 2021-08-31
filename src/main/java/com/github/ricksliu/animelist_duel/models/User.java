package com.github.ricksliu.animelist_duel.models;

import java.util.Date;

public class User {
    private Enums.AnimeWebsite animeWebsite;
    private String userId;
    private String username;
    private Date lastUpdated;
    private String profilePhoto;
    private double daysWatched;
    private double meanScore;
    private int entriesWatching;
    private int entriesCompleted;
    private int entriesOnHold;
    private int entriesDropped;
    private int entriesPlanToWatch;
    private int entriesTotal;
    private int entriesRewatched;
    private int episodesWatched;

    public Enums.AnimeWebsite getAnimeWebsite() {
        return animeWebsite;
    }

    public void setAnimeWebsite(Enums.AnimeWebsite animeWebsite) {
        this.animeWebsite = animeWebsite;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public double getDaysWatched() {
        return daysWatched;
    }

    public void setDaysWatched(double daysWatched) {
        this.daysWatched = daysWatched;
    }

    public double getMeanScore() {
        return meanScore;
    }

    public void setMeanScore(double meanScore) {
        this.meanScore = meanScore;
    }

    public int getEntriesWatching() {
        return entriesWatching;
    }

    public void setEntriesWatching(int entriesWatching) {
        this.entriesWatching = entriesWatching;
    }

    public int getEntriesCompleted() {
        return entriesCompleted;
    }

    public void setEntriesCompleted(int entriesCompleted) {
        this.entriesCompleted = entriesCompleted;
    }

    public int getEntriesOnHold() {
        return entriesOnHold;
    }

    public void setEntriesOnHold(int entriesOnHold) {
        this.entriesOnHold = entriesOnHold;
    }

    public int getEntriesDropped() {
        return entriesDropped;
    }

    public void setEntriesDropped(int entriesDropped) {
        this.entriesDropped = entriesDropped;
    }

    public int getEntriesPlanToWatch() {
        return entriesPlanToWatch;
    }

    public void setEntriesPlanToWatch(int entriesPlanToWatch) {
        this.entriesPlanToWatch = entriesPlanToWatch;
    }

    public int getEntriesTotal() {
        return entriesTotal;
    }

    public void setEntriesTotal(int entriesTotal) {
        this.entriesTotal = entriesTotal;
    }

    public int getEntriesRewatched() {
        return entriesRewatched;
    }

    public void setEntriesRewatched(int entriesRewatched) {
        this.entriesRewatched = entriesRewatched;
    }

    public int getEpisodesWatched() {
        return episodesWatched;
    }

    public void setEpisodesWatched(int episodesWatched) {
        this.episodesWatched = episodesWatched;
    }
}
