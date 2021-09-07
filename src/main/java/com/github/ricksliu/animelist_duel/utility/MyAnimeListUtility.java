package com.github.ricksliu.animelist_duel.utility;

import com.github.ricksliu.animelist_duel.models.Enums;
import com.github.ricksliu.animelist_duel.models.ScoreComparison;
import com.github.ricksliu.animelist_duel.models.ScoreComparisonScore;
import com.github.ricksliu.animelist_duel.models.User;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.github.ricksliu.animelist_duel.models.Constants.maxScoreComparisons;
import static java.util.stream.Collectors.toList;

public class MyAnimeListUtility {
    public static String getAnimeImage(String id)
    {
        String html = getAnimeImageHTML(id);
        String image = StringsUtility.getMatch(html, "<div style=\"text-align: center;\">", "<img class=\"lazyload\" data-src=\"(.+?)\"", 1);
        return image;
    }

    private static String getAnimeImageHTML(String id) {
        String uriString = String.format("https://myanimelist.net/anime/%s", id);
        return HttpUtility.getHtml(uriString);
    }

    private static List<ScoreComparison> getFilteredScoreComparisons(List<ScoreComparison> scoreComparisons) {
        List<Double> diffs = scoreComparisons.stream().map(e -> Collections.max(e.getScores().stream().map(f -> f.getScore()).collect(toList())) - Collections.min(e.getScores().stream().map(f -> f.getScore()).collect(toList()))).collect(toList());
        int diff = 10;

        ArrayList<ScoreComparison> filteredScoreComparisons = new ArrayList<>();
        while (filteredScoreComparisons.size() < Math.min(scoreComparisons.size(), maxScoreComparisons)) {
            for (int i = 0; i < scoreComparisons.size(); i++) {
                if (diffs.get(i) == diff) {
                    filteredScoreComparisons.add(scoreComparisons.get(i));
                    if (filteredScoreComparisons.size() >= Math.min(scoreComparisons.size(), maxScoreComparisons)) {
                        break;
                    }
                }
            }
            diff--;
        }

        return filteredScoreComparisons;
    }

    private static String getScoreComparisonHTML(String username1, String username2) {
        String uriString = String.format("https://myanimelist.net/shared.php?u1=%s&u2=%s", username1, username2);
        return HttpUtility.getHtml(uriString);
    }

    public static List<ScoreComparison> getScoreComparisons(String username1, List<String> usernames)
    {
        List<ScoreComparison> scoreComparisons = new ArrayList<>();
        for (String username2 : usernames)
        {
            String html = getScoreComparisonHTML(username1, username2);
            String regex = "\t\t<tr>\n" +
                    "\t\t\t<td class=\"borderClass\".*?><a href=\"/anime/([0-9]+?)/.+?\">(.+?)</a> </td>\n" +
                    "\t\t\t<td class=\"borderClass\".*?align=\"center\"><span style=\".*?\">([0-9]+?)</span></td>\n" +
                    "\t\t\t<td class=\"borderClass\".*?align=\"center\"><span style=\".*?\">([0-9]+?)</span></td>\n" +
                    "\t\t\t<td class=\"borderClass\".*?align=\"center\">[0-9]+?</td>\n" +
                    "\t\t\t\n" +
                    "\t\t</tr>";
            List<String> matches = StringsUtility.getMatches(html, "<strong>Diff.</strong>", "<h2>Unique to", regex);

            List<ScoreComparison> scoreComparisonsSingle = new ArrayList<>();

            int numMatches = matches.size() / 5;
            for (int i = 0; i < numMatches; i++) {
                ScoreComparison scoreComparison = new ScoreComparison();

                scoreComparison.setAnimeWebsite(Enums.AnimeWebsite.MAL);
                scoreComparison.setId(matches.get(5 * i + 1));
                scoreComparison.setName(matches.get(5 * i + 2));
                List<ScoreComparisonScore> scores = new ArrayList<>();
                scores.add(new ScoreComparisonScore(username1, Double.parseDouble(matches.get(5 * i + 3))));
                scores.add(new ScoreComparisonScore(username2, Double.parseDouble(matches.get(5 * i + 4))));
                scoreComparison.setScores(scores);

                scoreComparisonsSingle.add(scoreComparison);
            }

            scoreComparisonsSingle = getFilteredScoreComparisons(scoreComparisonsSingle);
            scoreComparisons.addAll(scoreComparisonsSingle);
        }

        for (int i = 0; i < scoreComparisons.size(); i++) {
            scoreComparisons.get(i).setImage(getAnimeImage(scoreComparisons.get(i).getId()));
        }

        return scoreComparisons;
    }

    public static User getUser(String username, boolean update)
    {
        User user = update ? null : MongoDBUtility.GetUser(Enums.AnimeWebsite.MAL, username);
        if (user != null) {
            return user;
        }

        String html = getUserHTML(username);
        user = new User();

        user.setAnimeWebsite(Enums.AnimeWebsite.MAL);
        user.setUserId(StringsUtility.getMatch(html, "userimages", "/(.+?)\\.", 1));
        user.setUsername(username);
        user.setLastUpdated(new Date(System.currentTimeMillis()));
        user.setProfilePhoto(String.format("https://cdn.myanimelist.net/images/userimages/%s.jpg", user.getUserId()));
        user.setDaysWatched(Double.parseDouble(StringsUtility.getMatch(html, "Days", ">(.+?)<", 1).replace(",", "")));
        user.setMeanScore(Double.parseDouble(StringsUtility.getMatch(html, "Mean Score", ">(.+?)<", 1).replace(",", "")));
        user.setEntriesWatching(Integer.parseInt(StringsUtility.getMatch(html, "Watching", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesCompleted(Integer.parseInt(StringsUtility.getMatch(html, "Completed", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesOnHold(Integer.parseInt(StringsUtility.getMatch(html, "On-Hold", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesDropped(Integer.parseInt(StringsUtility.getMatch(html, "Dropped", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesPlanToWatch(Integer.parseInt(StringsUtility.getMatch(html, "Plan to Watch", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesTotal(Integer.parseInt(StringsUtility.getMatch(html, "Total Entries", "\">(.+?)<", 1).replace(",", "")));
        user.setEntriesRewatched(Integer.parseInt(StringsUtility.getMatch(html, "Rewatched", "\">(.+?)<", 1).replace(",", "")));
        user.setEpisodesWatched(Integer.parseInt(StringsUtility.getMatch(html, "Episodes", "\">(.+?)<", 1).replace(",", "")));

        MongoDBUtility.CreateUser(user);
        return user;
    }

    private static String getUserHTML(String username) {
        String uriString = String.format("https://myanimelist.net/profile/%s", username);
        return HttpUtility.getHtml(uriString);
    }
}
