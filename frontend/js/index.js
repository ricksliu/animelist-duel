// Called when username_submit class buttons are pressed
function submitUsername(user_number) {
    // Displays username
    document.getElementById(`username_${user_number}`).textContent = document.getElementById(`username_${user_number}_input`).value;

    // Shows .user_update_status
    document.querySelectorAll(`#user_${user_number} .user_update_status`).forEach(element => element.style.display = "inherit");
}

// Called when user_update class buttons are pressed
function updateUser(user_number) {
    var username = document.getElementById(`username_${user_number}`).textContent;
    
    // Sends http request to backend server
    const http_req = new XMLHttpRequest();
    http_req.open("GET", `http://localhost:3000/?username=${username.replace(" ", "+")}`);
    http_req.send();

    // Executes when a response (a JSON-encoded string) is recieved
    http_req.onload = () => {
        var user = JSON.parse(http_req.response);

        // Updates stats
        document.getElementById(`mean_score_${user_number}`).textContent = user.mean_score;
        document.getElementById(`days_watched_${user_number}`).textContent = user.days_watched;
        document.getElementById(`episodes_watched_${user_number}`).textContent = user.episodes_watched;
        document.getElementById(`total_entries_${user_number}`).textContent = user.total_entries;
        document.getElementById(`completed_${user_number}`).textContent = user.completed;
        document.getElementById(`watching_${user_number}`).textContent = user.watching;
        document.getElementById(`on_hold_${user_number}`).textContent = user.on_hold;
        document.getElementById(`dropped_${user_number}`).textContent = user.dropped;
        document.getElementById(`plan_to_watch_${user_number}`).textContent = user.plan_to_watch;
        document.getElementById(`rewatched_${user_number}`).textContent = user.rewatched;

        // Updates bars
        const stats = [
            "mean_score",
            "days_watched",
            "episodes_watched",
            "total_entries",
            "completed",
            "watching",
            "on_hold",
            "dropped",
            "plan_to_watch",
            "rewatched"
        ]

        // Stats where lower numbers are better
        const reversed_stats = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0];

        // Stats where comparing doesn't apply
        const neutral_stats = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
        
        for (var i = 0; i < stats.length; i++) {
            // If a neutral stat, makes bars gray
            if (neutral_stats[i] == 1) {
                document.getElementById(`${stats[i]}_1_bar`).style.backgroundColor = "#999";
                document.getElementById(`${stats[i]}_2_bar`).style.backgroundColor = "#999";

            // If not a neutral stat, calculates bar widths and colours
            } else {
                // Gets stats
                const stat_1 = parseFloat(document.getElementById(`${stats[i]}_1`).textContent);
                const stat_2 = parseFloat(document.getElementById(`${stats[i]}_2`).textContent);

                // Calculates percentage of user 1's bar
                var scale;
                if (stat_1 == stat_2) {
                    scale = 50;
                } else {
                    scale = 10 + 80 * stat_1 / (stat_1 + stat_2);

                    // If a reversed stat, reverses the scale
                    if (reversed_stats[i] == 1) {
                        scale = 100 - scale;
                    }
                }

                // Sets bar widths
                document.getElementById(`${stats[i]}_1_bar`).style.width = `${scale.toString()}%`;
                document.getElementById(`${stats[i]}_2_bar`).style.width = `${(100 - scale).toString()}%`;

                // Updates bar colours
                if (scale > 50.0) {
                    document.getElementById(`${stats[i]}_1_bar`).style.backgroundColor = "#6C6";
                    document.getElementById(`${stats[i]}_2_bar`).style.backgroundColor = "#C66";
                } else if (scale < 50.0) {
                    document.getElementById(`${stats[i]}_1_bar`).style.backgroundColor = "#C66";
                    document.getElementById(`${stats[i]}_2_bar`).style.backgroundColor = "#6C6";
                } else {
                    document.getElementById(`${stats[i]}_1_bar`).style.backgroundColor = "#999";
                    document.getElementById(`${stats[i]}_2_bar`).style.backgroundColor = "#999";
                }
            }
        }

        // Shows #stats
        document.getElementById("stats").style.display = "inherit";
    }
}
