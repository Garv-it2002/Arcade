document.addEventListener("DOMContentLoaded", () => {
    fetch('data.csv')
        .then(response => response.text())
        .then(text => {
            const rows = text.split('\n').slice(1); // Skip the header
            const tableBody = document.querySelector('#profileTable tbody');

            // Parse the rows into an array of objects
            const data = rows.map(row => {
                const columns = row.split(',');
                if (columns.length < 12) return null; // Skip rows with insufficient columns

                const [userName, userEmail, profileURL, profileStatus, accessCodeStatus, milestoneEarned, skillBadges, arcadeGames, triviaGames] = columns;

                // Clean up text by removing quotes and trimming whitespace
                const cleanText = text => text.replace(/"/g, '').trim();

                const profileStatusClean = cleanText(profileStatus).toLowerCase();
                const profileStatusClass = profileStatusClean === 'all good' ? 'green' : 'red';
                const profileStatusSymbol = profileStatusClean === 'all good' ? '✔️' : '❌';

                const accessCodeClass = cleanText(accessCodeStatus).toLowerCase() === 'yes' ? 'green' : 'red';
                const accessCodeSymbol = cleanText(accessCodeStatus).toLowerCase() === 'yes' ? '✔️' : '❌';

                const skillBadgesCount = parseInt(cleanText(skillBadges), 10) || 0;
                const arcadeGamesCount = parseInt(cleanText(arcadeGames), 10) || 0;
                const triviaGamesCount = parseInt(cleanText(triviaGames), 10) || 0;
                const total = skillBadgesCount + arcadeGamesCount + triviaGamesCount;

                return {
                    userName: cleanText(userName),
                    profileURL: cleanText(profileURL),
                    profileStatus: profileStatusSymbol,
                    profileStatusClass,
                    accessCodeStatus: accessCodeSymbol,
                    accessCodeClass,
                    milestoneEarned: cleanText(milestoneEarned),
                    skillBadgesCount,
                    arcadeGamesCount,
                    triviaGamesCount,
                    total
                };
            }).filter(item => item !== null);

            // Sort data by total in descending order
            data.sort((a, b) => b.total - a.total);

            const goldMedal = document.querySelector('#goldMedal');
            const silverMedal = document.querySelector('#silverMedal');
            const bronzeMedal = document.querySelector('#bronzeMedal');

            if (data[0]) goldMedal.textContent = `${data[0].userName} (${data[0].total})`;
            if (data[1]) silverMedal.textContent = `${data[1].userName} (${data[1].total})`;
            if (data[2]) bronzeMedal.textContent = `${data[2].userName} (${data[2].total})`;

            // Add sorted data to the table
            data.forEach(item => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${item.userName}</td>
                        <td><a href="${item.profileURL}" target="_blank" class="launch-icon" aria-label="Launch Profile"><i class="fas fa-external-link-alt"></i></a></td>
                        <td class="${item.profileStatusClass}">${item.profileStatus}</td>
                        <td class="${item.accessCodeClass}">${item.accessCodeStatus}</td>
                        <td>${item.milestoneEarned}</td>
                        <td>${item.skillBadgesCount}</td>
                        <td>${item.arcadeGamesCount}</td>
                        <td>${item.triviaGamesCount}</td>
                        <td>${item.total}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error loading the CSV file:', error));
});
