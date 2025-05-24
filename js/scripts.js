// Pomegranate Trade Dashboard - JavaScript with Real-time Data Simulation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dropdowns
    initializeDropdowns();
    
    // Initialize charts
    initializeTradeChart();
    initializeSeasonalityChart();
    
    // Initialize sparklines
    initializeSparklines();
    
    // Start real-time data simulation
    startRealTimeDataSimulation();
    
    // Auto-scroll summary cards on mobile
    autoScrollSummaryStrip();
});

// Dropdown functionality
function initializeDropdowns() {
    // Bootstrap dropdowns are automatically initialized with Bootstrap's JS
    
    // Add event listeners for dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownButton = this.closest('.dropdown').querySelector('.dropdown-toggle');
            const buttonText = dropdownButton.textContent.split(':')[0];
            dropdownButton.textContent = `${buttonText}: ${this.textContent.trim()}`;
            
            // Trigger data refresh when filters change
            refreshDashboardData();
        });
    });
}

// Real-time data simulation
function startRealTimeDataSimulation() {
    // Initial data load
    refreshDashboardData();
    
    // Set up periodic updates (every 30 seconds)
    setInterval(function() {
        refreshDashboardData();
    }, 30000);
    
    // Set up more frequent status updates (every 10 seconds)
    setInterval(function() {
        updateStatuses();
    }, 10000);
}

// Refresh all dashboard data
function refreshDashboardData() {
    updateSummaryCards();
    updateTradeData();
    updateMarketPrices();
    updateTradeChart();
    updateSeasonalityChart();
    updateYOYGrowth();
    updateTradeSnapshotVolumes();
}

// Generate simulated data based on current date/time
function generateSimulatedData() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const date = now.getDate();
    const month = now.getMonth(); // 0 = January, 11 = December
    
    // Base values for different countries
    const baseValues = {
        'Peru': 12.45,
        'Spain': 14.20,
        'South Africa': 11.80
    };
    
    // Seasonal factors (higher in winter months for northern hemisphere)
    const seasonalFactor = (month >= 9 || month <= 2) ? 1.2 : 0.9;
    
    // Day of week factor (lower on weekends)
    const dayFactor = (day === 0 || day === 6) ? 0.95 : 1.05;
    
    // Time of day factor (higher during business hours)
    const timeFactor = (hour >= 9 && hour <= 17) ? 1.1 : 0.95;
    
    // Random fluctuation factor
    const fluctuation = () => 0.95 + Math.random() * 0.1;
    
    // Calculate current values with all factors
    const currentValues = {};
    for (const country in baseValues) {
        currentValues[country] = baseValues[country] * seasonalFactor * dayFactor * timeFactor * fluctuation();
    }
    
    // Calculate percentage changes (compared to "previous" values)
    const percentageChanges = {};
    for (const country in baseValues) {
        // Simulate previous value (with less volatility)
        const prevValue = baseValues[country] * seasonalFactor * (dayFactor * 0.99) * (timeFactor * 0.99) * (0.97 + Math.random() * 0.06);
        percentageChanges[country] = ((currentValues[country] - prevValue) / prevValue) * 100;
    }
    
    // Generate trade volumes based on current values
    const tradeVolumes = {};
    for (const country in baseValues) {
        tradeVolumes[country] = Math.round(currentValues[country] * 1000 * (0.9 + Math.random() * 0.2));
    }
    
    // Generate market status based on time
    const marketStatus = {};
    for (const country in baseValues) {
        // Fresh during business hours, otherwise older
        if (hour >= 9 && hour <= 17) {
            marketStatus[country] = 'fresh';
        } else if (hour >= 6 && hour <= 20) {
            marketStatus[country] = 'old';
        } else {
            marketStatus[country] = 'updating';
        }
    }
    
    // Last update timestamps
    const lastUpdate = {};
    for (const country in baseValues) {
        if (marketStatus[country] === 'fresh') {
            lastUpdate[country] = formatDate(now);
        } else if (marketStatus[country] === 'old') {
            const oldDate = new Date(now);
            oldDate.setDate(oldDate.getDate() - 3);
            lastUpdate[country] = formatDate(oldDate);
        } else {
            lastUpdate[country] = '--';
        }
    }
    
    return {
        values: currentValues,
        percentages: percentageChanges,
        volumes: tradeVolumes,
        status: marketStatus,
        lastUpdate: lastUpdate,
        timestamp: now
    };
}

