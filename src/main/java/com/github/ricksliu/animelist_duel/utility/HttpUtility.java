package com.github.ricksliu.animelist_duel.utility;

import com.github.ricksliu.animelist_duel.models.Enums;
import com.github.ricksliu.animelist_duel.models.User;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Date;

public class HttpUtility {
    public static String GetHtml(String uriString) {
        String html = "";
        try {
            URI uri = new URI(uriString);
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(uri).GET().build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            html = response.body();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return html;
    }
}
