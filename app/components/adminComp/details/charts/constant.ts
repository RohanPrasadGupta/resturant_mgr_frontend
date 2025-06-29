// constant.js
export const MOCK_BAR_CHART_DATA = 
  {
    message: "success",
    finalOrders: [
      // 2023 Data (for yearly comparison)
      {
        _id: "2023_001",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Breakfast Special",
            quantity: 2,
            price: 800,
            _id: "2023_001_1",
          },
        ],
        status: "completed",
        total: 1600,
        paymentMethod: "cash",
        createdAt: "2023-03-15T09:30:00.000Z",
        updatedAt: "2023-03-15T09:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2023_002",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Lunch Combo",
            quantity: 3,
            price: 1200,
            _id: "2023_002_1",
          },
        ],
        status: "completed",
        total: 3600,
        paymentMethod: "online",
        createdAt: "2023-07-22T14:15:00.000Z",
        updatedAt: "2023-07-22T14:15:00.000Z",
        __v: 0,
      },
      {
        _id: "2023_003",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Dinner Platter",
            quantity: 1,
            price: 2500,
            _id: "2023_003_1",
          },
        ],
        status: "completed",
        total: 2500,
        paymentMethod: "cash",
        createdAt: "2023-11-10T19:45:00.000Z",
        updatedAt: "2023-11-10T19:45:00.000Z",
        __v: 0,
      },

      // 2024 Data (Monthly analysis)
      // January 2024
      {
        _id: "2024_jan_001",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "New Year Special",
            quantity: 4,
            price: 1500,
            _id: "2024_jan_001_1",
          },
        ],
        status: "completed",
        total: 6000,
        paymentMethod: "cash",
        createdAt: "2024-01-05T12:30:00.000Z",
        updatedAt: "2024-01-05T12:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2024_jan_002",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Winter Soup",
            quantity: 2,
            price: 800,
            _id: "2024_jan_002_1",
          },
        ],
        status: "completed",
        total: 1600,
        paymentMethod: "online",
        createdAt: "2024-01-15T16:20:00.000Z",
        updatedAt: "2024-01-15T16:20:00.000Z",
        __v: 0,
      },
      {
        _id: "2024_jan_003",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Hot Chocolate",
            quantity: 6,
            price: 300,
            _id: "2024_jan_003_1",
          },
        ],
        status: "completed",
        total: 1800,
        paymentMethod: "cash",
        createdAt: "2024-01-25T10:45:00.000Z",
        updatedAt: "2024-01-25T10:45:00.000Z",
        __v: 0,
      },

      // February 2024
      {
        _id: "2024_feb_001",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Valentine Special",
            quantity: 2,
            price: 2000,
            _id: "2024_feb_001_1",
          },
        ],
        status: "completed",
        total: 4000,
        paymentMethod: "online",
        createdAt: "2024-02-14T19:30:00.000Z",
        updatedAt: "2024-02-14T19:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2024_feb_002",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Chicken Curry",
            quantity: 3,
            price: 1200,
            _id: "2024_feb_002_1",
          },
        ],
        status: "completed",
        total: 3600,
        paymentMethod: "cash",
        createdAt: "2024-02-20T13:15:00.000Z",
        updatedAt: "2024-02-20T13:15:00.000Z",
        __v: 0,
      },

      // March 2024
      {
        _id: "2024_mar_001",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Spring Salad",
            quantity: 4,
            price: 900,
            _id: "2024_mar_001_1",
          },
        ],
        status: "completed",
        total: 3600,
        paymentMethod: "online",
        createdAt: "2024-03-10T11:30:00.000Z",
        updatedAt: "2024-03-10T11:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2024_mar_002",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Fish Fry",
            quantity: 2,
            price: 1800,
            _id: "2024_mar_002_1",
          },
        ],
        status: "completed",
        total: 3600,
        paymentMethod: "cash",
        createdAt: "2024-03-22T18:45:00.000Z",
        updatedAt: "2024-03-22T18:45:00.000Z",
        __v: 0,
      },

      // April 2024
      {
        _id: "2024_apr_001",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "BBQ Platter",
            quantity: 3,
            price: 2200,
            _id: "2024_apr_001_1",
          },
        ],
        status: "completed",
        total: 6600,
        paymentMethod: "cash",
        createdAt: "2024-04-08T17:20:00.000Z",
        updatedAt: "2024-04-08T17:20:00.000Z",
        __v: 0,
      },
      {
        _id: "2024_apr_002",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Pasta Primavera",
            quantity: 2,
            price: 1400,
            _id: "2024_apr_002_1",
          },
        ],
        status: "completed",
        total: 2800,
        paymentMethod: "online",
        createdAt: "2024-04-25T15:10:00.000Z",
        updatedAt: "2024-04-25T15:10:00.000Z",
        __v: 0,
      },

      // May 2024
      {
        _id: "2024_may_001",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Summer Smoothie",
            quantity: 5,
            price: 500,
            _id: "2024_may_001_1",
          },
        ],
        status: "completed",
        total: 2500,
        paymentMethod: "online",
        createdAt: "2024-05-12T14:30:00.000Z",
        updatedAt: "2024-05-12T14:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2024_may_002",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Grilled Chicken",
            quantity: 2,
            price: 1600,
            _id: "2024_may_002_1",
          },
        ],
        status: "completed",
        total: 3200,
        paymentMethod: "cash",
        createdAt: "2024-05-28T19:15:00.000Z",
        updatedAt: "2024-05-28T19:15:00.000Z",
        __v: 0,
      },

      // June 2024
      {
        _id: "2024_jun_001",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Ice Cream Sundae",
            quantity: 4,
            price: 600,
            _id: "2024_jun_001_1",
          },
        ],
        status: "completed",
        total: 2400,
        paymentMethod: "cash",
        createdAt: "2024-06-15T16:45:00.000Z",
        updatedAt: "2024-06-15T16:45:00.000Z",
        __v: 0,
      },

      // 2025 Data (Recent months for better analysis)
      // January 2025
      {
        _id: "2025_jan_001",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "New Year Feast",
            quantity: 3,
            price: 2500,
            _id: "2025_jan_001_1",
          },
        ],
        status: "completed",
        total: 7500,
        paymentMethod: "online",
        createdAt: "2025-01-01T20:00:00.000Z",
        updatedAt: "2025-01-01T20:00:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_jan_002",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Comfort Food",
            quantity: 2,
            price: 1200,
            _id: "2025_jan_002_1",
          },
        ],
        status: "completed",
        total: 2400,
        paymentMethod: "cash",
        createdAt: "2025-01-15T13:30:00.000Z",
        updatedAt: "2025-01-15T13:30:00.000Z",
        __v: 0,
      },

      // February 2025
      {
        _id: "2025_feb_001",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Love Platter",
            quantity: 2,
            price: 1800,
            _id: "2025_feb_001_1",
          },
        ],
        status: "completed",
        total: 3600,
        paymentMethod: "online",
        createdAt: "2025-02-14T18:30:00.000Z",
        updatedAt: "2025-02-14T18:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_feb_002",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Hearty Soup",
            quantity: 4,
            price: 700,
            _id: "2025_feb_002_1",
          },
        ],
        status: "completed",
        total: 2800,
        paymentMethod: "cash",
        createdAt: "2025-02-25T12:15:00.000Z",
        updatedAt: "2025-02-25T12:15:00.000Z",
        __v: 0,
      },

      // March 2025
      {
        _id: "2025_mar_001",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Spring Festival",
            quantity: 5,
            price: 1500,
            _id: "2025_mar_001_1",
          },
        ],
        status: "completed",
        total: 7500,
        paymentMethod: "cash",
        createdAt: "2025-03-15T17:45:00.000Z",
        updatedAt: "2025-03-15T17:45:00.000Z",
        __v: 0,
      },

      // April 2025
      {
        _id: "2025_apr_001",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Easter Brunch",
            quantity: 3,
            price: 1600,
            _id: "2025_apr_001_1",
          },
        ],
        status: "completed",
        total: 4800,
        paymentMethod: "online",
        createdAt: "2025-04-20T11:00:00.000Z",
        updatedAt: "2025-04-20T11:00:00.000Z",
        __v: 0,
      },

      // May 2025
      {
        _id: "2025_may_001",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Mother's Day Special",
            quantity: 2,
            price: 2200,
            _id: "2025_may_001_1",
          },
        ],
        status: "completed",
        total: 4400,
        paymentMethod: "cash",
        createdAt: "2025-05-12T14:30:00.000Z",
        updatedAt: "2025-05-12T14:30:00.000Z",
        __v: 0,
      },

      // June 2025 (Last 30 days - Weekly analysis)
      // Week 1 (May 24-30)
      {
        _id: "2025_week1_001",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Weekend Special",
            quantity: 3,
            price: 1400,
            _id: "2025_week1_001_1",
          },
        ],
        status: "completed",
        total: 4200,
        paymentMethod: "cash",
        createdAt: "2025-05-24T12:30:00.000Z",
        updatedAt: "2025-05-24T12:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_week1_002",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Family Meal",
            quantity: 4,
            price: 1800,
            _id: "2025_week1_002_1",
          },
        ],
        status: "completed",
        total: 7200,
        paymentMethod: "online",
        createdAt: "2025-05-26T18:15:00.000Z",
        updatedAt: "2025-05-26T18:15:00.000Z",
        __v: 0,
      },

      // Week 2 (May 31 - June 6)
      {
        _id: "2025_week2_001",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Pizza Night",
            quantity: 2,
            price: 1600,
            _id: "2025_week2_001_1",
          },
        ],
        status: "completed",
        total: 3200,
        paymentMethod: "cash",
        createdAt: "2025-06-01T19:30:00.000Z",
        updatedAt: "2025-06-01T19:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_week2_002",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Taco Tuesday",
            quantity: 5,
            price: 800,
            _id: "2025_week2_002_1",
          },
        ],
        status: "completed",
        total: 4000,
        paymentMethod: "online",
        createdAt: "2025-06-03T20:00:00.000Z",
        updatedAt: "2025-06-03T20:00:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_week2_003",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Burger Combo",
            quantity: 3,
            price: 1200,
            _id: "2025_week2_003_1",
          },
        ],
        status: "completed",
        total: 3600,
        paymentMethod: "cash",
        createdAt: "2025-06-05T13:45:00.000Z",
        updatedAt: "2025-06-05T13:45:00.000Z",
        __v: 0,
      },

      // Week 3 (June 7-13)
      {
        _id: "2025_week3_001",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Sushi Roll",
            quantity: 4,
            price: 2000,
            _id: "2025_week3_001_1",
          },
        ],
        status: "completed",
        total: 8000,
        paymentMethod: "online",
        createdAt: "2025-06-08T17:20:00.000Z",
        updatedAt: "2025-06-08T17:20:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_week3_002",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Pasta Special",
            quantity: 2,
            price: 1500,
            _id: "2025_week3_002_1",
          },
        ],
        status: "completed",
        total: 3000,
        paymentMethod: "cash",
        createdAt: "2025-06-11T15:30:00.000Z",
        updatedAt: "2025-06-11T15:30:00.000Z",
        __v: 0,
      },

      // Week 4 (June 14-20) - Last 7 days
      {
        _id: "2025_week4_001",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Father's Day Prep",
            quantity: 3,
            price: 1800,
            _id: "2025_week4_001_1",
          },
        ],
        status: "completed",
        total: 5400,
        paymentMethod: "cash",
        createdAt: "2025-06-14T16:00:00.000Z",
        updatedAt: "2025-06-14T16:00:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_week4_002",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Steak Dinner",
            quantity: 2,
            price: 3000,
            _id: "2025_week4_002_1",
          },
        ],
        status: "completed",
        total: 6000,
        paymentMethod: "online",
        createdAt: "2025-06-16T19:45:00.000Z",
        updatedAt: "2025-06-16T19:45:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_week4_003",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Seafood Platter",
            quantity: 1,
            price: 4500,
            _id: "2025_week4_003_1",
          },
        ],
        status: "completed",
        total: 4500,
        paymentMethod: "cash",
        createdAt: "2025-06-18T20:30:00.000Z",
        updatedAt: "2025-06-18T20:30:00.000Z",
        __v: 0,
      },

      // Today (June 20, 2025) - Daily/Hourly analysis
      // Morning orders
      {
        _id: "2025_today_001",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Morning Coffee",
            quantity: 3,
            price: 300,
            _id: "2025_today_001_1",
          },
        ],
        status: "completed",
        total: 900,
        paymentMethod: "cash",
        createdAt: "2025-06-20T07:30:00.000Z",
        updatedAt: "2025-06-20T07:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_today_002",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Breakfast Sandwich",
            quantity: 2,
            price: 600,
            _id: "2025_today_002_1",
          },
        ],
        status: "completed",
        total: 1200,
        paymentMethod: "online",
        createdAt: "2025-06-20T08:15:00.000Z",
        updatedAt: "2025-06-20T08:15:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_today_003",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Fresh Juice",
            quantity: 4,
            price: 400,
            _id: "2025_today_003_1",
          },
        ],
        status: "completed",
        total: 1600,
        paymentMethod: "cash",
        createdAt: "2025-06-20T09:00:00.000Z",
        updatedAt: "2025-06-20T09:00:00.000Z",
        __v: 0,
      },

      // Midday orders
      {
        _id: "2025_today_004",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Lunch Combo",
            quantity: 5,
            price: 1200,
            _id: "2025_today_004_1",
          },
        ],
        status: "completed",
        total: 6000,
        paymentMethod: "online",
        createdAt: "2025-06-20T12:30:00.000Z",
        updatedAt: "2025-06-20T12:30:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_today_005",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Caesar Salad",
            quantity: 3,
            price: 800,
            _id: "2025_today_005_1",
          },
        ],
        status: "completed",
        total: 2400,
        paymentMethod: "cash",
        createdAt: "2025-06-20T13:15:00.000Z",
        updatedAt: "2025-06-20T13:15:00.000Z",
        __v: 0,
      },

      // Afternoon orders
      {
        _id: "2025_today_006",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Afternoon Tea",
            quantity: 2,
            price: 500,
            _id: "2025_today_006_1",
          },
        ],
        status: "completed",
        total: 1000,
        paymentMethod: "online",
        createdAt: "2025-06-20T15:45:00.000Z",
        updatedAt: "2025-06-20T15:45:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_today_007",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Snack Platter",
            quantity: 4,
            price: 700,
            _id: "2025_today_007_1",
          },
        ],
        status: "completed",
        total: 2800,
        paymentMethod: "cash",
        createdAt: "2025-06-20T16:30:00.000Z",
        updatedAt: "2025-06-20T16:30:00.000Z",
        __v: 0,
      },

      // Evening orders
      {
        _id: "2025_today_008",
        tableNumber: "MR002",
        items: [
          {
            menuItem: "Dinner Special",
            quantity: 2,
            price: 2500,
            _id: "2025_today_008_1",
          },
        ],
        status: "completed",
        total: 5000,
        paymentMethod: "online",
        createdAt: "2025-06-20T19:00:00.000Z",
        updatedAt: "2025-06-20T19:00:00.000Z",
        __v: 0,
      },
      {
        _id: "2025_today_009",
        tableNumber: "MR003",
        items: [
          {
            menuItem: "Wine & Dine",
            quantity: 1,
            price: 3500,
            _id: "2025_today_009_1",
          },
        ],
        status: "completed",
        total: 3500,
        paymentMethod: "cash",
        createdAt: "2025-06-20T20:15:00.000Z",
        updatedAt: "2025-06-20T20:15:00.000Z",
        __v: 0,
      },

      // Late evening
      {
        _id: "2025_today_010",
        tableNumber: "MR001",
        items: [
          {
            menuItem: "Late Night Bites",
            quantity: 3,
            price: 900,
            _id: "2025_today_010_1",
          },
        ],
        status: "completed",
        total: 2700,
        paymentMethod: "online",
        createdAt: "2025-06-20T22:30:00.000Z",
        updatedAt: "2025-06-20T22:30:00.000Z",
        __v: 0,
      },
    ],
  }

