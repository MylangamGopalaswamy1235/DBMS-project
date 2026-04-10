const API_BASE = 'http://localhost:5000/api';

// Auth and Init
function initApp() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
}

// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('loginError');

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'dashboard.html';
            } else {
                errorEl.textContent = data.error || 'Login failed';
                errorEl.classList.remove('hidden');
            }
        } catch (err) {
            errorEl.textContent = 'Server error. Is the backend running?';
            errorEl.classList.remove('hidden');
        }
    });
}

// Fetch Doctors for Dashboard
async function fetchDoctors() {
    try {
        const res = await fetch(`${API_BASE}/doctors`);
        const doctors = await res.json();
        
        const tbody = document.querySelector('#doctorsTable tbody');
        if (tbody) {
            tbody.innerHTML = '';
            doctors.forEach(doc => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${doc.id}</td>
                    <td><strong>${doc.name}</strong></td>
                    <td>${doc.specialization}</td>
                    <td>${doc.experience_years}</td>
                    <td><a href="report.html?id=${doc.id}" class="btn" style="padding: 0.5rem 1rem; font-size: 0.875rem;">View Report</a></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Failed to fetch doctors', err);
    }
}

// Populate Select for Feedback
async function populateDoctorsSelect() {
    try {
        const res = await fetch(`${API_BASE}/doctors`);
        const doctors = await res.json();
        
        const select = document.getElementById('doctor_id');
        if (select) {
            select.innerHTML = '<option value="">-- Select a Doctor --</option>';
            doctors.forEach(doc => {
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${doc.name} (${doc.specialization})`;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error('Failed to load doctors', err);
    }
}

// Submit Feedback logic
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            doctor_id: document.getElementById('doctor_id').value,
            patient_name: document.getElementById('patient_name').value,
            patient_contact: document.getElementById('patient_contact').value,
            rating: parseInt(document.getElementById('rating').value),
            treatment_result: document.getElementById('treatment_result').value,
            comments: document.getElementById('comments').value
        };

        try {
            const res = await fetch(`${API_BASE}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (res.ok) {
                alert('Feedback submitted successfully!');
                feedbackForm.reset();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            alert('Server error while submitting feedback.');
        }
    });
}

// Fetch Report
async function fetchReport(doctorId) {
    try {
        const res = await fetch(`${API_BASE}/reports/${doctorId}`);
        const data = await res.json();
        
        if (res.ok) {
            document.getElementById('doctorNameTitle').textContent = `Performance Report: ${data.doctor.name}`;
            document.getElementById('totalReview').textContent = data.stats.total_feedback;
            document.getElementById('avgRating').textContent = `${data.stats.average_rating} / 5`;
            
            const tbody = document.querySelector('#feedbackTable tbody');
            tbody.innerHTML = '';
            
            const ratingCounts = {1:0, 2:0, 3:0, 4:0, 5:0};

            data.feedbacks.forEach(f => {
                ratingCounts[f.rating] = (ratingCounts[f.rating] || 0) + 1;
                
                const tr = document.createElement('tr');
                const dateStr = new Date(f.created_at).toLocaleDateString();
                tr.innerHTML = `
                    <td>${f.patient_name}</td>
                    <td>${'⭐'.repeat(f.rating)}</td>
                    <td>${f.treatment_result}</td>
                    <td>${f.comments || '-'}</td>
                    <td>${dateStr}</td>
                `;
                tbody.appendChild(tr);
            });

            renderChart(ratingCounts);
            
        } else {
            alert(data.error || 'Failed to fetch report');
        }
    } catch (err) {
        console.error('Error fetching report', err);
    }
}

let chartInstance = null;
function renderChart(ratingCounts) {
    const ctx = document.getElementById('ratingChart');
    if (!ctx) return;
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [{
                label: 'Number of Ratings',
                data: [ratingCounts[1], ratingCounts[2], ratingCounts[3], ratingCounts[4], ratingCounts[5]],
                backgroundColor: [
                    '#ef4444',
                    '#f97316',
                    '#eab308',
                    '#84cc16',
                    '#10b981'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}
