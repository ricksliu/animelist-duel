package com.github.ricksliu.animelist_duel.utility;

import com.github.ricksliu.animelist_duel.models.Enums;
import com.github.ricksliu.animelist_duel.models.ScoreComparison;
import com.github.ricksliu.animelist_duel.models.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

public class MyAnimeListUtility {
    private static String GetScoreComparisonHTML(String username1, String username2) {
        String uriString = String.format("https://myanimelist.net/shared.php?u1=%s&u2=%s", username1, username2);
        return HttpUtility.GetHtml(uriString);
    }

    public static List<ScoreComparison> GetScoreComparisons(String username1, List<String> usernames)
    {
        ArrayList<ScoreComparison> scoreComparisons = new ArrayList<>();
        for (String username2 : usernames)
        {
            String html = GetScoreComparisonHTML(username1, username2);
            //ScoreComparison scoreComparison = new ScoreComparison();

            String regex = "\t\t<tr>\r\n" +
                    "\t\t\t<td class=\"borderClass\".*?><a href=\"/anime/([0-9]+?)/.*?\">(.+?)</a> <a.*?</a></td>\r\n" +
                    "\t\t\t<td class=\"borderClass\".*?><span style=.*?>([0-9]+?)</span></td>\r\n" +
                    "\t\t\t<td class=\"borderClass\".*?><span style=.*?>([0-9]+?)</span></td>\r\n" +
                    "\t\t\t<td class=\"borderClass\".*?>([0-9]+?)</td>\r\n" +
                    "\t\t\t\r\n" +
                    "\t\t</tr>";

            regex = "\t\t<tr>\n" +
                    "\t\t\t<td class=\"borderClass\" ><a href=\"/anime/5680/K-On\">K-On!</a> </td>\n" +
                    "\t\t\t<td class=\"borderClass\"  align=\"center\"><span style=\" color: #0000FF;\">8</span></td>\n" +
                    "\t\t\t<td class=\"borderClass\"  align=\"center\"><span style=\" color: #FF0000;\">9</span></td>\n" +
                    "\t\t\t<td class=\"borderClass\"  align=\"center\">1</td>\n" +
                    "\t\t\t\n" +
                    "\t\t</tr>";

            List<String> matches = StringsUtility.GetMatches(html, "<strong>Diff.</strong>", "<h2>Unique to", regex, Pattern.DOTALL);
        }

        return null;
    }

    public static User GetUser(String username)
    {
        String html = GetUserHTML(username);
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

    private static String GetUserHTML(String username) {
        String uriString = String.format("https://myanimelist.net/profile/%s", username);
        return HttpUtility.GetHtml(uriString);
    }
}
