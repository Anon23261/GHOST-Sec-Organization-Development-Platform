// Demo data
const patients = [
    { 
        id: 'P001', 
        name: 'John Smith', 
        age: 45,
        gender: 'Male',
        condition: 'Hypertension',
        lastVisit: '2024-01-15',
        nextVisit: '2024-02-15',
        vitalSigns: {
            bloodPressure: '120/80',
            heartRate: 72,
            temperature: 98.6,
            oxygenSaturation: 98
        }
    },
    { 
        id: 'P002', 
        name: 'Sarah Johnson', 
        age: 32,
        gender: 'Female',
        condition: 'Diabetes Type 2',
        lastVisit: '2024-01-20',
        nextVisit: '2024-02-20',
        vitalSigns: {
            bloodPressure: '118/75',
            heartRate: 68,
            temperature: 98.4,
            oxygenSaturation: 99
        }
    }
];

const appointments = [
    { id: 1, patientId: 'P001', date: '2024-02-15', time: '10:00 AM', type: 'Follow-up' },
    { id: 2, patientId: 'P002', date: '2024-02-20', time: '2:30 PM', type: 'Regular Checkup' }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    startRealtimeUpdates();
});

function initializeDashboard() {
    loadPatients();
    loadAppointments();
    updateStats();
    initializeCharts();
}

function loadPatients() {
    const patientList = document.querySelector('.patient-list');
    if (!patientList) return;

    patientList.innerHTML = patients.map(patient => `
        <div class="card patient-card" data-patient-id="${patient.id}">
            <div class="patient-header">
                <h3 class="patient-name">${patient.name}</h3>
                <span class="patient-id">${patient.id}</span>
            </div>
            <div class="patient-info">
                <div class="info-row">
                    <span><i class="fas fa-user"></i> ${patient.age} years, ${patient.gender}</span>
                    <span><i class="fas fa-heartbeat"></i> ${patient.condition}</span>
                </div>
                <div class="vital-signs">
                    <div class="vital-sign" data-value="${patient.vitalSigns.heartRate}" data-min="60" data-max="100">
                        <i class="fas fa-heart"></i>
                        <span>${patient.vitalSigns.heartRate} BPM</span>
                    </div>
                    <div class="vital-sign" data-value="${patient.vitalSigns.oxygenSaturation}" data-min="95" data-max="100">
                        <i class="fas fa-lungs"></i>
                        <span>${patient.vitalSigns.oxygenSaturation}% O2</span>
                    </div>
                    <div class="vital-sign" data-value="${patient.vitalSigns.temperature}" data-min="97" data-max="99">
                        <i class="fas fa-thermometer-half"></i>
                        <span>${patient.vitalSigns.temperature}°F</span>
                    </div>
                </div>
            </div>
            <div class="patient-actions">
                <button class="btn" onclick="viewPatientDetails('${patient.id}')">
                    <i class="fas fa-file-medical"></i> View Records
                </button>
                <button class="btn secondary" onclick="scheduleAppointment('${patient.id}')">
                    <i class="fas fa-calendar-plus"></i> Schedule
                </button>
            </div>
        </div>
    `).join('');

    // Initialize vital signs monitoring
    document.querySelectorAll('.vital-sign').forEach(vital => {
        const value = parseFloat(vital.getAttribute('data-value'));
        const min = parseFloat(vital.getAttribute('data-min'));
        const max = parseFloat(vital.getAttribute('data-max'));
        updateVitalSignStatus(vital, value, min, max);
    });
}

