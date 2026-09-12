document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('mainSearch');
    const suggestionsBox = document.getElementById('searchSuggestions');
    const shotLinks = document.querySelectorAll('.shot-link');
    
    // Search Data for Suggestions
    const data = ["Bot Usage", "Buy Bot", "Admin Panel", "No Ads Cinema", "UI Design"];

    searchInput.addEventListener('input', function() {
        const val = this.value.toLowerCase().trim();
        suggestionsBox.innerHTML = '';
        
        let hasResults = false;

        // 1. Filtering Shots (Grid එකේ තියෙන දේවල් Filter කිරීම)
        shotLinks.forEach(link => {
            const title = link.querySelector('.shot-title').innerText.toLowerCase();
            if (title.includes(val)) {
                link.style.display = 'block';
                hasResults = true;
            } else {
                link.style.display = 'none';
            }
        });

        // 2. Showing Suggestions (ටයිප් කරන විට පෙන්වන යෝජනා)
        if (val.length > 0) {
            const matches = data.filter(s => s.toLowerCase().includes(val));
            if (matches.length > 0) {
                suggestionsBox.style.display = 'block';
                matches.forEach(text => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.innerHTML = `<i class="fa fa-search"></i> <span>${text}</span>`;
                    div.onclick = () => { 
                        searchInput.value = text; 
                        suggestionsBox.style.display = 'none';
                        // Trigger filtering based on clicked suggestion
                        searchInput.dispatchEvent(new Event('input'));
                    };
                    suggestionsBox.appendChild(div);
                });
            } else {
                suggestionsBox.style.display = 'none';
            }
        } else {
            suggestionsBox.style.display = 'none';
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target)) suggestionsBox.style.display = 'none';
    });
});

// Function for Movie Hub Prompt
function showPrompt() {
    const message = "🔖 සමාවන්න ඔබට \n*👤 Username:* \n*🔑 Password:* \nදැන ගැනීමට පහත Ok බටන් එක Touch කරන්න";
    if (confirm(message)) {
        const phoneNumber = "94788637885";
        const whatsappMsg = encodeURIComponent("lakmina2005.github.io/Move-Hub");
        window.open(`https://wa.me/${phoneNumber}?text=${whatsappMsg}`, '_blank');
        window.location.href = "https://lakmina2005.github.io/Move-Hub/";
    }
}