// File: formAI/frontend/src/pages/ResponseDashboard.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PuffLoader';
import { Tooltip as ReactTooltip } from 'react-tooltip';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResponseDashboard = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [insights, setInsights] = useState({ summary: '', sentiment: 'neutral', keywords: [], trends: [], suggestions: [], anomaly_report: [] });
  const [loading, setLoading] = useState(true);
  const [showWhy, setShowWhy] = useState(false);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const formRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/forms/${formId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(formRes.data);
        const resRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/forms/responses/${formId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResponses(resRes.data);
        const insightRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/ai/insights/${formId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInsights(insightRes.data);
      } catch (err) {
        toast.error(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formId, token]);

  const handleExport = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/forms/export/${formId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `responses-${formId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Exported successfully!');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  if (loading || !form) return <div className="p-4 pt-20 text-center"><Spinner color="#3B82F6" /></div>;

  const chartData = form.questions
    .filter((q) => ['mcq', 'dropdown', 'rating'].includes(q.type))
    .map((q) => {
      const counts = {};
      responses.forEach((r) => {
        const value = r.data[q.label];
        counts[value] = (counts[value] || 0) + 1;
      });
      return {
        label: q.label,
        data: {
          labels: q.type === 'rating' ? [1, 2, 3, 4, 5] : q.options,
          datasets: [
            {
              label: 'Responses',
              data: (q.type === 'rating' ? [1, 2, 3, 4, 5] : q.options).map(
                (opt) => counts[opt] || 0
              ),
              backgroundColor: form.theme.primaryColor,
            },
          ],
        },
      };
    });

  return (
    <div className="p-4 pt-20">
      <h1 className="text-2xl mb-4 font-bold">{form.title} Responses</h1>
      <button onClick={handleExport} className="bg-blue-600 text-white p-2 mb-4 rounded hover:bg-blue-700 transition duration-200">
        Export as CSV
      </button>
      <h2 className="text-xlmb-2 font-semibold">AI Insights</h2>
      <p className="mb-2">Summary: {insights.summary}</p>
      <p className="mb-2">Sentiment: {insights.sentiment} <button onClick={() => setShowWhy(!showWhy)} className="text-blue-600 underline" data-tip="Toggle explanation" aria-label="Toggle AI Explanation">Why?</button></p>
      {showWhy && <p className="text-gray-600 mb-2">Based on keyword analysis and sentiment scoring from responses.</p>}
      <ReactTooltip />
      <h3 className="text-lg font-semibold">Keywords: {insights.keywords.join(', ')}</h3>
      <h3 className="text-lg font-semibold mt-2">Trends:</h3>
      <ul className="list-disc pl-5 mb-2">{insights.trends.map((t, i) => <li key={i}>{t}</li>)}</ul>
      <h3 className="text-lg font-semibold mt-2">Suggestions:</h3>
      <ul className="list-disc pl-5 mb-2">{insights.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
      <h3 className="text-lg font-semibold mt-2">Anomalies:</h3>
      <ul className="list-disc pl-5">{insights.anomaly_report?.map((a, i) => <li key={i}>Response {a.responseId}: {a.reason}</li>) || <li>None</li>}</ul>
      <h2 className="text-xl mb-2 font-semibold mt-4">Response Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border min-w-max">
          <thead>
            <tr>
              {form.questions.map((q) => (
                <th key={q.label} className="border p-2 text-left">
                  {q.label}
                </th>
              ))}
              <th className="border p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((r) => (
              <tr key={r._id}>
                {form.questions.map((q) => (
                  <td key={q.label} className="border p-2">
                    {JSON.stringify(r.data[q.label])}
                  </td>
                ))}
                <td className="border p-2">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-xl mt-4 mb-2 font-semibold">Charts</h2>
      {chartData.map((chart, index) => (
        <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">{chart.label}</h3>
          <Bar data={chart.data} />
        </div>
      ))}
    </div>
  );
};

export default ResponseDashboard;