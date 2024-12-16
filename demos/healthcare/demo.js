document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();

    // Patient search functionality
    const searchInput = document.querySelector('.patient-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const patients = document.querySelectorAll('.patient-card');
            
            patients.forEach(patient => {
                const name = patient.querySelector('.patient-name').textContent.toLowerCase();
                const id = patient.querySelector('.patient-id').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || id.includes(searchTerm)) {
                    patient.style.display = 'block';
                } else {
                    patient.style.display = 'none';
                }
            });
        });
    }

    // Appointment scheduling
    const scheduleButtons = document.querySelectorAll('.schedule-appointment');
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = this.getAttribute('data-patient-id');
            showScheduleModal(patientId);
        });
    });

    // Vital signs monitoring
    const vitalSigns = document.querySelectorAll('.vital-sign');
    vitalSigns.forEach(vital => {
        const value = parseInt(vital.getAttribute('data-value'));
        const max = parseInt(vital.getAttribute('data-max'));
        const min = parseInt(vital.getAttribute('data-min'));
        
        updateVitalSignStatus(vital, value, min, max);
    });

    // Medical records viewer
    const recordLinks = document.querySelectorAll('.view-record');
    recordLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const recordId = this.getAttribute('data-record-id');
            showMedicalRecord(recordId);
        });
    });

    // Charts initialization
    function initializeCharts() {
        const chartElements = document.querySelectorAll('.chart-container');
        chartElements.forEach(container => {
            const canvas = container.querySelector('canvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const type = container.getAttribute('data-chart-type');
            const data = JSON.parse(container.getAttribute('data-chart-data'));
            
            new Chart(ctx, {
                type: type,
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        });
    }

    // Schedule modal
    function showScheduleModal(patientId) {
        const modal = document.createElement('div');
        modal.className = 'schedule-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Schedule Appointment</h3>
                <p>Patient ID: ${patientId}</p>
                <input type="date" class="appointment-date">
                <input type="time" class="appointment-time">
                <button class="confirm-appointment">Confirm</button>
                <button class="cancel-appointment">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.confirm-appointment').addEventListener('click', function() {
            const date = modal.querySelector('.appointment-date').value;
            const time = modal.querySelector('.appointment-time').value;
            if (date && time) {
                showNotification(`Appointment scheduled for ${date} at ${time}`);
                modal.remove();
            }
        });
        
        modal.querySelector('.cancel-appointment').addEventListener('click', function() {
            modal.remove();
        });
    }

    // Medical record viewer
    function showMedicalRecord(recordId) {
        const modal = document.createElement('div');
        modal.className = 'record-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Medical Record</h3>
                <p>Record ID: ${recordId}</p>
                <div class="record-content">Loading...</div>
                <button class="close-record">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Simulate loading record data
        setTimeout(() => {
            modal.querySelector('.record-content').innerHTML = `
                <div class="record-section">
                    <h4>Patient History</h4>
                    <p>Sample medical history for record ${recordId}</p>
                </div>
                <div class="record-section">
                    <h4>Medications</h4>
                    <ul>
                        <li>Medication 1</li>
                        <li>Medication 2</li>
                    </ul>
                </div>
            `;
        }, 1000);
        
        modal.querySelector('.close-record').addEventListener('click', function() {
            modal.remove();
        });
    }

    // Vital signs status update
    function updateVitalSignStatus(element, value, min, max) {
        if (value < min) {
            element.classList.add('vital-low');
        } else if (value > max) {
            element.classList.add('vital-high');
        } else {
            element.classList.add('vital-normal');
        }
    }

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Code preview syntax highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
});
