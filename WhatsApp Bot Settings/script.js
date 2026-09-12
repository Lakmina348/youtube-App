// script.js

// කොපි කිරීමේ පහසුකම
function cp(text, btn) {
    navigator.clipboard.writeText(text);
    const originalText = btn.innerText;
    btn.innerText = "Copied! ✅";
    setTimeout(() => { btn.innerText = originalText; }, 1500);
}

// සෙවුම් යෝජනා ලැයිස්තුව
const commands = ["Antilink", "AlwaysOnline", "Sticker", "Welcome", "Lyrics", "Movie", "Weather"];

const searchInput = document.getElementById('commandSearch');
const suggestionBox = document.getElementById('suggestion-box');

searchInput.addEventListener('input', function() {
    let input = this.value.toLowerCase();
    suggestionBox.innerHTML = '';
    
    if (input.length > 0) {
        let filtered = commands.filter(cmd => cmd.toLowerCase().includes(input));
        if (filtered.length > 0) {
            suggestionBox.style.display = 'block';
            filtered.forEach(cmd => {
                let div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerText = cmd;
                div.onclick = () => {
                    searchInput.value = cmd;
                    suggestionBox.style.display = 'none';
                };
                suggestionBox.appendChild(div);
            });
        }
    } else {
        suggestionBox.style.display = 'none';
    }
});