// Format date as DD MMM YYYY
function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
}

// Update summary cards with simulated data
function updateSummaryCards() {
    const data = generateSimulatedData();
    const summaryCards = document.querySelectorAll('.summary-card');
    
    summaryCards.forEach((card, index) => {
        const cardTitle = card.querySelector('.card-title');
        const country = cardTitle.textContent.split('in ')[1];
        
        if (country && data.percentages[country]) {
            const percentageElement = card.querySelector('.status-up, .status-down');
            const percentage = data.percentages[country].toFixed(2);
            const isPositive = percentage >= 0;
            
            // Update percentage value and class
            percentageElement.innerHTML = `<i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i> ${isPositive ? '+' : ''}${percentage}%`;
            percentageElement.className = isPositive ? 'status-up' : 'status-down';
            
            // Add animation effect for changes
            card.classList.add('data-updated');
            setTimeout(() => {
                card.classList.remove('data-updated');
            }, 1000);
        }
    });
}

// Update trade data with simulated values
function updateTradeData() {
    const data = generateSimulatedData();
    const tableRows = document.querySelectorAll('.table tbody tr');
    
    tableRows.forEach((row, index) => {
        const country = row.querySelector('td:nth-child(2)').textContent;
        
        if (country && data.volumes[country]) {
            // Update trade values
            const sharesValue = Math.round(data.volumes[country] * 0.01);
            const overallValue = Math.round(data.volumes[country] * 100);
            const importValue = Math.round(data.volumes[country] * 0.01);
            const marketValue = Math.round(data.volumes[country] * 100);
            
            row.querySelector('td:nth-child(3)').textContent = `$${sharesValue.toLocaleString()}`;
            row.querySelector('td:nth-child(4)').textContent = `$${overallValue.toLocaleString()}`;
            row.querySelector('td:nth-child(5)').textContent = `$${importValue.toLocaleString()}`;
            row.querySelector('td:nth-child(6)').textContent = `$${marketValue.toLocaleString()}`;
            
            // Update growth percentage
            const growthCell = row.querySelector('td:nth-child(7)');
            const growthValue = (index % 2 === 0) ? 
                (data.percentages[country] * 1.2).toFixed(1) : 
                (data.percentages[country] * -0.8).toFixed(1);
            const isPositive = growthValue >= 0;
            
            growthCell.textContent = `${isPositive ? '+' : ''}${growthValue}%`;
            growthCell.className = isPositive ? 'growth-positive' : 'growth-negative';
            
            // Add animation effect
            row.classList.add('data-updated');
            setTimeout(() => {
                row.classList.remove('data-updated');
            }, 1000);
        }
    });
}

// Update market prices with simulated data
function updateMarketPrices() {
    const data = generateSimulatedData();
    const priceRows = document.querySelectorAll('.table:nth-of-type(2) tbody tr');
    
    priceRows.forEach((row, index) => {
        const country = row.querySelector('td:nth-child(1)').textContent;
        
        if (country && data.values[country]) {
            // Update price value
            const priceCell = row.querySelector('td:nth-child(3)');
            const price = data.values[country].toFixed(2);
            priceCell.textContent = `$${parseFloat(price).toLocaleString()}`;
            
            // Update last update date
            const dateCell = row.querySelector('td:nth-child(4)');
            dateCell.textContent = data.lastUpdate[country];
            
            // Update status
            const statusCell = row.querySelector('td:nth-child(5)');
            const status = data.status[country];
            let statusHTML = '';
            
            if (status === 'fresh') {
                statusHTML = '<span class="status-fresh"><i class="fas fa-circle"></i> Fresh</span>';
            } else if (status === 'old') {
                statusHTML = '<span class="status-old"><i class="fas fa-circle"></i> 3 day old</span>';
            } else {
                statusHTML = '<span class="status-updating"><i class="fas fa-circle"></i> Updating</span>';
            }
            
            statusCell.innerHTML = statusHTML;
            
            // Update change percentage
            const changeCell = row.querySelector('td:nth-child(6)');
            const changeValue = data.percentages[country].toFixed(2);
            const isPositive = changeValue >= 0;
            
            changeCell.textContent = `${isPositive ? '+' : ''}${changeValue}%`;
            changeCell.className = isPositive ? 'growth-positive' : 'growth-negative';
            
            // Update trend
            const trendCell = row.querySelector('td:nth-child(7)');
            trendCell.innerHTML = `<span class="trend-${isPositive ? 'up' : 'down'}"></span>`;
            
            // Add animation effect
            row.classList.add('data-updated');
            setTimeout(() => {
                row.classList.remove('data-updated');
            }, 1000);
        }
    });
}

// Update Year-on-Year Growth with random data
function updateYOYGrowth() {
    const yoyItems = document.querySelectorAll('.yoy-item');

    yoyItems.forEach(item => {
        const growthValueElement = item.querySelector('.growth-value');
        if (growthValueElement) {
            // Generate a random percentage between -15 and +15 (adjust range as needed)
            const randomGrowth = (Math.random() * 30 - 15).toFixed(1);
            const isPositive = parseFloat(randomGrowth) >= 0;

            // Update text content
            growthValueElement.textContent = `${isPositive ? '+' : ''}${randomGrowth}%`;

            // Update class for styling and sparkline
            growthValueElement.classList.remove('growth-positive', 'growth-negative');
            growthValueElement.classList.add(isPositive ? 'growth-positive' : 'growth-negative');
        }
    });
    // Re-initialize sparklines after updating values and classes
    initializeSparklines();
}

// Update Trade Snapshot volumes with random data
function updateTradeSnapshotVolumes() {
    const totalExportVolumeElement = document.getElementById('totalExportVolume');
    const totalImportVolumeElement = document.getElementById('totalImportVolume');

    if (totalExportVolumeElement && totalImportVolumeElement) {
        // Generate random volumes (adjust range as needed)
        const randomExportVolume = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
        const randomImportVolume = Math.floor(Math.random() * (18000 - 4000 + 1)) + 4000;

        // Update text content with comma formatting
        totalExportVolumeElement.textContent = randomExportVolume.toLocaleString();
        totalImportVolumeElement.textContent = randomImportVolume.toLocaleString();
    }
}

// Trade Data Chart
function initializeTradeChart() {
    const ctx = document.getElementById('tradeChart');
    
    if (!ctx) return;
    
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    // Generate realistic seasonal data
    const importData = generateSeasonalData(10, 15, 0.3);
    const exportData = generateSeasonalData(8, 12, 0.25);
    
        const isMobile = window.innerWidth <= 576;
    
    window.tradeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Import',
                    data: importData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        borderWidth: 3,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Export',
                    data: exportData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 24 // extra space for x-axis labels
                    }
                },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString() + 'M';
                            },
                            font: {
                                size: isMobile ? 10 : 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                        },
                        ticks: {
                            font: {
                                size: isMobile ? 10 : 12
                            },
                            maxRotation: isMobile ? 45 : 0,
                            minRotation: isMobile ? 45 : 0
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toLocaleString() + 'M';
                        }
                    }
                }
            }
        }
    });
    
    // Add event listeners for trade type radio buttons
    const importRadio = document.getElementById('importRadio');
    const exportRadio = document.getElementById('exportRadio');
    
    if (importRadio && exportRadio) {
        importRadio.addEventListener('change', function() {
            // Update chart or data display for import
            updateTradeChart('import');
        });
        
        exportRadio.addEventListener('change', function() {
            // Update chart or data display for export
            updateTradeChart('export');
        });
    }
}

// Update trade chart with new data
function updateTradeChart(type) {
    if (!window.tradeChart) return;
    
    const chart = window.tradeChart;
    const now = new Date();
    const currentMonth = now.getMonth();
    
    // Generate new data with slight variations
    const importData = generateSeasonalData(10, 15, 0.3);
    const exportData = generateSeasonalData(8, 12, 0.25);
    
    // Highlight current month with slightly higher values
    importData[currentMonth] = importData[currentMonth] * 1.05;
    exportData[currentMonth] = exportData[currentMonth] * 1.05;
    
    // Update chart data
    chart.data.datasets[0].data = importData;
    chart.data.datasets[1].data = exportData;
    
    // If type is specified, highlight that dataset
    if (type === 'import') {
        chart.data.datasets[0].borderWidth = 3;
        chart.data.datasets[1].borderWidth = 1;
    } else if (type === 'export') {
        chart.data.datasets[0].borderWidth = 1;
        chart.data.datasets[1].borderWidth = 3;
    }
    
    chart.update();
}

