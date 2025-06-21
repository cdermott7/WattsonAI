import React, { useEffect, useState } from 'react';

import { Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { updateMachines } from '../services/api';

const MachineAllocation = ({ apiKey, initialAllocation, onAllocationChange }) => {
  const [allocation, setAllocation] = useState(initialAllocation);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAllocation(initialAllocation);
  }, [initialAllocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllocation(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      const updatedData = await updateMachines(apiKey, allocation);
      if (onAllocationChange) {
        onAllocationChange(updatedData);
      }
    } catch (err) {
      console.error('Failed to update machine allocation', err);
      setError('Failed to update allocation. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!allocation) {
    return null;
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
      <div className="flex items-center space-x-3 mb-6">
        <Server className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-light text-white">Allocate Machines</h3>
      </div>
      
      <div className="space-y-4">
        {Object.keys(allocation).map(key => (
          <div key={key} className="flex items-center justify-between">
            <label htmlFor={key} className="text-white/80 capitalize text-sm">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={allocation[key]}
              onChange={handleInputChange}
              className="w-28 bg-white/10 text-white rounded-md px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              min="0"
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <motion.button
          onClick={handleUpdate}
          disabled={isUpdating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all backdrop-blur-sm shadow-lg"
        >
          {isUpdating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-white font-medium">Updating...</span>
            </>
          ) : (
            <>
              <Server className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Update Allocation</span>
            </>
          )}
        </motion.button>
        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default MachineAllocation; 