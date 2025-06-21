# Global Data Context

This directory contains the global state management solution for the WattsonAI application using React Context API.

## Overview

The `DataContext` provides centralized state management for all application data, including:
- Market prices (energy, hash, token)
- Inventory data (miners and inference assets)
- Profitability calculations
- Machine allocation data
- Loading states and error handling

## Usage

### 1. Accessing Data in Components

```jsx
import { useData, formatCurrency, formatChartData, getMetricColor } from '../context/DataContext';

const MyComponent = () => {
  const { 
    prices, 
    inventory, 
    profitability, 
    machines, 
    loading, 
    error, 
    lastUpdated,
    updateMachinesData,
    refreshData 
  } = useData();

  // Use the data as needed
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Latest energy price: {formatCurrency(prices[0]?.energy_price || 0)}</p>
      <p>Total machines: {machines?.total_power_used || 0}</p>
    </div>
  );
};
```

### 2. Available Data Properties

| Property | Type | Description |
|----------|------|-------------|
| `prices` | Array | Array of market price data with timestamps |
| `inventory` | Object | Inventory data for miners and inference assets |
| `profitability` | Object | Calculated profitability data |
| `machines` | Object | Machine allocation and performance data |
| `loading` | Boolean | Whether data is currently loading |
| `isUpdating` | Boolean | Whether machines are being updated |
| `error` | String | Error message if data loading failed |
| `lastUpdated` | String | ISO timestamp of last data update |

### 3. Available Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `updateMachinesData` | `allocation` | Update machine allocation and refresh data |
| `refreshData` | None | Manually refresh all data |
| `loadData` | None | Load data (called automatically) |

### 4. Utility Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `formatCurrency` | `value` | Format number as USD currency |
| `formatChartData` | `prices` | Format price data for charts |
| `getMetricColor` | `metric` | Get color scheme for metric type |

### 5. Example: Creating a Data-Aware Component

```jsx
import React from 'react';
import { useData, formatCurrency } from '../context/DataContext';

const PriceDisplay = () => {
  const { prices, loading, error } = useData();

  if (loading) return <div>Loading prices...</div>;
  if (error) return <div>Error loading prices: {error}</div>;
  if (!prices.length) return <div>No price data available</div>;

  const latestPrice = prices[0];

  return (
    <div className="price-display">
      <h3>Current Prices</h3>
      <div className="price-grid">
        <div>
          <span>Energy:</span>
          <span>{formatCurrency(latestPrice.energy_price)}</span>
        </div>
        <div>
          <span>Hash:</span>
          <span>{formatCurrency(latestPrice.hash_price)}</span>
        </div>
        <div>
          <span>Token:</span>
          <span>{formatCurrency(latestPrice.token_price)}</span>
        </div>
      </div>
    </div>
  );
};
```

### 6. Example: Updating Machine Allocation

```jsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const MachineController = () => {
  const { machines, updateMachinesData, isUpdating } = useData();
  const [allocation, setAllocation] = useState({
    air_miners: machines?.air_miners || 0,
    hydro_miners: machines?.hydro_miners || 0,
    // ... other machine types
  });

  const handleUpdate = async () => {
    try {
      await updateMachinesData(allocation);
      console.log('Machines updated successfully');
    } catch (error) {
      console.error('Failed to update machines:', error);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={allocation.air_miners}
        onChange={(e) => setAllocation(prev => ({
          ...prev,
          air_miners: parseInt(e.target.value) || 0
        }))}
      />
      <button 
        onClick={handleUpdate}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Update Allocation'}
      </button>
    </div>
  );
};
```

## Benefits

1. **Centralized State**: All data is managed in one place
2. **Automatic Updates**: Data refreshes every 30 seconds
3. **Error Handling**: Centralized error management
4. **Loading States**: Consistent loading indicators
5. **No Prop Drilling**: Components can access data directly
6. **Performance**: Data is shared across all components
7. **Consistency**: All components use the same data source

## Architecture

The context uses a reducer pattern for state management:

- **Initial State**: Default values for all data properties
- **Actions**: Defined actions for state updates
- **Reducer**: Pure function that handles state transitions
- **Provider**: Wraps the app and provides context
- **Custom Hook**: `useData()` for easy access to context

## Auto-Refresh

Data automatically refreshes every 30 seconds to keep information current. The `lastUpdated` timestamp tracks when data was last refreshed.

## Error Handling

Errors are captured and stored in the context state. Components can check the `error` property to display appropriate error messages.

## Loading States

The context provides loading states for both initial data loading (`loading`) and machine updates (`isUpdating`). 