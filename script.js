document.addEventListener("DOMContentLoaded", () => {
    fetch('data.csv')
        .then(response => response.text())
        .then(text => {
            const rows = text.split('\n').slice(1);
            const tableBody = document.querySelector('#profileTable tbody');

            const data = rows.map(row => {
                const columns = row.split(',');
                if (columns.length < 12) return null;

                const [userName, userEmail, profileURL, profileStatus, accessCodeStatus, milestoneEarned, skillBadges, arcadeGames, triviaGames] = columns;

                const cleanText = text => text.replace(/"/g, '').trim();
                const profileStatusClean = cleanText(profileStatus).toLowerCase();
                const profileStatusSymbol = profileStatusClean === 'all good' ? '✔️' : '❌';
                const accessCodeSymbol = cleanText(accessCodeStatus).toLowerCase() === 'yes' ? '✔️' : '❌';
                const skillBadgesCount = parseInt(cleanText(skillBadges), 10) || 0;
                const arcadeGamesCount = parseInt(cleanText(arcadeGames), 10) || 0;
                const triviaGamesCount = parseInt(cleanText(triviaGames), 10) || 0;
                const total = skillBadgesCount + arcadeGamesCount + triviaGamesCount;

                return {
                    userName: cleanText(userName),
                    profileStatus: profileStatusSymbol,
                    accessCodeStatus: accessCodeSymbol,
                    milestoneEarned: cleanText(milestoneEarned),
                    total
                };
            }).filter(item => item !== null);

            data.sort((a, b) => b.total - a.total);

            const goldMedal = document.querySelector('#goldMedal');
            const silverMedal = document.querySelector('#silverMedal');
            const bronzeMedal = document.querySelector('#bronzeMedal');

            if (data[0]) goldMedal.textContent = `${data[0].userName} (${data[0].total})`;
            if (data[1]) silverMedal.textContent = `${data[1].userName} (${data[1].total})`;
            if (data[2]) bronzeMedal.textContent = `${data[2].userName} (${data[2].total})`;

            data.forEach(item => {
                tableBody.innerHTML += `
                    <tr>
                        <td><a href="contestant-details.html?name=${encodeURIComponent(item.userName)}">${item.userName}</a></td>
                        <td class="${item.profileStatusClass}">${item.profileStatus}</td>
                        <td class="${item.accessCodeClass}">${item.accessCodeStatus}</td>
                        <td>${item.milestoneEarned}</td>
                        <td>${item.total}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error loading the CSV file:', error));

    // Side Slider Toggle Functionality
    const menuBtn = document.getElementById('menuBtn');
    const sideSlider = document.getElementById('sideSlider');
    const closeBtn = document.getElementById('closeBtn');

    // Show side slider
    menuBtn.addEventListener('click', () => {
        sideSlider.classList.add('show');
    });

    // Hide side slider
    closeBtn.addEventListener('click', () => {
        sideSlider.classList.remove('show');
    });

    // Optional: Hide side slider if clicked outside
    document.addEventListener('click', (event) => {
        if (!sideSlider.contains(event.target) && !menuBtn.contains(event.target)) {
            sideSlider.classList.remove('show');
        }
    });
});
