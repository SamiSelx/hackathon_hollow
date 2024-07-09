const apiUrl = 'http://localhost:3000/api';
        let token = '';

        async function register() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = 'user'

            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, role })
            });
        const data = await response.json()
        console.log(data)
            if (response.ok) {
                alert('User registered successfully');
            } else {
                alert('Error registering user');
            }
        }

        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                token = data.token;
                alert('Login successful');
                document.getElementById('auth-section').style.display = 'none';
                document.getElementById('voting-section').style.display = 'block';
                loadCandidates();
            } else {
                alert('Error logging in');
            }
        }

        async function loadCandidates() {
            const response = await fetch(`${apiUrl}/candidates`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const candidates = await response.json();
            const candidatesList = document.getElementById('candidates-list');
            candidatesList.innerHTML = '';
            
            candidates.message.forEach(candidate => {
                const li = document.createElement('li');
                li.textContent = `${candidate.username} (${candidate.votes} votes)`;
                const voteButton = document.createElement('button');
                voteButton.textContent = 'Vote';
                voteButton.onclick = () => vote(candidate._id);
                li.appendChild(voteButton);
                voteButton.id='vote'
                candidatesList.appendChild(li);
            });
        }

        async function vote(candidateId) {
            const response = await fetch(`${apiUrl}/votes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ candidateId })
            });

            if (response.ok) {
                alert('Vote registered successfully');
                loadCandidates();
            } else {
                alert('Error voting');
            }
        }

        function logout() {
            token = '';
            document.getElementById('auth-section').style.display = 'block';
            document.getElementById('voting-section').style.display = 'none';
        }
