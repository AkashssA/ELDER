// frontend/src/components/HealthMonitor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { healthTips } from '../data/healthTips'; // NEW: Import our health tips
import './HealthMonitor.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthMonitor = () => {
  const [metricType, setMetricType] = useState('bloodPressure');
  const [data, setData] = useState([]);
  const [formValues, setFormValues] = useState({ value1: '', value2: '' });
  const [showTips, setShowTips] = useState(false); // NEW: State to control dropdown visibility

  useEffect(() => {
    fetchData();
    setShowTips(false); // NEW: Close tips when switching tabs
  }, [metricType]);

  // ... (fetchData, handleInputChange, checkNormalRange, and handleSubmit functions are the same)
  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/health/${metricType}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch health data", err);
    }
  };
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const checkNormalRange = () => {
    const { value1, value2 } = formValues;
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);
    if (metricType === 'bloodPressure' && (v1 > 140 || v2 > 90)) {
        alert('Warning: Blood Pressure reading is high. Please consult a doctor.');
    }
    if (metricType === 'bloodSugar' && v1 > 180) {
        alert('Warning: Blood Sugar reading is high. Please consult a doctor.');
    }
    if (metricType === 'heartRate' && (v1 < 60 || v1 > 100)) {
        alert('Warning: Heart Rate is outside the normal range (60-100 bpm). Please consult a doctor.');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    checkNormalRange();
    try {
      await axios.post('http://localhost:5000/api/health', { ...formValues, metricType });
      fetchData();
      setFormValues({ value1: '', value2: '' });
    } catch (err) {
      console.error("Failed to add health data", err);
    }
  };

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString("en-IN")),
    datasets: [
      {
        label: metricType === 'bloodPressure' ? 'Systolic (High)' : metricType.replace(/([A-Z])/g, ' $1').toUpperCase(),
        data: data.map(d => d.value1),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      ...(metricType === 'bloodPressure' ? [{
        label: 'Diastolic (Low)',
        data: data.map(d => d.value2),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }] : [])
    ],
  };

  return (
    <div className="health-container">
      <h2>Health Monitor</h2>
      <div className="health-tabs">
        <button onClick={() => setMetricType('bloodPressure')} className={metricType === 'bloodPressure' ? 'active' : ''}>Blood Pressure</button>
        <button onClick={() => setMetricType('bloodSugar')} className={metricType === 'bloodSugar' ? 'active' : ''}>Blood Sugar</button>
        <button onClick={() => setMetricType('weight')} className={metricType === 'weight' ? 'active' : ''}>Weight</button>
        <button onClick={() => setMetricType('heartRate')} className={metricType === 'heartRate' ? 'active' : ''}>Heart Rate</button>
      </div>

      <div className="health-content">
        <div className="health-form">
          <h3>Add New Reading</h3>
          <form onSubmit={handleSubmit}>
            {metricType === 'bloodPressure' ? (
              <>
                <input name="value1" type="number" placeholder="Systolic (e.g., 120)" value={formValues.value1} onChange={handleInputChange} required />
                <input name="value2" type="number" placeholder="Diastolic (e.g., 80)" value={formValues.value2} onChange={handleInputChange} required />
              </>
            ) : (
              <input name="value1" type="number" placeholder={`Enter ${metricType === 'bloodSugar' ? 'Sugar (mg/dL)' : metricType === 'weight' ? 'Weight (kg)' : 'Rate (bpm)'}`} value={formValues.value1} onChange={handleInputChange} required />
            )}
            <button type="submit">Add Reading</button>
          </form>

          {/* NEW: Tips Dropdown Section */}
          <div className="tips-section">
            <button onClick={() => setShowTips(!showTips)} className="tips-toggle">
              {showTips ? 'Hide' : 'Show'} Care Tips ▼
            </button>
            {showTips && (
              <div className="tips-content">
                <h4>Normal Range:</h4>
                <p>{healthTips[metricType].normalRange}</p>
                <h4>How to Take Care:</h4>
                <ul>
                  {healthTips[metricType].careTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="health-chart">
          <h3>Your Progress</h3>
          {data.length > 0 ? <Line data={chartData} /> : <p>No data recorded yet. Add a reading to see your chart.</p>}
        </div>
      </div>
    </div>
  );
};

export default HealthMonitor;