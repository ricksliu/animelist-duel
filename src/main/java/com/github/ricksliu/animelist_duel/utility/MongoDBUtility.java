package com.github.ricksliu.animelist_duel.utility;

import com.github.ricksliu.animelist_duel.models.Enums;
import com.github.ricksliu.animelist_duel.models.User;
import com.mongodb.BasicDBObject;
import com.mongodb.client.*;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class MongoDBUtility {
    public static void CreateUser(User user) {
        try (MongoClient mongoClient = MongoClients.create(System.getProperty("mongodb.uri"))) {
            MongoDatabase db = mongoClient.getDatabase("animelist_duel");
            MongoCollection<Document> users = db.getCollection("users");

            Document userDocument = new Document("_id", new ObjectId());
            userDocument.append("animeWebsite", user.getAnimeWebsite().toString())
                .append("userId", user.getUserId())
                .append("username", user.getUsername())
                .append("lastUpdated", user.getLastUpdated())
                .append("profilePhoto", user.getProfilePhoto())
                .append("daysWatched", user.getDaysWatched())
                .append("meanScore", user.getMeanScore())
                .append("entriesWatching", user.getEntriesWatching())
                .append("entriesCompleted", user.getEntriesCompleted())
                .append("entriesOnHold", user.getEntriesOnHold())
                .append("entriesDropped", user.getEntriesDropped())
                .append("entriesPlanToWatch", user.getEntriesPlanToWatch())
                .append("entriesTotal", user.getEntriesTotal())
                .append("entriesRewatched", user.getEntriesRewatched())
                .append("episodesWatched", user.getEpisodesWatched());
            users.insertOne(userDocument);
        }
    }

    public static User GetUser(Enums.AnimeWebsite animeWebsite, String username) {
        try (MongoClient mongoClient = MongoClients.create(System.getProperty("mongodb.uri"))) {
            MongoDatabase db = mongoClient.getDatabase("animelist_duel");
            MongoCollection<Document> users = db.getCollection("users");

            BasicDBObject query = new BasicDBObject();
            List<BasicDBObject> object = new ArrayList<>();
            object.add(new BasicDBObject("animeWebsite", animeWebsite.toString()));
            object.add(new BasicDBObject("username", username));
            query.put("$and", object);

            Document userDocument = users.find(query).sort(new BasicDBObject("lastUpdated", -1)).first();
            if (userDocument == null) {
                return null;
            }
            User user = new User();

            user.setAnimeWebsite(Enums.AnimeWebsite.valueOf((String) userDocument.get("animeWebsite")));
            user.setUserId((String) userDocument.get("userId"));
            user.setUsername((String) userDocument.get("username"));
            user.setLastUpdated((Date) userDocument.get("lastUpdated"));
            user.setProfilePhoto((String) userDocument.get("profilePhoto"));
            user.setDaysWatched((Double) userDocument.get("daysWatched"));
            user.setMeanScore((Double) userDocument.get("meanScore"));
            user.setEntriesWatching((Integer) userDocument.get("entriesWatching"));
            user.setEntriesCompleted((Integer) userDocument.get("entriesCompleted"));
            user.setEntriesOnHold((Integer) userDocument.get("entriesOnHold"));
            user.setEntriesDropped((Integer) userDocument.get("entriesDropped"));
            user.setEntriesPlanToWatch((Integer) userDocument.get("entriesPlanToWatch"));
            user.setEntriesTotal((Integer) userDocument.get("entriesTotal"));
            user.setEntriesRewatched((Integer) userDocument.get("entriesRewatched"));
            user.setEpisodesWatched((Integer) userDocument.get("episodesWatched"));

            return user;
        }
    }
}
