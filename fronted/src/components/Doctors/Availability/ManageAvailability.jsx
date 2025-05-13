import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaPlus, FaTrash } from 'react-icons/fa';

const ManageAvailability = () => {
  const [availabilityData, setAvailabilityData] = useState({
    date: '',
    timeSlots: [{ startTime: '', endTime: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTimeSlot = () => {
    setAvailabilityData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: '', endTime: '' }]
    }));
  };

  const removeTimeSlot = (index) => {
    setAvailabilityData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (index, field, value) => {
    const newTimeSlots = [...availabilityData.timeSlots];
    newTimeSlots[index][field] = value;
    setAvailabilityData(prev => ({
      ...prev,
      timeSlots: newTimeSlots
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(  // Changed from patch to post
        'http://127.0.0.1:8000/api/doctors/availability',
        {
          date: availabilityData.date,
          time_slots: availabilityData.timeSlots.map(slot => ({
            start_time: `${availabilityData.date} ${slot.startTime}`,
            end_time: `${availabilityData.date} ${slot.endTime}`
          }))
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        alert('Availability set successfully!');
        setAvailabilityData({
          date: '',
          timeSlots: [{ startTime: '', endTime: '' }]
        });
      }
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to set availability. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3 bg-blue-500 p-4 rounded-lg">
        <FaCalendarAlt className="text-white" />
        Manage Availability
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Select Date
          </label>
          <input
            type="date"
            value={availabilityData.date}
            onChange={(e) => setAvailabilityData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-medium text-gray-700 flex items-center gap-2">
              <FaClock className="text-blue-500" />
              Time Slots
            </label>
            <button
              type="button"
              onClick={addTimeSlot}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FaPlus size={14} />
              Add Time Slot
            </button>
          </div>

          <div className="space-y-4">
            {availabilityData.timeSlots.map((slot, index) => (
              <div key={index} 
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex-1 flex items-center gap-4">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <span className="text-gray-500 font-medium">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-lg font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Setting Availability...
            </>
          ) : (
            'Set Availability'
          )}
        </button>
      </form>
    </div>
  );
};

export default ManageAvailability;