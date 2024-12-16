document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();

    // Real-time updates simulation
    startRealtimeUpdates();

    // Barcode scanner simulation
    initializeBarcodeScanner();

    // Initialize inventory search
    initializeSearch();

    // Dashboard initialization
    function initializeDashboard() {
        updateStats();
        createCharts();
        loadInventoryTable();
    }

    // Stats update
    function updateStats() {
        const stats = {
            totalItems: 1234,
            lowStock: 23,
            pendingOrders: 45,
            recentActivity: 78
        };

        Object.entries(stats).forEach(([key, value]) => {
            const element = document.querySelector(`[data-stat="${key}"]`);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // Charts creation
    function createCharts() {
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
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        });
    }

    // Inventory table
    function loadInventoryTable() {
        const table = document.querySelector('.inventory-table');
        if (!table) return;

        // Simulate loading data
        const items = [
            { id: 'ITM001', name: 'Product 1', quantity: 50, status: 'In Stock' },
            { id: 'ITM002', name: 'Product 2', quantity: 5, status: 'Low Stock' },
            { id: 'ITM003', name: 'Product 3', quantity: 0, status: 'Out of Stock' }
        ];

        const tbody = table.querySelector('tbody');
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td class="quantity ${item.quantity < 10 ? 'low-stock' : ''}">${item.quantity}</td>
                <td>${item.status}</td>
                <td>
                    <button class="action-btn edit" data-item-id="${item.id}">Edit</button>
                    <button class="action-btn reorder" data-item-id="${item.id}">Reorder</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners to action buttons
        table.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const action = this.classList.contains('edit') ? 'edit' : 'reorder';
                handleItemAction(itemId, action);
            });
        });
    }

    // Real-time updates simulation
    function startRealtimeUpdates() {
        setInterval(() => {
            const randomStat = ['totalItems', 'lowStock', 'pendingOrders'][Math.floor(Math.random() * 3)];
            const element = document.querySelector(`[data-stat="${randomStat}"]`);
            if (element) {
                const currentValue = parseInt(element.textContent);
                const newValue = currentValue + (Math.random() > 0.5 ? 1 : -1);
                element.textContent = newValue;
                
                if (randomStat === 'lowStock' && newValue > 25) {
                    showNotification('Warning: Multiple items are running low on stock!', 'warning');
                }
            }
        }, 5000);
    }

    // Barcode scanner simulation
    function initializeBarcodeScanner() {
        const scannerInput = document.querySelector('.barcode-input');
        if (!scannerInput) return;

        scannerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const barcode = this.value;
                processBarcodeInput(barcode);
                this.value = '';
            }
        });
    }

    function processBarcodeInput(barcode) {
        showNotification(`Processing barcode: ${barcode}`, 'info');
        // Simulate processing delay
        setTimeout(() => {
            showNotification('Item scanned successfully!', 'success');
            updateStats();
        }, 1000);
    }

    // Search functionality
    function initializeSearch() {
        const searchInput = document.querySelector('.inventory-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.inventory-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Item action handler
    function handleItemAction(itemId, action) {
        if (action === 'edit') {
            showEditModal(itemId);
        } else if (action === 'reorder') {
            showReorderModal(itemId);
        }
    }

    // Edit modal
    function showEditModal(itemId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Edit Item</h3>
                <p>Item ID: ${itemId}</p>
                <form class="edit-form">
                    <div class="form-group">
                        <label>Quantity</label>
                        <input type="number" name="quantity" min="0">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" name="location">
                    </div>
                    <div class="form-actions">
                        <button type="submit">Save</button>
                        <button type="button" class="cancel">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Changes saved successfully!', 'success');
            modal.remove();
        });
        
        modal.querySelector('.cancel').addEventListener('click', function() {
            modal.remove();
        });
    }

    // Reorder modal
    function showReorderModal(itemId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Reorder Item</h3>
                <p>Item ID: ${itemId}</p>
                <form class="reorder-form">
                    <div class="form-group">
                        <label>Quantity to Order</label>
                        <input type="number" name="quantity" min="1">
                    </div>
                    <div class="form-group">
                        <label>Priority</label>
                        <select name="priority">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit">Place Order</button>
                        <button type="button" class="cancel">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Reorder placed successfully!', 'success');
            modal.remove();
        });
        
        modal.querySelector('.cancel').addEventListener('click', function() {
            modal.remove();
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
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
