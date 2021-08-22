package com.github.ricksliu.animelist_duel.utility;

import com.github.ricksliu.animelist_duel.models.Enums;
import com.github.ricksliu.animelist_duel.models.User;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Date;

public class MyAnimeListUtility {
    public static String GetProfileHTML(String username) {
        String html = "";
        try {
            URI uri = new URI(String.format("https://myanimelist.net/profile/%s", username));
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(uri).GET().build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            html = response.body();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return html;
    }

    public static User GetUserFromHTML(String username, String html)
    {
        User user = new User();

        user.setAnimeWebsite(Enums.AnimeWebsite.MAL);
        user.setUserId(StringsUtility.GetMatch(html, "userimages", "/(.+?)\\.", 1));
        user.setUsername(username);
        user.setLastUpdated(new Date(System.currentTimeMillis()));
        user.setProfilePhoto(String.format("https://cdn.myanimelist.net/images/userimages/%s.jpg", user.getUserId()));
        user.setDaysWatched(Double.parseDouble(StringsUtility.GetMatch(html, "Days", ">(.+?)<", 1).replace(",", "")));
        user.setMeanScore(Double.parseDouble(StringsUtility.GetMatch(html, "Mean Score", ">(.+?)<", 1).replace(",", "")));
        user.setEntriesWatching(Integer.parseInt(StringsUtility.GetMatch(html, "Watching", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesCompleted(Integer.parseInt(StringsUtility.GetMatch(html, "Completed", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesOnHold(Integer.parseInt(StringsUtility.GetMatch(html, "On-Hold", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesDropped(Integer.parseInt(StringsUtility.GetMatch(html, "Dropped", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesPlanToWatch(Integer.parseInt(StringsUtility.GetMatch(html, "Plan to Watch", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesTotal(Integer.parseInt(StringsUtility.GetMatch(html, "Total Entries", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesRewatched(Integer.parseInt(StringsUtility.GetMatch(html, "Rewatched", "\">(.+?)<", 1).replace(",", "")));
        user.setEpisodesWatched(Integer.parseInt(StringsUtility.GetMatch(html, "Episodes", "\">(.+?)<", 1).replace(",", "")));

        return user;
    }
}