function loadAppointments() {
    const appointmentList = document.querySelector('.appointment-list');
    if (!appointmentList) return;

    appointmentList.innerHTML = appointments.map(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        return `
            <div class="appointment-card">
                <div class="appointment-time">
                    <i class="fas fa-clock"></i>
                    <span>${appointment.time}</span>
                </div>
                <div class="appointment-info">
                    <h4>${patient.name}</h4>
                    <p>${appointment.type}</p>
                    <span class="appointment-date">${appointment.date}</span>
                </div>
                <div class="appointment-actions">
                    <button class="btn" onclick="startAppointment(${appointment.id})">
                        <i class="fas fa-video"></i> Start
                    </button>
                    <button class="btn secondary" onclick="rescheduleAppointment(${appointment.id})">
                        <i class="fas fa-calendar-alt"></i> Reschedule
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const stats = {
        totalPatients: patients.length,
        appointmentsToday: appointments.filter(a => isToday(a.date)).length,
        criticalCases: patients.filter(p => isCritical(p.vitalSigns)).length,
        completedVisits: 45
    };

    Object.entries(stats).forEach(([key, value]) => {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) {
            element.textContent = value;
        }
    });
}

function initializeCharts() {
    const ctx = document.getElementById('patientStats');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Patient Visits',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#00ff00',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Patient Statistics'
                }
            }
        }
    });
}

function setupEventListeners() {
    const searchInput = document.querySelector('.patient-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterPatients(this.value);
        }, 300));
    }
}

function filterPatients(searchTerm) {
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const patientList = document.querySelector('.patient-list');
    if (!patientList) return;

    if (filteredPatients.length === 0) {
        patientList.innerHTML = '<div class="no-results">No patients found matching your search.</div>';
    } else {
        loadPatients();
    }
}

function viewPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.innerHTML = `
        <div class="modal-content slide-in">
            <div class="modal-header">
                <h2>Patient Records: ${patient.name}</h2>
                <button onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="patient-details">
                    <div class="detail-group">
                        <h3>Personal Information</h3>
                        <p><strong>ID:</strong> ${patient.id}</p>
                        <p><strong>Age:</strong> ${patient.age}</p>
                        <p><strong>Gender:</strong> ${patient.gender}</p>
                        <p><strong>Condition:</strong> ${patient.condition}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Vital Signs</h3>
                        <p><strong>Blood Pressure:</strong> ${patient.vitalSigns.bloodPressure}</p>
                        <p><strong>Heart Rate:</strong> ${patient.vitalSigns.heartRate} BPM</p>
                        <p><strong>Temperature:</strong> ${patient.vitalSigns.temperature}°F</p>
                        <p><strong>Oxygen Saturation:</strong> ${patient.vitalSigns.oxygenSaturation}%</p>
                    </div>
                    <div class="detail-group">
                        <h3>Appointments</h3>
                        <p><strong>Last Visit:</strong> ${patient.lastVisit}</p>
                        <p><strong>Next Visit:</strong> ${patient.nextVisit}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function scheduleAppointment(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.innerHTML = `
        <div class="modal-content slide-in">
            <div class="modal-header">
                <h2>Schedule Appointment: ${patient.name}</h2>
                <button onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <form id="appointmentForm" onsubmit="return saveAppointment(event, '${patientId}')">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" required min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <select name="time" required>
                            ${generateTimeSlots()}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <select name="type" required>
                            <option value="Regular Checkup">Regular Checkup</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Consultation">Consultation</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>
                    <button type="submit" class="btn">Schedule Appointment</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveAppointment(event, patientId) {
    event.preventDefault();
    const form = event.target;
    const newAppointment = {
        id: appointments.length + 1,
        patientId: patientId,
        date: form.date.value,
        time: form.time.value,
        type: form.type.value
    };
    
    appointments.push(newAppointment);
    loadAppointments();
    updateStats();
    
    showNotification('Appointment scheduled successfully', 'success');
    form.closest('.modal').remove();
    return false;
}

function startAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    const patient = patients.find(p => p.id === appointment.patientId);
    showNotification(`Starting virtual appointment with ${patient.name}...`, 'info');
    
    // Simulate starting a virtual appointment
    setTimeout(() => {
        window.location.href = `#appointment-${appointmentId}`;
    }, 500);
}

function rescheduleAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    const patient = patients.find(p => p.id === appointment.patientId);
    scheduleAppointment(patient.id);
}

function startRealtimeUpdates() {
    // Simulate real-time vital signs updates
    setInterval(() => {
        patients.forEach(patient => {
            // Randomly update vital signs within normal ranges
            patient.vitalSigns.heartRate = Math.floor(Math.random() * (100 - 60) + 60);
            patient.vitalSigns.oxygenSaturation = Math.floor(Math.random() * (100 - 95) + 95);
            patient.vitalSigns.temperature = (Math.random() * (99 - 97) + 97).toFixed(1);
        });
        loadPatients();
    }, 10000);
}

// Utility functions
function updateVitalSignStatus(element, value, min, max) {
    if (value < min || value > max) {
        element.classList.add('critical');
        element.setAttribute('data-tooltip', 'Abnormal value detected');
    } else {
        element.classList.remove('critical');
        element.removeAttribute('data-tooltip');
    }
}

function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
}

function isCritical(vitalSigns) {
    return (
        vitalSigns.heartRate < 60 || vitalSigns.heartRate > 100 ||
        vitalSigns.oxygenSaturation < 95 ||
        vitalSigns.temperature < 97 || vitalSigns.temperature > 99
    );
}

function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
        const hour12 = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        slots.push(`<option value="${hour12}:00 ${ampm}">${hour12}:00 ${ampm}</option>`);
        slots.push(`<option value="${hour12}:30 ${ampm}">${hour12}:30 ${ampm}</option>`);
    }
    return slots.join('');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} slide-in`;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
