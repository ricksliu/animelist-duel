package com.github.ricksliu.animelist_duel.utility;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringsUtility {
    public static String GetMatch(String str, String fromStr, String regex, int group)
    {
        int fromIndex = str.indexOf(fromStr);
        str = str.substring(fromIndex);

        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(str);

        if (matcher.find()) {
            return matcher.group(group);
        }
        return null;
    }
}