// Generate seasonal data with realistic patterns
function generateSeasonalData(min, max, volatility) {
    const data = [];
    const range = max - min;
    
    // Create a seasonal pattern (higher in middle months)
    for (let i = 0; i < 12; i++) {
        // Base seasonal pattern (bell curve)
        let seasonalFactor;
        if (i < 6) {
            seasonalFactor = 0.7 + (i * 0.06);
        } else {
            seasonalFactor = 1 - ((i - 6) * 0.06);
        }
        
        // Add randomness
        const randomFactor = 1 - volatility/2 + Math.random() * volatility;
        
        // Calculate value
        const value = min + (range * seasonalFactor * randomFactor);
        data.push(parseFloat(value.toFixed(2)));
    }
    
    return data;
}

// Seasonality Chart
function initializeSeasonalityChart() {
    const ctx = document.getElementById('seasonalityChart');
    
    if (!ctx) return;
    
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    // Generate realistic seasonal data for each country
    const peruData = generateCountrySeasonalData('Peru');
    const spainData = generateCountrySeasonalData('Spain');
    const southAfricaData = generateCountrySeasonalData('South Africa');

    // Detect mobile
    const isMobile = window.innerWidth <= 576;
    
    window.seasonalityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Peru',
                    data: peruData,
                    backgroundColor: '#dc3545',
                    borderColor: '#dc3545',
                    borderWidth: 1
                },
                {
                    label: 'Spain',
                    data: spainData,
                    backgroundColor: '#fd7e14',
                    borderColor: '#fd7e14',
                    borderWidth: 1
                },
                {
                    label: 'South Africa',
                    data: southAfricaData,
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: isMobile ? 'y' : 'x',
            scales: isMobile ? {
                x: {
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (value === 1) return 'Off Season';
                            if (value === 3) return 'High Season';
                            if (value === 5) return 'Off Season';
                            return '';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    // months will show automatically
                    grid: {
                        display: false
                    }
                }
            } : {
                y: {
                    beginAtZero: true,
                    max: 5,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (value === 1) return 'Off Season';
                            if (value === 3) return 'High Season';
                            if (value === 5) return 'Off Season';
                            return '';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Add event listeners for country checkboxes
    const peruCheck = document.getElementById('peruCheck');
    const spainCheck = document.getElementById('spainCheck');
    const southAfricaCheck = document.getElementById('southAfricaCheck');
    
    if (peruCheck && spainCheck && southAfricaCheck) {
        peruCheck.addEventListener('change', function() {
            toggleCountryVisibility('Peru', this.checked);
        });
        
        spainCheck.addEventListener('change', function() {
            toggleCountryVisibility('Spain', this.checked);
        });
        
        southAfricaCheck.addEventListener('change', function() {
            toggleCountryVisibility('South Africa', this.checked);
        });
    }
}

// Update seasonality chart
function updateSeasonalityChart() {
    if (!window.seasonalityChart) return;
    
    const chart = window.seasonalityChart;
    
    // Generate new data with slight variations
    const peruData = generateCountrySeasonalData('Peru');
    const spainData = generateCountrySeasonalData('Spain');
    const southAfricaData = generateCountrySeasonalData('South Africa');
    
    // Update chart data
    chart.data.datasets[0].data = peruData;
    chart.data.datasets[1].data = spainData;
    chart.data.datasets[2].data = southAfricaData;
    
    chart.update();
}

// Toggle country visibility in seasonality chart
function toggleCountryVisibility(country, isVisible) {
    if (!window.seasonalityChart) return;
    
    const chart = window.seasonalityChart;
    let index = -1;
    
    if (country === 'Peru') index = 0;
    else if (country === 'Spain') index = 1;
    else if (country === 'South Africa') index = 2;
    
    if (index >= 0) {
        chart.data.datasets[index].hidden = !isVisible;
        chart.update();
    }
}

// Generate seasonal data for specific country
function generateCountrySeasonalData(country) {
    let data = [];
    
    // Different seasonal patterns for different countries
    if (country === 'Peru') {
        // Peru: Peak in Feb-Apr (Southern Hemisphere summer/fall)
        data = [2, 3, 4, 4, 3, 2, 1, 1, 2, 2, 2, 2];
    } else if (country === 'Spain') {
        // Spain: Peak in Aug-Oct (Northern Hemisphere late summer/fall)
        data = [1, 1, 2, 2, 3, 3, 4, 4, 4, 3, 2, 1];
    } else if (country === 'South Africa') {
        // South Africa: Peak in Jan-Mar (Southern Hemisphere summer)
        data = [3, 4, 3, 2, 2, 1, 1, 1, 2, 2, 2, 3];
    }
    
    // Add slight randomness
    return data.map(value => {
        const randomFactor = 0.9 + Math.random() * 0.2;
        return Math.min(5, Math.max(1, value * randomFactor));
    });
}

// Sparklines for YOY Growth
function initializeSparklines() {
    const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    
    years.forEach(year => {
        const sparklineElement = document.getElementById(`sparkline${year}`);
        if (!sparklineElement) return;
        
        // Determine if it's a positive or negative trend based on the growth value
        const growthElement = sparklineElement.parentElement.querySelector('.growth-value');
        const isPositive = growthElement && growthElement.classList.contains('growth-positive');
        
        // Create SVG for sparkline
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '60');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 60 20');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        if (isPositive) {
            // Upward trend path with randomness
            const controlPoint1 = 15 + Math.random() * 10;
            const controlPoint2 = 5 + Math.random() * 5;
            path.setAttribute('d', `M0,15 Q${controlPoint1},${controlPoint2} 30,10 T60,5`);
            path.setAttribute('stroke', '#28a745');
        } else {
            // Downward trend path with randomness
            const controlPoint1 = 15 + Math.random() * 10;
            const controlPoint2 = 15 + Math.random() * 5;
            path.setAttribute('d', `M0,5 Q${controlPoint1},${controlPoint2} 30,10 T60,15`);
            path.setAttribute('stroke', '#dc3545');
        }
        
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '2');
        
        svg.appendChild(path);
        sparklineElement.innerHTML = ''; // Clear any existing content
        sparklineElement.appendChild(svg);
    });
}

