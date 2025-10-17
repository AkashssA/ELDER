// src/components/DietTracker.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { recipes } from '../data/recipes';
import { foodCatalog } from '../data/foodCatalog';
import './DietTracker.css';

const DietTracker = () => {
  // Main tabs state
  const [activeTab, setActiveTab] = useState('daily'); // daily, recipes, summary

  // State for the daily log
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState({});

  // NEW: State for the meal logging interface
  const [isLogging, setIsLogging] = useState(null); // Will hold 'breakfast', 'lunch', etc., or null
  const [selectedItems, setSelectedItems] = useState({}); // To store items user picks from catalog

  // State for the weekly summary
  const [weeklyMeals, setWeeklyMeals] = useState({});

  useEffect(() => {
    if (activeTab === 'daily') fetchMealsForDate(date);
    if (activeTab === 'summary') fetchWeeklyMeals();
  }, [activeTab, date]);

  const fetchMealsForDate = async (currentDate) => {
    try {
        const res = await axios.get(`http://localhost:5000/api/meals/by-date/${currentDate}`);
        const mealsByDate = res.data.reduce((acc, meal) => {
          acc[meal.mealType] = meal.description;
          return acc;
        }, {});
        setMeals(mealsByDate);
    } catch(err) {
        console.error("Failed to fetch meals for date", err);
    }
  };

  const fetchWeeklyMeals = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/meals/weekly`);
        const groupedByDate = res.data.reduce((acc, meal) => {
          (acc[meal.date] = acc[meal.date] || []).push(meal);
          return acc;
        }, {});
        setWeeklyMeals(groupedByDate);
    } catch(err) {
        console.error("Failed to fetch weekly meals", err);
    }
  };

  // --- NEW FUNCTIONS FOR INTERACTIVE LOGGING ---

  const handleStartLogging = (mealType) => {
    setIsLogging(mealType);
    setSelectedItems({}); // Clear previous selections
  };

  const handleItemSelect = (item) => {
    const newSelectedItems = { ...selectedItems };
    if (newSelectedItems[item.id]) {
      newSelectedItems[item.id].quantity += 1;
    } else {
      newSelectedItems[item.id] = { ...item, quantity: 1 };
    }
    setSelectedItems(newSelectedItems);
  };

  const handleSaveMeal = async () => {
    const description = Object.values(selectedItems)
      .map(item => `${item.name} (x${item.quantity})`)
      .join(', ');

    if (!description) {
      alert("Please select at least one item.");
      return;
    }

    await axios.post('http://localhost:5000/api/meals', { date, mealType: isLogging, description });
    fetchMealsForDate(date); // Refresh the daily log
    setIsLogging(null); // Go back to the summary view
  };
  
  // --- MAIN RENDER LOGIC ---

  // If we are in logging mode, show the catalog. Otherwise, show the main tabs.
  if (isLogging) {
    return (
      <div className="meal-logger-view">
        <h3>Logging {isLogging} for {new Date(date).toLocaleDateString("en-IN")}</h3>
        <div className="selected-items-bar">
          <strong>Selected:</strong> 
          {Object.keys(selectedItems).length === 0 ? " None" : 
            Object.values(selectedItems).map(item => (
              <span key={item.id} className="selected-item-tag">{item.name} x{item.quantity}</span>
            ))
          }
        </div>
        <div className="food-catalog">
          {Object.keys(foodCatalog).map(category => (
            <div key={category} className="catalog-category">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <div className="items-grid">
                {foodCatalog[category].map(item => (
                  <button key={item.id} className="food-item-btn" onClick={() => handleItemSelect(item)}>
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="logger-actions">
            <button onClick={handleSaveMeal} className="save-meal-btn">Save Meal</button>
            <button onClick={() => setIsLogging(null)} className="cancel-btn">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="diet-container">
      <h2>Diet & Nutrition Tracker</h2>
      <div className="diet-tabs">
        <button onClick={() => setActiveTab('daily')} className={activeTab === 'daily' ? 'active' : ''}>Daily Log</button>
        <button onClick={() => setActiveTab('recipes')} className={activeTab === 'recipes' ? 'active' : ''}>Recipe Ideas</button>
        <button onClick={() => setActiveTab('summary')} className={activeTab === 'summary' ? 'active' : ''}>Weekly Summary</button>
      </div>

      {activeTab === 'daily' && (
        <div className="daily-log">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          {['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => (
            <div key={mealType} className="meal-card">
              <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
              <p>{meals[mealType] || 'No meal logged yet.'}</p>
              <button onClick={() => handleStartLogging(mealType)}>
                {meals[mealType] ? 'Edit Meal' : 'Log Meal'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* THIS SECTION WAS MISSING */}
      {activeTab === 'recipes' && (
        <div className="recipe-list">
          {recipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <h3>{recipe.title}</h3>
              <strong>Ingredients:</strong><ul>{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
              <strong>Instructions:</strong><ol>{recipe.instructions.map((inst, i) => <li key={i}>{inst}</li>)}</ol>
            </div>
          ))}
        </div>
      )}
      
      {/* THIS SECTION WAS MISSING */}
      {activeTab === 'summary' && (
        <div className="weekly-summary">
            {Object.keys(weeklyMeals).length === 0 ? <p>No meals logged in the past 7 days.</p> :
             Object.keys(weeklyMeals).sort().reverse().map(day => (
                <div key={day} className="summary-day">
                    <h4>{new Date(day).toLocaleDateString("en-IN", { weekday: 'long', day: 'numeric', month: 'short' })}</h4>
                    <ul>
                        {weeklyMeals[day].map(meal => (
                           <li key={meal._id}><strong>{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}:</strong> {meal.description}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DietTracker;