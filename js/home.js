
const url = 'http:localhost:50000/'
fetch('http://localhost:50000/')
.then(reponse => response.json())
.then(data => {
    data.forEach(()=>{
        
    })
})
// Store players data
        let players = [];
        
        // DOM elements
        const form = document.getElementById('playerForm');
        const playersList = document.getElementById('playersList');
        
        // Form submit handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const player = {
                id: Date.now(), // Unique ID for each player
                fullName: document.getElementById('fullName').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                position: document.getElementById('position').value,
                jerseyNumber: document.getElementById('jerseyNumber').value,
                team: document.getElementById('team').value,
                coach: document.getElementById('coach').value,
                doctor: document.getElementById('doctor').value,
                medicalNotes: document.getElementById('medicalNotes').value,
                registrationDate: new Date().toLocaleString()
            };
            
            // Add to players array
            players.push(player);
            
            // Update display
            renderPlayersList();
            
            // Reset form
            form.reset();
            
            // Scroll to display section
            document.querySelector('.display-section').scrollIntoView({ behavior: 'smooth' });
        });
        
        // Render players list
        function renderPlayersList() {
            if (players.length === 0) {
                playersList.innerHTML = '<div class="no-players">No players registered yet</div>';
                return;
            }
            
            playersList.innerHTML = '';
            
            players.forEach((player) => {
                const playerCard = document.createElement('div');
                playerCard.className = 'player-card';
                
                playerCard.innerHTML = `
                    <button class="delete-btn" data-id="${player.id}">Delete</button>
                    <h3>${player.fullName} - #${player.jerseyNumber}</h3>
                    <div class="player-info">
                        <div class="info-item">
                            <strong>Team</strong>
                            ${player.team}
                        </div>
                        <div class="info-item">
                            <strong>Position</strong>
                            ${player.position}
                        </div>
                        <div class="info-item">
                            <strong>Coach</strong>
                            ${player.coach}
                        </div>
                        <div class="info-item">
                            <strong>Doctor</strong>
                            ${player.doctor}
                        </div>
                        <div class="info-item">
                            <strong>Date of Birth</strong>
                            ${new Date(player.dateOfBirth).toLocaleDateString()}
                        </div>
                        <div class="info-item">
                            <strong>Contact</strong>
                            ${player.phone}<br>
                            ${player.email}
                        </div>
                        ${player.address ? `
                        <div class="info-item">
                            <strong>Address</strong>
                            ${player.address}
                        </div>` : ''}
                        ${player.medicalNotes ? `
                        <div class="info-item">
                            <strong>Medical Notes</strong>
                            ${player.medicalNotes}
                        </div>` : ''}
                        <div class="info-item">
                            <strong>Registered On</strong>
                            ${player.registrationDate}
                        </div>
                    </div>
                `;
                
                playersList.appendChild(playerCard);
            });

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const playerId = parseInt(this.getAttribute('data-id'));
                    deletePlayer(playerId);
                });
            });
        }

        // Delete player function
        function deletePlayer(playerId) {
            if (confirm('Are you sure you want to delete this player?')) {
                players = players.filter(player => player.id !== playerId);
                renderPlayersList();
            }
        }

