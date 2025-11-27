import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { healthTips } from '../data/healthTips';
import './HealthMonitor.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- Helper constants & utilities ---
const SUMMARY_ICONS = ['💓', '🩸', '⚖️', '🧘', '🥗', '💧'];
const EMOJI_BLOCK_REGEX = /[\p{Extended_Pictographic}\u2600-\u27BF]/u;
const SUMMARY_KEYWORDS = [
  { key: 'blood pressure', label: 'Blood Pressure' },
  { key: 'sugar', label: 'Glucose' },
  { key: 'weight', label: 'Weight' },
  { key: 'bmi', label: 'BMI' },
  { key: 'heart rate', label: 'Heart Rate' },
  { key: 'sleep', label: 'Sleep' },
  { key: 'hydration', label: 'Hydration' },
];

const cleanLine = (line) => line.replace(/^[-–•\d.()\s]+/, '').trim();

const isDividerBlock = (block) => /^[-_*]+$/.test(block.replace(/\s/g, ''));
const isEmojiBlock = (block) => block.length <= 4 && EMOJI_BLOCK_REGEX.test(block);
const shouldDropBlock = (block) => {
  const normalized = block.toLowerCase();
  return SUMMARY_KEYWORDS.some(({ key }) => normalized === key);
};

const parseSummarySections = (text) => {
  if (!text) return [];
  const rawBlocks = text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  if (!rawBlocks.length) return [];

  const combinedBlocks = [];
  for (let i = 0; i < rawBlocks.length; i += 1) {
    let block = rawBlocks[i];
    if (!block || shouldDropBlock(block) || isDividerBlock(block)) {
      continue;
    }

    if (isEmojiBlock(block) && i + 1 < rawBlocks.length) {
      let combined = block;
      let offset = 1;
      while (i + offset < rawBlocks.length && !isEmojiBlock(rawBlocks[i + offset])) {
        const nextBlock = rawBlocks[i + offset];
        if (shouldDropBlock(nextBlock) || isDividerBlock(nextBlock)) {
          offset += 1;
          continue;
        }
        combined += `\n${nextBlock}`;
        offset += 1;
        if (offset > 2) break;
      }
      combinedBlocks.push(combined);
      i += offset - 1;
      continue;
    }

    combinedBlocks.push(block);
  }

  const blocks = combinedBlocks.length ? combinedBlocks : rawBlocks;

  if (!blocks.length) return [];

  return blocks.map((block, index) => {
    const lines = block.split('\n').map((line) => cleanLine(line)).filter(Boolean);
    if (!lines.length) {
      return null;
    }

    let icon = null;
    if (lines.length && isEmojiBlock(lines[0])) {
      icon = lines[0];
      lines.shift();
    }

    let firstLine = lines[0] || '';
    let title = `Insight ${index + 1}`;
    let items = [];

    if (/^insight\s+\d+/i.test(firstLine)) {
      title = firstLine.replace(/insight/i, 'Care insight').trim();
      lines.shift();
      firstLine = lines[0] || '';
    }

    const headingMatch = firstLine.match(/^#{1,6}\s*(.+)$/);
    if (headingMatch) {
      title = headingMatch[1].trim();
      lines.shift();
      firstLine = lines[0] || '';
    }

    if (/^\d+\.\s+/.test(firstLine)) {
      title = firstLine.replace(/^\d+\.\s*/, '').trim();
      lines.shift();
      firstLine = lines[0] || '';
    }

    if (firstLine.toLowerCase().includes(':')) {
      const [rawTitle, remainder] = firstLine.split(':');
      title = rawTitle.trim() || title;
      if (remainder && remainder.trim()) {
        items.push(remainder.trim());
      }
      items = items.concat(lines.slice(1));
    } else if (lines.length > 1) {
      title = firstLine;
      items = lines.slice(1);
    } else {
      items = [firstLine];
    }

    if (!items.length) {
      items = ['Keep up the great work and maintain healthy routines.'];
    }

    const filteredItems = lines
      .filter((line) => !shouldDropBlock(line) && !isDividerBlock(line))
      .map((line) => line.replace(/^#{1,6}\s*/, ''));

    if (!filteredItems.length) {
      filteredItems.push(firstLine || 'Keep up the great work and maintain healthy routines.');
    }

    return { title, items: filteredItems, icon };
  }).filter(Boolean);
};

const extractHighlightChips = (text) => {
  if (!text) return [];
  const normalized = text.toLowerCase();
  return SUMMARY_KEYWORDS.filter(({ key }) => normalized.includes(key)).map(({ label }) => label);
};

// --- Helper function to format the data log list ---
const formatDataPoint = (metric) => {
  const date = new Date(metric.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  switch (metric.metricType) {
    case 'bloodPressure':
      return `${date} - BP: ${metric.value1}/${metric.value2} mmHg`;
    case 'bloodSugar':
      return `${date} - Sugar: ${metric.value1} mg/dL`;
    case 'weight':
      return `${date} - Weight: ${metric.value1} kg`;
    case 'heartRate':
      return `${date} - Heart Rate: ${metric.value1} bpm`;
    default:
      return date;
  }
};

const HealthMonitor = () => {
  const [metricType, setMetricType] = useState('bloodPressure');
  const [data, setData] = useState([]); // This state holds the data for the chart & list
  const [formValues, setFormValues] = useState({ value1: '', value2: '' });
  const [showTips, setShowTips] = useState(false);
  const [height, setHeight] = useState('170');
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const parsedSummarySections = useMemo(() => parseSummarySections(summary), [summary]);
  const summaryChips = useMemo(() => extractHighlightChips(summary), [summary]);
  
  useEffect(() => {
    fetchData();
    setShowTips(false);
  }, [metricType]);

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
    // ... (This function is unchanged)
    const { value1, value2 } = formValues;
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);
    if (metricType === 'bloodPressure' && (v1 > 140 || v2 > 90)) {
        alert('Warning: Blood Pressure reading is high. Please consult a doctor.');
    }
    // ... (rest of the checks)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkNormalRange();
    try {
      await axios.post('http://localhost:5000/api/health', { ...formValues, metricType });
      fetchData(); // Refresh chart AND data log
      setFormValues({ value1: '', value2: '' }); // Clear form
      setSummary(null); // Clear old summary
    } catch (err) {
      console.error("Failed to add health data", err);
    }
  };
  
  // --- NEW DELETE FUNCTION ---
  const handleDeleteMetric = async (metricId) => {
    if (window.confirm("Are you sure you want to delete this data point? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/health/${metricId}`);
        fetchData(); // Re-fetch the data, which updates the chart and this list
        setSummary(null); // Clear the AI summary, as it's now outdated
      } catch (err) {
        console.error("Failed to delete metric", err);
        alert("Could not delete the data point. Please try again.");
      }
    }
  };

  // --- (handleGenerateSummary function is unchanged) ---
  const handleGenerateSummary = async () => {
    if (!height) {
      alert("Please enter your height (in cm) to calculate your BMI and get a summary.");
      return;
    }
    setIsSummaryLoading(true);
    setSummary(null);
    setSummaryError('');
    try {
      const bpRes = await axios.get('http://localhost:5000/api/health/bloodPressure');
      const sugarRes = await axios.get('http://localhost:5000/api/health/bloodSugar');
      const weightRes = await axios.get('http://localhost:5000/api/health/weight');
      const hrRes = await axios.get('http://localhost:5000/api/health/heartRate');
      const allReadings = {
        bp: bpRes.data.reverse(),
        sugar: sugarRes.data.reverse(),
        weight: weightRes.data.reverse(),
        hr: hrRes.data.reverse()
      };
      const res = await axios.post(`http://localhost:5000/api/health/ai-summary`, {
        height: parseFloat(height),
        allReadings: allReadings
      });
      setSummary(res.data.summary); 
    } catch (err) {
      console.error('Failed to get summary', err);
      if (err.response && err.response.data && err.response.data.summary) {
        setSummaryError(err.response.data.summary);
      } else {
        setSummaryError('Sorry, an error occurred while generating your summary. Please try again.');
      }
    }
    setIsSummaryLoading(false);
  };
  
  const chartData = {
    // ... (This object is unchanged)
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
          {/* ... (Height input is unchanged) ... */}
          <div className="height-input-container">
            <label htmlFor="height">Your Height (in cm):</label>
            <input 
              type="number" 
              id="height"
              name="height"
              placeholder="e.g., 170" 
              value={height} 
              onChange={e => setHeight(e.target.value)} 
            />
            <p>Your height is needed to calculate BMI and provide a full summary.</p>
          </div>

          {/* ... (Add New Reading form is unchanged) ... */}
          <h3>Add New Reading (for Chart)</h3>
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

          <div className="tips-section">
            {/* ... (Tips section is unchanged) ... */}
          </div>
        </div>
        
        <div className="health-chart-and-summary">
          <div className="health-chart">
            <h3>Your Progress: {metricType.replace(/([A-Z])/g, ' $1')}</h3>
            {data.length > 0 ? <Line data={chartData} /> : <p>No data recorded for this metric yet.</p>}
          </div>

          {/* --- NEW: DATA LOG WITH DELETE BUTTONS --- */}
          <div className="data-log-container">
            <h4>Data Log for {metricType.replace(/([A-Z])/g, ' $1')}</h4>
            <p>Click a data point to delete it.</p>
            {data.length > 0 ? (
              <ul className="data-log-list">
                {/* We reverse the array here to show newest first */}
                {[...data].reverse().map(metric => (
                  <li key={metric._id} className="data-log-item">
                    <span>{formatDataPoint(metric)}</span>
                    <button onClick={() => handleDeleteMetric(metric._id)} className="data-delete-btn">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data to display.</p>
            )}
          </div>
          {/* --- END OF NEW SECTION --- */}


          {/* ... (AI Summary Container is unchanged) ... */}
          <div className="ai-summary-container">
            <h3>Instant AI Health Analysis</h3>
            <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="generate-summary-btn">
              {isSummaryLoading ? 'Analyzing...' : 'Generate My AI Summary'}
            </button>
            {summary && (
              <div className="summary-report enhanced">
                {summaryChips.length > 0 && (
                  <div className="summary-chips">
                    {summaryChips.map((chip) => (
                      <span key={chip} className="summary-chip">{chip}</span>
                    ))}
                  </div>
                )}
                {parsedSummarySections.length > 0 ? (
                  <div className="summary-grid">
                    {parsedSummarySections.map((section, index) => (
                      <article key={`${section.title}-${index}`} className="summary-card">
                        <div className="summary-card-icon" aria-hidden="true">
                          {section.icon || SUMMARY_ICONS[index % SUMMARY_ICONS.length]}
                        </div>
                        <div>
                          <h4>{section.title}</h4>
                          <ul>
                            {section.items.map((item, itemIndex) => (
                              <li key={`${section.title}-${itemIndex}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="summary-plain">{summary}</p>
                )}
              </div>
            )}
            {summaryError && (
              <div className="summary-report summary-error">
                {summaryError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitor;