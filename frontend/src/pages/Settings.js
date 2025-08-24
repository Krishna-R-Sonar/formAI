// File: formAI/frontend/src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PuffLoader';

const Settings = () => {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchRetention = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/settings/retention`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDays(res.data.days);
      } catch (err) {
        toast.error(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRetention();
  }, [token]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/settings/retention`,
        { days },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Retention updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pt-20">
      <h1 className="text-2xl mb-4 font-bold">Settings</h1>
      {loading ? (
        <Spinner color="#3B82F6" />
      ) : (
        <>
          <label className="block mb-2">Data Retention Days (0 for never delete):</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="p-2 border rounded mb-4 w-full sm:w-auto"
            min="0"
            aria-label="Data Retention Days"
          />
          <button onClick={handleUpdate} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200">
            Update
          </button>
        </>
      )}
    </div>
  );
};

export default Settings;