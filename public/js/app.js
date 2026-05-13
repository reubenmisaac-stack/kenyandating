const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token');
let currentUserId = localStorage.getItem('userId');
let currentChatUserId = null;

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            authToken = data.token;
            currentUserId = data.userId;
            localStorage.setItem('token', authToken);
            localStorage.setItem('userId', currentUserId);
            showMainApp();
            showAlert('Login successful!', 'success');
        } else {
            showAlert(data.error || 'Login failed', 'error');
        }
    } catch (err) {
        showAlert('Error connecting to server', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const age = document.getElementById('register-age').value;
    const gender = document.getElementById('register-gender').value;
    const location = document.getElementById('register-location').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, age, gender, location })
        });

        const data = await res.json();

        if (res.ok) {
            authToken = data.token;
            currentUserId = data.userId;
            localStorage.setItem('token', authToken);
            localStorage.setItem('userId', currentUserId);
            showMainApp();
            showAlert('Registration successful!', 'success');
        } else {
            showAlert(data.error || 'Registration failed', 'error');
        }
    } catch (err) {
        showAlert('Error connecting to server', 'error');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        authToken = null;
        currentUserId = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        location.reload();
    }
}

function switchTab(tab) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
}

// Navigation
function showHome() {
    showSection('home-section');
    loadProfiles();
    updateNav('home');
}

function showMatches() {
    showSection('matches-section');
    loadMatches();
    updateNav('matches');
}

function showMessages() {
    showSection('messages-section');
    loadConversations();
    updateNav('messages');
}

function showProfile() {
    showSection('profile-section');
    loadUserProfile();
    updateNav('profile');
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function updateNav(active) {
    document.querySelectorAll('.nav-btn').forEach((btn, idx) => {
        if (idx < 4) btn.classList.remove('active-nav');
    });
    const tabs = ['home', 'matches', 'messages', 'profile'];
    const idx = tabs.indexOf(active);
    if (idx >= 0) document.querySelectorAll('.nav-btn')[idx].classList.add('active-nav');
}

// Show/Hide Main App
function showMainApp() {
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
    showHome();
}

// Profiles Functions
async function loadProfiles() {
    try {
        const res = await fetch(`${API_URL}/profiles`);
        const profiles = await res.json();

        const container = document.getElementById('profiles-container');
        if (profiles.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">😴</div><p>No profiles available</p></div>';
            return;
        }

        container.innerHTML = profiles.map(profile => `
            <div class="profile-card">
                <div class="profile-image">👤</div>
                <div class="profile-info">
                    <h3>${profile.name}, ${profile.age}</h3>
                    <p>📍 ${profile.location}</p>
                    <p>${profile.bio ? profile.bio.substring(0, 50) + '...' : 'No bio'}</p>
                </div>
                <div class="profile-actions">
                    <button class="like-btn" onclick="likeProfile(${profile.user_id})">❤️ Like</button>
                    <button class="message-btn" onclick="startChat(${profile.user_id}, '${profile.name}')">💬 Chat</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        showAlert('Error loading profiles', 'error');
    }
}

async function likeProfile(userId) {
    try {
        const res = await fetch(`${API_URL}/matches/like/${userId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (res.ok) {
            showAlert('Profile liked! 💕', 'success');
        } else {
            showAlert('Error liking profile', 'error');
        }
    } catch (err) {
        showAlert('Error', 'error');
    }
}

// Matches Functions
async function loadMatches() {
    try {
        const res = await fetch(`${API_URL}/matches`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const matches = await res.json();

        const container = document.getElementById('matches-container');
        if (matches.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💔</div><p>No matches yet. Start liking profiles!</p></div>';
            return;
        }

        container.innerHTML = matches.map(match => `
            <div class="match-item">
                <div class="match-info">
                    <h3>Match</h3>
                    <p>Status: ${match.status}</p>
                </div>
                <button class="btn btn-primary" style="width: 120px;" onclick="startChat(${match.user_id_2 === currentUserId ? match.user_id_1 : match.user_id_2}, 'User')">Message</button>
            </div>
        `).join('');
    } catch (err) {
        showAlert('Error loading matches', 'error');
    }
}

// Messages Functions
async function loadConversations() {
    try {
        const res = await fetch(`${API_URL}/matches`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const matches = await res.json();

        const container = document.getElementById('conversations-list');
        if (matches.length === 0) {
            container.innerHTML = '<div class="empty-state" style="padding: 20px;"><p>No conversations</p></div>';
            return;
        }

        container.innerHTML = matches.map(match => {
            const otherUserId = match.user_id_2 === currentUserId ? match.user_id_1 : match.user_id_2;
            return `
                <div class="conversation-item" onclick="startChat(${otherUserId}, 'User')">
                    <h4>User ${otherUserId}</h4>
                    <p>Click to chat</p>
                </div>
            `;
        }).join('');
    } catch (err) {
        showAlert('Error loading conversations', 'error');
    }
}

async function startChat(userId, userName) {
    currentChatUserId = userId;
    document.getElementById('chat-box').style.display = 'flex';
    loadChatMessages();
}

async function loadChatMessages() {
    if (!currentChatUserId) return;

    try {
        const res = await fetch(`${API_URL}/messages/${currentChatUserId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const messages = await res.json();

        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = messages.map(msg => `
            <div class="message ${msg.sender_id === currentUserId ? 'sent' : 'received'}">
                ${msg.message}
                <div class="message-time">${new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
            </div>
        `).join('');

        // Auto-scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (err) {
        console.error('Error loading messages', err);
    }
}

async function sendMessage() {
    if (!currentChatUserId) return;

    const input = document.getElementById('message-input');
    const message = input.value.trim();

    if (!message) return;

    try {
        const res = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ receiver_id: currentChatUserId, message })
        });

        if (res.ok) {
            input.value = '';
            loadChatMessages();
        } else {
            showAlert('Error sending message', 'error');
        }
    } catch (err) {
        showAlert('Error sending message', 'error');
    }
}

// Profile Functions
async function loadUserProfile() {
    try {
        const res = await fetch(`${API_URL}/profiles/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const profile = await res.json();

        if (profile.id) {
            document.getElementById('profile-name').value = profile.name || '';
            document.getElementById('profile-age').value = profile.age || '';
            document.getElementById('profile-gender').value = profile.gender || '';
            document.getElementById('profile-location').value = profile.location || '';
            document.getElementById('profile-bio').value = profile.bio || '';
            document.getElementById('profile-interests').value = profile.interests || '';
        }
    } catch (err) {
        console.error('Error loading profile', err);
    }
}

async function handleProfileSubmit(e) {
    e.preventDefault();

    const profileData = {
        name: document.getElementById('profile-name').value,
        age: parseInt(document.getElementById('profile-age').value),
        gender: document.getElementById('profile-gender').value,
        location: document.getElementById('profile-location').value,
        bio: document.getElementById('profile-bio').value,
        interests: document.getElementById('profile-interests').value
    };

    try {
        const res = await fetch(`${API_URL}/profiles/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(profileData)
        });

        if (res.ok) {
            showAlert('Profile updated successfully!', 'success');
        } else {
            showAlert('Error updating profile', 'error');
        }
    } catch (err) {
        showAlert('Error updating profile', 'error');
    }
}

// Alerts
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.insertBefore(alertDiv, document.body.firstChild);

    setTimeout(() => alertDiv.remove(), 3000);
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-form').addEventListener('submit', handleRegister);
document.getElementById('profile-form').addEventListener('submit', handleProfileSubmit);

// Load app on page load
window.addEventListener('load', () => {
    if (authToken && currentUserId) {
        showMainApp();
    }
});
