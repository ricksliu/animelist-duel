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

        // Displays stats
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

        // Shows .stats
        document.querySelectorAll(`#user_${user_number} .stats`).forEach(element => element.style.display = "inherit");
    }
}