// Global variables
        let playersData = [];
        let currentEditId = null;
        
        // Fetch data from db.json and initialize the form
        document.addEventListener('DOMContentLoaded', function() {
            fetch('db.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Populate all dropdowns
                    populateDropdown('team', data.Organisation);
                    populateDropdown('coach', data.coach);
                    populateDropdown('injuryType', data.typeOfInjury);
                    populateDropdown('doctor', data.doctors);
                    populateDropdown('healingTime', data.timeTakenToHeal);
                    populateDropdown('doctorLocation', data.locationOfDoctor);
                    
                    // Load any existing data from localStorage
                    loadPlayers();
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    alert('Error loading form data. Please try again later.');
                });
            
            // Form submission handler
            document.getElementById('playerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                savePlayer();
            });
        });
        
        // Function to populate dropdowns
        function populateDropdown(elementId, data) {
            const dropdown = document.getElementById(elementId);
            dropdown.innerHTML = '';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `-- Select ${elementId.replace(/([A-Z])/g, ' $1').toLowerCase()} --`;
            defaultOption.selected = true;
            defaultOption.disabled = true;
            dropdown.appendChild(defaultOption);
            
            // Add data options
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                dropdown.appendChild(option);
            });
        }
        
        // Function to save player data
        function savePlayer() {
            const player = {
                id: currentEditId || Date.now().toString(),
                name: document.getElementById('playerName').value,
                team: document.getElementById('team').options[document.getElementById('team').selectedIndex].text,
                teamId: document.getElementById('team').value,
                coach: document.getElementById('coach').options[document.getElementById('coach').selectedIndex].text,
                coachId: document.getElementById('coach').value,
                injuryType: document.getElementById('injuryType').options[document.getElementById('injuryType').selectedIndex].text,
                injuryTypeId: document.getElementById('injuryType').value,
                doctor: document.getElementById('doctor').options[document.getElementById('doctor').selectedIndex].text,
                doctorId: document.getElementById('doctor').value,
                healingTime: document.getElementById('healingTime').options[document.getElementById('healingTime').selectedIndex].text,
                healingTimeId: document.getElementById('healingTime').value,
                doctorLocation: document.getElementById('doctorLocation').options[document.getElementById('doctorLocation').selectedIndex].text,
                doctorLocationId: document.getElementById('doctorLocation').value
            };
            
            if (currentEditId) {
                // Update existing player
                const index = playersData.findIndex(p => p.id === currentEditId);
                if (index !== -1) {
                    playersData[index] = player;
                }
                currentEditId = null;
            } else {
                // Add new player
                playersData.push(player);
            }
            
            // Save to localStorage
            localStorage.setItem('playersData', JSON.stringify(playersData));
            
            // Refresh the table
            loadPlayers();
            
            // Reset the form
            document.getElementById('playerForm').reset();
        }
        
        // Function to load players from localStorage and display in table
        function loadPlayers() {
            const savedData = localStorage.getItem('playersData');
            if (savedData) {
                playersData = JSON.parse(savedData);
            }
            
            const tbody = document.querySelector('#playersTable tbody');
            tbody.innerHTML = '';
            
            playersData.forEach(player => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${player.name}</td>
                    <td>${player.team}</td>
                    <td>${player.coach}</td>
                    <td>${player.injuryType}</td>
                    <td>${player.doctor}</td>
                    <td>${player.healingTime}</td>
                    <td>${player.doctorLocation}</td>
                    <td>
                        <button class="edit" data-id="${player.id}">Edit</button>
                        <button class="delete" data-id="${player.id}">Delete</button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit').forEach(button => {
                button.addEventListener('click', function() {
                    editPlayer(this.getAttribute('data-id'));
                });
            });
            
            document.querySelectorAll('.delete').forEach(button => {
                button.addEventListener('click', function() {
                    deletePlayer(this.getAttribute('data-id'));
                });
            });
        }
        
        // Function to edit a player
        function editPlayer(id) {
            const player = playersData.find(p => p.id === id);
            if (player) {
                currentEditId = player.id;
                document.getElementById('playerName').value = player.name;
                document.getElementById('team').value = player.teamId;
                document.getElementById('coach').value = player.coachId;
                document.getElementById('injuryType').value = player.injuryTypeId;
                document.getElementById('doctor').value = player.doctorId;
                document.getElementById('healingTime').value = player.healingTimeId;
                document.getElementById('doctorLocation').value = player.doctorLocationId;
                
                // Scroll to form
                document.getElementById('playerForm').scrollIntoView();
            }
        }
        
        // Function to delete a player
        function deletePlayer(id) {
            if (confirm('Are you sure you want to delete this player?')) {
                playersData = playersData.filter(p => p.id !== id);
                localStorage.setItem('playersData', JSON.stringify(playersData));
                loadPlayers();
            }
        }

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
 // DOM elements
        const playerNameInput = document.getElementById('playerName');
        const organizationSelect = document.getElementById('organization');
        const coachSelect = document.getElementById('coach');
        const doctorSelect = document.getElementById('doctor');
        const addBtn = document.getElementById('addBtn');
        const clearBtn = document.getElementById('clearBtn');
        const entriesList = document.getElementById('entriesList');
        
        // Data storage
        let organizations = [];
        let coaches = [];
        let doctors = [];
        let playerEntries = [];
        
        // Fetch data from JSON
        async function fetchData() {
            try {
                const response = await fetch('db.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                
                // Store the data
                organizations = data.Organisation;
                coaches = data.coach;
                doctors = data.doctors;
                
                // Populate dropdowns
                populateDropdown(organizationSelect, organizations);
                populateDropdown(coachSelect, coaches);
                populateDropdown(doctorSelect, doctors);
                
                // Load any existing entries
                loadEntries();
                
            } catch (error) {
                console.error('Error fetching data:', error);
                entriesList.innerHTML = '<p class="error">Failed to load data. Please refresh the page.</p>';
            }
        }
        
        // Populate dropdown with data
        function populateDropdown(dropdown, data) {
            dropdown.innerHTML = `<option value="">Select ${dropdown.id}</option>`;
            
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                dropdown.appendChild(option);
            });
        }
        
        // Add new player entry
        function addPlayerEntry() {
            const playerName = playerNameInput.value.trim();
            const organizationId = organizationSelect.value;
            const coachId = coachSelect.value;
            const doctorId = doctorSelect.value;
            
            if (!playerName || !organizationId || !coachId || !doctorId) {
                alert('Please fill in all fields');
                return;
            }
            
            // Find selected options
            const organization = organizations.find(org => org.id == organizationId);
            const coach = coaches.find(c => c.id == coachId);
            const doctor = doctors.find(d => d.id == doctorId);
            
            // Create new entry
            const newEntry = {
                id: Date.now(), // Simple unique ID
                playerName,
                organization,
                coach,
                doctor,
                date: new Date().toLocaleString()
            };
            
            // Add to entries array
            playerEntries.push(newEntry);
            
            // Update display and local storage
            renderEntries();
            saveEntries();
            
            // Clear form
            clearForm();
        }
        
        // Delete player entry
        function deletePlayerEntry(id) {
            if (confirm('Are you sure you want to delete this entry?')) {
                playerEntries = playerEntries.filter(entry => entry.id !== id);
                renderEntries();
                saveEntries();
            }
        }
        
        // Render all entries
        function renderEntries() {
            if (playerEntries.length === 0) {
                entriesList.innerHTML = '<p>No players registered yet.</p>';
                return;
            }
            
            entriesList.innerHTML = '';
            
            playerEntries.forEach(entry => {
                const entryCard = document.createElement('div');
                entryCard.className = 'entry-card';
                
                entryCard.innerHTML = `
                    <div class="entry-info">
                        <p><strong>Player:</strong> ${entry.playerName}</p>
                        <p><strong>Team:</strong> ${entry.organization.name}</p>
                        <p><strong>Coach:</strong> ${entry.coach.name}</p>
                        <p><strong>Doctor:</strong> ${entry.doctor.name}</p>
                        <p><small>Registered: ${entry.date}</small></p>
                    </div>
                    <div class="entry-actions">
                        <button class="delete" onclick="deletePlayerEntry(${entry.id})">Delete</button>
                    </div>
                `;
                
                entriesList.appendChild(entryCard);
            });
        }
        
        // Clear form
        function clearForm() {
            playerNameInput.value = '';
            organizationSelect.value = '';
            coachSelect.value = '';
            doctorSelect.value = '';
            playerNameInput.focus();
        }
        
        // Save entries to localStorage
        function saveEntries() {
            localStorage.setItem('playerEntries', JSON.stringify(playerEntries));
        }
        
        // Load entries from localStorage
        function loadEntries() {
            const savedEntries = localStorage.getItem('playerEntries');
            if (savedEntries) {
                playerEntries = JSON.parse(savedEntries);
                renderEntries();
            }
        }
        
        // Event listeners
        addBtn.addEventListener('click', addPlayerEntry);
        clearBtn.addEventListener('click', clearForm);
        
        // Initialize
        document.addEventListener('DOMContentLoaded', fetchData);
        
        // Make delete function available globally
        window.deletePlayerEntry = deletePlayerEntry;