// Status updater function - simulates real-time updates
function updateStatuses() {
    const statusElements = document.querySelectorAll('.status-icon');
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    statusElements.forEach((element, index) => {
        // Determine status based on time and random factor
        const random = Math.random();
        const timeBasedProbability = (hour >= 9 && hour <= 17) ? 0.9 : 0.6; // Higher probability of "good" status during business hours
        
        if (random > timeBasedProbability) {
            element.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
            element.style.color = '#ffc107';
            
            // Add pulsing animation
            element.classList.add('status-updating');
            
            // Simulate completion after a short delay
            setTimeout(() => {
                element.innerHTML = '<i class="fas fa-check-circle"></i>';
                element.style.color = '#28a745';
                element.classList.remove('status-updating');
            }, 3000 + Math.random() * 5000);
        } else {
            element.innerHTML = '<i class="fas fa-check-circle"></i>';
            element.style.color = '#28a745';
            element.classList.remove('status-updating');
        }
    });
}

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Filter table rows based on search term
        const tableRows = document.querySelectorAll('.table tbody tr');
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Filter summary cards based on search term
        const summaryCards = document.querySelectorAll('.summary-card');
        summaryCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                card.closest('.col-md-4').style.display = '';
            } else {
                card.closest('.col-md-4').style.display = 'none';
            }
        });
    });
}

    document.querySelectorAll('.mobile-nav-menu .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Only handle anchor links
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
        e.preventDefault();
        const menu = document.getElementById('mobileNavMenu');
        if (menu.classList.contains('show')) {
            const collapse = bootstrap.Collapse.getOrCreateInstance(menu);
            collapse.hide();
            // Wait for collapse animation (Bootstrap default is 350ms)
            setTimeout(() => {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            }, 400);
        } else {
            // If menu already closed, just scroll
            const target = document.querySelector(href);
            if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        }
    });
    });

    // Seasonality mobile filter buttons toggle
    function updateSeasonalityMobileButtons() {
        document.querySelectorAll('.seasonality-filter-btn').forEach(btn => {
            const country = btn.getAttribute('data-country');
            const checkbox = document.getElementById(
                country === 'Peru' ? 'peruCheck' : country === 'Spain' ? 'spainCheck' : 'southAfricaCheck'
            );
            if (checkbox) {
                if (checkbox.checked) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }

    if (window.innerWidth <= 576) {
        document.querySelectorAll('.seasonality-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const country = this.getAttribute('data-country');
                const checkbox = document.getElementById(
                    country === 'Peru' ? 'peruCheck' : country === 'Spain' ? 'spainCheck' : 'southAfricaCheck'
                );
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                    updateSeasonalityMobileButtons();
                }
            });
        });
        // Sync button state on load
        updateSeasonalityMobileButtons();
    }

    // Subscribe For Email modal logic
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    subscribeBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        // Only open modal if not already inside the modal
        if (!btn.closest('.modal')) {
          // Close mobile menu if open
          const menu = document.getElementById('mobileNavMenu');
          if (menu && menu.classList.contains('show')) {
            const collapse = bootstrap.Collapse.getOrCreateInstance(menu);
            collapse.hide();
          }
          // Show modal
          const modal = new bootstrap.Modal(document.getElementById('subscribeModal'));
          modal.show();
        }
      });
    });

    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
      subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Hide the current modal
        const subscribeModal = bootstrap.Modal.getInstance(document.getElementById('subscribeModal'));
        if (subscribeModal) {
            subscribeModal.hide();
        }
        // Show the thank you modal
        const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
        thankYouModal.show();

        // Optionally, send the email to a backend here
      });
    }

    // Handle header subscribe form submission
    const headerSubscribeForm = document.getElementById('headerSubscribeForm');
    if (headerSubscribeForm) {
        headerSubscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Hide the header form elements (optional, but good UX)
            const subscribeButton = headerSubscribeForm.querySelector('button[type="submit"]');
            const emailInput = headerSubscribeForm.querySelector('input[type="email"]');
            const successMessage = document.getElementById('headerSubscribeSuccess');

            // Disable elements and show a temporary inline message if needed before modal
            // successMessage.classList.remove('d-none'); // Could show a brief inline message first
            // subscribeButton.disabled = true;
            // emailInput.disabled = true;

            // In this case, just trigger the modal immediately:

            // Show the thank you modal
            const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
            thankYouModal.show();

            // Optionally, send the email to a backend here
            // After successful backend submission, you might want to clear the input field:
            // emailInput.value = '';

        });
    }

    function autoScrollSummaryStrip() {
        const strip = document.querySelector('.summary-strip-scroll');
        if (!strip || window.innerWidth > 576) return;
    
        // Clone only the child nodes
        const children = Array.from(strip.children);
        children.forEach(child => {
            const clone = child.cloneNode(true);
            strip.appendChild(clone);
        });
    
        let scrollPos = 0;
    
        function animateScroll() {
            scrollPos += 1;
            if (scrollPos >= strip.scrollWidth / 2) {
                scrollPos = 0;
            }
            strip.scrollLeft = scrollPos;
            requestAnimationFrame(animateScroll);
        }
    
        animateScroll();
    }
    
    document.addEventListener('DOMContentLoaded', autoScrollSummaryStrip);
    
    // Add JavaScript for auto-scrolling market cards
    document.addEventListener('DOMContentLoaded', function () {
        const summaryStrip = document.querySelector('.summary-strip-scroll');
        if (summaryStrip) {
            // Duplicate the content to create a continuous loop effect
            const content = summaryStrip.innerHTML;
            summaryStrip.innerHTML += content;

            let scrollAmount = 0;
            const scrollSpeed = 0.5; // Adjust speed as needed

            function autoScroll() {
                scrollAmount += scrollSpeed;
                if (scrollAmount >= summaryStrip.scrollWidth / 2) {
                    // Reset scroll position to the beginning of the duplicated content
                    scrollAmount = 0; // Or a small offset to avoid a jump
                }
                summaryStrip.scrollLeft = scrollAmount;
                requestAnimationFrame(autoScroll);
            }

            // Start scrolling after a brief delay
            setTimeout(autoScroll, 1000);
        }
    });
    
