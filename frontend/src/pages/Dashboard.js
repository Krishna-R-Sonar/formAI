import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PuffLoader';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchForms = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/forms/myforms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForms(res.data);
      } catch (err) {
        toast.error(err.response?.data?.error || err.message);
        if (err.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [token, navigate]);

  const handleGenerate = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate a form');
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/generate-form',
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Check if the generated form has a generic title
      if (res.data.title && (
        res.data.title.toLowerCase().includes('create') ||
        res.data.title.toLowerCase().includes('feedback form') ||
        res.data.title.toLowerCase().includes('survey')
      )) {
        toast.success('Form generated! Please review and customize the title before saving.');
      } else {
        toast.success('Form generated successfully!');
      }
      
      // Navigate to builder with the AI-generated form data (not yet saved)
      navigate('/builder', { state: { form: res.data } });
      setPrompt(''); // Clear the prompt after successful generation
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">Create, manage, and analyze your forms with AI-powered insights</p>
        </div>

        {/* AI Form Generation Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                           <div className="flex-1">
                 <h2 className="text-xl font-semibold text-gray-900 mb-2">🤖 AI Form Generator</h2>
                 <p className="text-gray-600 mb-4">Describe your form in plain English and let AI create it for you</p>
                 <div className="flex flex-col sm:flex-row gap-3">
                   <input
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                     placeholder="e.g., 'Customer feedback form for a restaurant'"
                     aria-label="AI Form Generation Prompt"
                   />
                   <div className="text-xs text-gray-500 mt-1">
                     💡 Better prompts: "Restaurant customer experience survey", "Event registration form", "Product evaluation survey"
                   </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  data-tip="Generate a form using AI based on your prompt"
                >
                  {loading ? <Spinner color="#ffffff" size={20} /> : '✨ Generate'}
                </button>
              </div>
            </div>
            <div className="lg:ml-6">
              <button
                onClick={() => navigate('/builder')}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 border-2 border-gray-900 hover:border-gray-700"
              >
                + Create Manual Form
              </button>
            </div>
          </div>
          <ReactTooltip />
        </div>

        {/* Forms Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Forms</h2>
            <div className="text-sm text-gray-500">
              {forms.length} form{forms.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner color="#3B82F6" size={40} />
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-600 mb-4">Create your first form to get started</p>
              <button
                onClick={() => navigate('/builder')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
              >
                Create Your First Form
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <div key={form._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{form.title}</h3>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-3">📊 {form.questions?.length || 0} questions</span>
                      <span>🕒 {new Date(form.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => navigate(`/builder/${form._id}`)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        aria-label={`Edit ${form.title}`}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => navigate(`/responses/${form._id}`)}
                        className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                        aria-label={`View Responses for ${form.title}`}
                      >
                        📊 Responses
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-center">
                        <QRCodeCanvas 
                          value={`http://localhost:3000/form/${form._id}`} 
                          size={80} 
                          className="mx-auto mb-2" 
                        />
                        <a 
                          href={`/form/${form._id}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                          🔗 Share Form
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
