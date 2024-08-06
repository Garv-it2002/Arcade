document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name');

    fetch('data.csv')
        .then(response => response.text())
        .then(text => {
            const parseCSV = (csv) => {
                const rows = csv.split('\n').slice(1);
                const results = [];

                rows.forEach(row => {
                    const regex = /(?:,|\n)(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
                    const fields = row.split(regex).map(field => field.replace(/^"|"$/g, '').trim());

                    if (fields.length < 12) return;

                    const [userNameCsv, userEmail, profileURL, profileStatus, accessCodeStatus, milestoneEarned, skillBadges, bname, arcadeGames, agname, triviaGames, tgname] = fields;

                    results.push({
                        userName: userNameCsv,
                        userEmail,
                        profileURL,
                        profileStatus,
                        accessCodeStatus,
                        milestoneEarned,
                        skillBadges,
                        bname,
                        arcadeGames,
                        agname,
                        triviaGames,
                        tgname,
                    });
                });

                return results;
            };

            const data = parseCSV(text);

            const contestant = data.find(item => item.userName === userName);
            if (contestant) {
                // Split arcadeGames by "|"
                const arcadeGamesList = contestant.bname.split('|').map(game => game.trim());
                const arcadeGamestriviaList = contestant.tgname.split('|').map(game => game.trim());
                const arcadeGamesgameList = contestant.agname.split('|').map(game => game.trim());

                // Create table rows for arcadeGames with serial numbers
                const arcadeGamesRows = arcadeGamesList.map((game, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${game}</td>
                    </tr>
                `).join('');

                const arcadeGamestriviaRows = arcadeGamestriviaList.map((game, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${game}</td>
                    </tr>
                `).join('');

                const arcadeGamesgameRows = arcadeGamesgameList.map((game, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${game}</td>
                    </tr>
                `).join('');

                document.querySelector('#contestantDetails').innerHTML = `
                    <h1><b><u>${contestant.userName}</u></b></h1>
                    <hr>
                    <table>
                        <tr>
                            <td>
                                <p><strong>Email:</strong> ${contestant.userEmail}</p>
                            </td>
                            <td>
                                <p><strong>Profile URL:</strong> <a href="${contestant.profileURL}" target="_blank" class="launch-icon" aria-label="Launch Profile"><i class="fas fa-external-link-alt"></i></a></p>
                            </td>
                            <td>
                                <p><strong>Profile Status:</strong> ${contestant.profileStatus}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p><strong>Access Code Redemption Status:</strong> ${contestant.accessCodeStatus}</p>
                            </td>
                            <td>
                                <p><strong>Milestones:</strong> ${contestant.milestoneEarned}</p>
                            </td>
                            <td>
                                <p><strong>Skill Badges:</strong> ${contestant.skillBadges}</p>
                            </td>
                        </tr>
                    </table><br>
                    <hr>
                    <h2><b><u>Badges breakdown</u></b></h2>
                    <table>
                    <thead>
                    <tr>
                    <th>Number of Arcade games completed</th>
                    <th>Number of Trivia games completed</th>
                    </tr></thead>
                    <tr>
                    <td>${contestant.arcadeGames}</td>
                    <td>${contestant.triviaGames}</td>
                    </tr>
                    </table>
                    <b><u><h2>Badges</h2></u></b>
                    <table>
                        <thead>
                            <tr>
                                <th>SL.No.</th>
                                <th>Skill Badge</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${arcadeGamesRows}
                        </tbody>
                    </table><hr>
                                        <table>
                        <thead>
                            <tr>
                                <th>SL.No.</th>
                                <th>Trivia Badge</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${arcadeGamestriviaRows}
                        </tbody>
                    </table><hr>
                                        <table>
                        <thead>
                            <tr>
                                <th>SL.No.</th>
                                <th>Game Badge</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${arcadeGamesgameRows}
                        </tbody>
                    </table>
                `;
            } else {
                document.querySelector('#contestantDetails').innerHTML = `<p>Contestant not found.</p>`;
            }
        })
        .catch(error => console.error('Error loading the CSV file:', error));
});
