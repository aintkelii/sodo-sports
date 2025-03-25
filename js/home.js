document.addEventListener('DOMContentLoaded', function() {
    // Array to store all teams data
    let teamsData = [];
    
    // Form elements
    const organizationInput = document.getElementById('organization');
    const coachInput = document.getElementById('coach');
    const playerInput = document.getElementById('player');
    const injuryInput = document.getElementById('injury');
    const addBtn = document.getElementById('addBtn');
    const teamsContainer = document.getElementById('teamsContainer');
    
    // Add button click handler
    addBtn.addEventListener('click', function() {
        const orgName = organizationInput.value.trim();
        const coachName = coachInput.value.trim();
        const playerName = playerInput.value.trim();
        const injuryType = injuryInput.value;
        
        if (!orgName || !coachName || !playerName) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Check if organization already exists
        let team = teamsData.find(t => t.organization === orgName);
        
        if (!team) {
            // Create new team
            team = {
                organization: orgName,
                coach: coachName,
                players: []
            };
            teamsData.push(team);
        } else {
            // Update coach if different (optional)
            if (team.coach !== coachName) {
                team.coach = coachName;
            }
        }
        
        // Add player to team
        const player = {
            name: playerName,
            injury: injuryType
        };
        
        team.players.push(player);
        
        // Clear form inputs (except organization)
        coachInput.value = '';
        playerInput.value = '';
        injuryInput.value = '';
        
        // Update display
        renderTeams();
    });
    
    // Function to display all teams
    function renderTeams() {
        teamsContainer.innerHTML = '';
        
        if (teamsData.length === 0) {
            teamsContainer.innerHTML = '<p>No teams added yet.</p>';
            return;
        }
        
        teamsData.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            
            const header = document.createElement('h3');
            header.textContent = team.organization;
            
            const coachInfo = document.createElement('div');
            coachInfo.className = 'coach-info';
            coachInfo.textContent = `Coach: ${team.coach}`;
            
            const playerList = document.createElement('ul');
            playerList.className = 'player-list';
            
            team.players.forEach(player => {
                const playerItem = document.createElement('li');
                playerItem.className = 'player-item';
                
                if (player.injury) {
                    playerItem.classList.add('injured');
                    playerItem.textContent = `${player.name} (${player.injury})`;
                } else {
                    playerItem.textContent = player.name;
                }
                
                playerList.appendChild(playerItem);
            });
            
            teamCard.appendChild(header);
            teamCard.appendChild(coachInfo);
            teamCard.appendChild(playerList);
            
            teamsContainer.appendChild(teamCard);
        });
    }
    
    // Initial render
    renderTeams();
});