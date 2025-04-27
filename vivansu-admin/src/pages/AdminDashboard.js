import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './AdminDashboard.css';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminDashboard() {
  // Dữ liệu giả lập (thay thế bằng API nếu có)
  const totalVisitsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Total Visits',
        data: [300, 500, 400, 600, 700],
        backgroundColor: '#007bff',
      },
    ],
  };

  const totalPageViewsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Total Page Views',
        data: [800, 900, 700, 1000, 1100],
        backgroundColor: '#28a745',
      },
    ],
  };

  const uniqueVisitorData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Unique Visitor',
        data: [200, 300, 250, 400, 350],
        backgroundColor: '#dc3545',
      },
    ],
  };

  const bounceRateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Bounce Rate',
        data: [30, 25, 35, 20, 28],
        backgroundColor: '#ffc107',
      },
    ],
  };

  const newUsersData = {
    labels: ['New Users'],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ['#007bff', '#e9ecef'],
      },
    ],
  };

  const newPurchasesData = {
    labels: ['New Purchases'],
    datasets: [
      {
        data: [50, 50],
        backgroundColor: ['#28a745', '#e9ecef'],
      },
    ],
  };

  const bounceRateDoughnutData = {
    labels: ['Bounce Rate'],
    datasets: [
      {
        data: [40, 60],
        backgroundColor: ['#ffc107', '#e9ecef'],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      {/* Widget Cards */}
      <div className="widget-row">
        <div className="widget-card">
          <h4>Total Visits</h4>
          <p>10.8K</p>
          <div className="chart">
            <Bar data={totalVisitsData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="widget-card">
          <h4>Total Page Views</h4>
          <p>8.7K</p>
          <div className="chart">
            <Bar data={totalPageViewsData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="widget-card">
          <h4>Unique Visitor</h4>
          <p>12.7K</p>
          <div className="chart">
            <Bar data={uniqueVisitorData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="widget-card">
          <h4>Bounce Rate</h4>
          <p>31.5%</p>
          <div className="chart">
            <Bar data={bounceRateData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="content-row">
        {/* Site Visits (Map) */}
        <div className="map-card">
          <h4>Site Visits</h4>
          <div className="map-placeholder">
            <p>[Map Placeholder - USA, India, Australia highlighted]</p>
          </div>
        </div>

        {/* Visitors by Country */}
        <div className="visitors-card">
          <h4>Visitors</h4>
          <ul>
            <li>
              <span>Visitors from USA</span>
              <div className="progress-bar">
                <div style={{ width: '51.5%' }}></div>
              </div>
              <span>51.5%</span>
            </li>
            <li>
              <span>Visitors from Europe</span>
              <div className="progress-bar">
                <div style={{ width: '37.8%' }}></div>
              </div>
              <span>37.8%</span>
            </li>
            <li>
              <span>Visitors from Australia</span>
              <div className="progress-bar">
                <div style={{ width: '45.0%' }}></div>
              </div>
              <span>45.0%</span>
            </li>
            <li>
              <span>Visitors from India</span>
              <div className="progress-bar">
                <div style={{ width: '31.0%' }}></div>
              </div>
              <span>31.0%</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Doughnut Charts */}
      <div className="doughnut-row">
        <div className="doughnut-card">
          <h4>New Users</h4>
          <div className="doughnut-chart">
            <Doughnut data={newUsersData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            <p>75%</p>
          </div>
        </div>
        <div className="doughnut-card">
          <h4>New Purchases</h4>
          <div className="doughnut-chart">
            <Doughnut data={newPurchasesData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            <p>50%</p>
          </div>
        </div>
        <div className="doughnut-card">
          <h4>Bounce Rate</h4>
          <div className="doughnut-chart">
            <Doughnut data={bounceRateDoughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            <p>40%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;