// src/data/foodCatalog.js
export const foodCatalog = {
  grains: [
    { id: 'g1', name: 'Roti / Chapati', tags: ['Fiber', 'Carbohydrate'], note: 'Whole wheat is best.' },
    { id: 'g2', name: 'Rice (White)', tags: ['Carbohydrate', 'Easy to Digest'], note: 'Brown rice has more fiber.' },
    { id: 'g3', name: 'Idli', tags: ['Fermented', 'Easy to Digest'], note: 'Good for breakfast.' },
    { id: 'g4', name: 'Dosa', tags: ['Fermented', 'Carbohydrate'], note: 'Can be made healthier with less oil.' },
  ],
  lentils: [
    { id: 'l1', name: 'Dal (Toor)', tags: ['Protein', 'Fiber'], note: 'A staple for protein intake.' },
    { id: 'l2', name: 'Dal (Moong)', tags: ['Protein', 'Easy to Digest'], note: 'Often recommended when feeling unwell.' },
    { id: 'l3', name: 'Sambar', tags: ['Protein', 'Vegetables'], note: 'A nutritious mix of lentils and veggies.' },
  ],
  vegetables: [
    { id: 'v1', name: 'Mixed Vegetable Sabzi', tags: ['Vitamins', 'Fiber'], note: 'Eat a variety of colors.' },
    { id: 'v2', name: 'Palak (Spinach)', tags: ['Iron', 'Vitamins'], note: 'Excellent source of iron.' },
    { id: 'v3', name: 'Bhindi (Okra)', tags: ['Fiber'], note: 'Good for digestion.' },
  ],
  dairy: [
    { id: 'd1', name: 'Curd / Dahi', tags: ['Probiotic', 'Calcium'], note: 'Aids digestion and cools the body.' },
    { id: 'd2', name: 'Paneer', tags: ['Protein', 'Calcium'], note: 'Good source of protein for vegetarians.' },
    { id: 'd3', name: 'Milk', tags: ['Calcium', 'Vitamin D'], note: 'Important for bone health.' },
  ],
  fruits: [
      { id: 'f1', name: 'Banana', tags: ['Potassium', 'Energy'], note: 'Easy to eat and digest.' },
      { id: 'f2', name: 'Apple', tags: ['Fiber', 'Vitamins'], note: 'Good for heart health.' },
      { id: 'f3', name: 'Papaya', tags: ['Digestion', 'Vitamin C'], note: 'Excellent for digestive health.' },
  ],
};