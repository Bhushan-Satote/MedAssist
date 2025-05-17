import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PatientSidebar from '../Dashbord/PatientSidebar';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  
  const [formData, setFormData] = useState({
    doctor_id: '', // Changed from doctorId to match backend
    appointment_date: '', // Changed from appointmentDate to match backend
    start_time: '', // Changed from appointmentTime to match backend
    end_time: '', // Added to match backend
    notes: '', // Kept as is
  });

  // Fetch available doctors using the correct API endpoint
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`http://127.0.0.1:8000/api/doctors/available/${today}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          setDoctors(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch doctors');
        console.error(err);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Automatically set end_time 1 hour after start_time when start_time changes
      ...(name === 'start_time' && {
        end_time: new Date(new Date(`2000-01-01T${value}`).getTime() + 60 * 60 * 1000)
          .toTimeString()
          .slice(0, 5)
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/appointments/book',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        navigate('/patient/appointments');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <PatientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header Section */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Book an Appointment</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Start Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* End Time Selection (Read-only, automatically set) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time (1 hour duration)
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional information"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 text-white rounded-md ${
                    loading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors duration-200`}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;