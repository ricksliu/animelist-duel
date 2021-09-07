package com.github.ricksliu.animelist_duel.utility;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringsUtility {
    public static String getMatch(String str, String fromStr, String regex, int group)
    {
        str = str.substring(str.indexOf(fromStr));

        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(str);

        if (matcher.find()) {
            return matcher.group(group);
        }
        return null;
    }

    public static List<String> getMatches(String str, String fromStr, String toStr, String regex)
    {
        str = str.substring(str.indexOf(fromStr), str.indexOf(toStr));

        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(str);

        ArrayList<String> matches = new ArrayList<>();
        while (matcher.find()) {
            for (int i = 0; i <= matcher.groupCount(); i++) {
                matches.add(matcher.group(i));
            }
        }
        return matches;
    }
}
