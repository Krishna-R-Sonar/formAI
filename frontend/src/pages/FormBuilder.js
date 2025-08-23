import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PuffLoader';
import Modal from 'react-modal';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import { getApiUrl } from '../config';

Modal.setAppElement('#root');

const FormBuilder = () => {
  const { formId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [form, setForm] = useState(state?.form || { title: '', questions: [], theme: { primaryColor: '#3B82F6', logoUrl: '' }, isPublic: true });
  const [isNewForm, setIsNewForm] = useState(!formId);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [undoStack, setUndoStack] = useState([]);

  useEffect(() => {
    if (formId) {
      setLoading(true);
      setIsNewForm(false);
      const fetchForm = async () => {
        try {
          const res = await axios.get(getApiUrl(`/api/forms/${formId}`), {
            headers: { Authorization: `Bearer ${token}` },
          });
          setForm(res.data);
        } catch (err) {
          toast.error('Failed to load form');
        } finally {
          setLoading(false);
        }
      };
      fetchForm();
    } else if (state?.form) {
      // AI-generated form or new form from state
      setIsNewForm(true);
      setForm(state.form);
    }
  }, [formId, token, state]);

  const handleAddQuestion = (type) => {
    setForm({
      ...form,
      questions: [...form.questions, { type, label: 'New Question', options: [], required: false }],
    });
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index][field] = value;
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index].options.push('');
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleUpdateOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setForm({ ...form, questions: updatedQuestions });
  };

  const openDeleteModal = (index) => {
    setDeleteIndex(index);
    setModalIsOpen(true);
  };

  const confirmDelete = () => {
    const updatedQuestions = [...form.questions];
    const deleted = updatedQuestions.splice(deleteIndex, 1)[0];
    setForm({ ...form, questions: updatedQuestions });
    setUndoStack([...undoStack, { action: 'delete', question: deleted, index: deleteIndex }]);
    toast('Question deleted', { duration: 4000, action: { label: 'Undo', onClick: handleUndo } });
    setModalIsOpen(false);
  };

  const handleUndo = () => {
    const lastAction = undoStack.pop();
    if (lastAction.action === 'delete') {
      const updatedQuestions = [...form.questions];
      updatedQuestions.splice(lastAction.index, 0, lastAction.question);
      setForm({ ...form, questions: updatedQuestions });
    }
    setUndoStack([...undoStack]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedQuestions = Array.from(form.questions);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);
    setForm({ ...form, questions: reorderedQuestions });
  };

  const handleSave = async () => {
    // Validate form title
    if (!form.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }
    
    // Check for duplicate titles in existing forms
    if (isNewForm && form.title.trim().toLowerCase() === 'create event feedback form') {
      toast.error('Please use a more specific and unique title for your form');
      return;
    }
    
    setLoading(true);
    try {
      let res;
      if (isNewForm) {
        res = await axios.post(getApiUrl('/api/forms/create'), form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Form created successfully!');
      } else {
        res = await axios.put(getApiUrl(`/api/forms/${formId}`), form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Form updated successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Failed to save form');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImproveQuestion = async (index) => {
    setLoading(true);
    try {
      const res = await axios.post(
        getApiUrl('/api/ai/improve-question'),
        { label: form.questions[index].label },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.suggestion) {
        handleUpdateQuestion(index, 'label', res.data.suggestion);
        toast.success('Question improved!');
      }
    } catch (err) {
      toast.error('Failed to improve question');
    } finally {
      setLoading(false);
    }
  };

  useHotkeys('ctrl+enter', () => handleSave(), { enabled: !loading });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 pt-24">
        {loading && (
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="text-center">
              <Spinner color="#3B82F6" size={40} />
              <p className="mt-4 text-gray-600">Saving form...</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {isNewForm ? 'Create New Form' : 'Edit Form'}
            </h1>
            {state?.form && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                ✨ AI Generated
              </span>
            )}
          </div>
          <p className="text-gray-600">
            {isNewForm ? 'Build your form step by step or use AI to generate it automatically' : 'Make changes to your existing form'}
          </p>
        </div>

        {/* Form Title Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Form Title</label>
            {isNewForm && (
              <button
                type="button"
                onClick={() => {
                  const suggestions = [
                    "Customer Experience Survey",
                    "Event Registration & Feedback",
                    "Product Evaluation Form",
                    "Service Quality Assessment",
                    "User Satisfaction Survey"
                  ];
                  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                  setForm({ ...form, title: randomSuggestion });
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                💡 Get Title Suggestion
              </button>
            )}
          </div>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            placeholder="Enter a descriptive title for your form..."
            aria-label="Form Title"
          />
          {isNewForm && (
            <p className="mt-2 text-xs text-gray-500">
              💡 Tip: Use specific, descriptive titles like "Restaurant Customer Feedback" instead of generic ones
            </p>
          )}
        </div>

        {/* Theme & Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎨 Theme & Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.theme.primaryColor}
                  onChange={(e) => setForm({ ...form, theme: { ...form.theme, primaryColor: e.target.value } })}
                  className="w-12 h-12 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                  aria-label="Primary Color Picker"
                />
                <span className="text-sm text-gray-500">{form.theme.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                value={form.theme.logoUrl}
                onChange={(e) => setForm({ ...form, theme: { ...form.theme, logoUrl: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://example.com/logo.png"
                aria-label="Logo URL"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.isPublic} 
                  onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} 
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-label="Make Form Public" 
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Make form public</span>
              </label>
            </div>
          </div>
        </div>

        {/* Add Question Types */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Add Questions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { type: 'text', icon: '📝', label: 'Text' },
              { type: 'mcq', icon: '🔘', label: 'Multiple Choice' },
              { type: 'checkbox', icon: '☑️', label: 'Checkbox' },
              { type: 'dropdown', icon: '📋', label: 'Dropdown' },
              { type: 'file', icon: '📁', label: 'File Upload' },
              { type: 'rating', icon: '⭐', label: 'Rating' }
            ].map(({ type, icon, label }) => (
              <button 
                key={type} 
                onClick={() => handleAddQuestion(type)} 
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
              >
                <span className="text-2xl mb-2">{icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{label}</span>
              </button>
            ))}
          </div>
        </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {form.questions.map((q, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-4 overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="p-6">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {q.type.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">Question {index + 1}</span>
                            </div>
                            <input 
                              value={q.label} 
                              onChange={(e) => handleUpdateQuestion(index, 'label', e.target.value)} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-medium" 
                              placeholder="Enter your question here..." 
                              aria-label={`Question Label ${index + 1}`} 
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleImproveQuestion(index)} 
                              className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors" 
                              data-tip="Improve question with AI for clarity and engagement" 
                              aria-label="Improve Question with AI"
                            >
                              ✨
                            </button>
                            <button 
                              onClick={() => openDeleteModal(index)} 
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" 
                              aria-label="Delete Question"
                            >
                              🗑️
                            </button>
                            <div className="w-6 h-6 text-gray-400 cursor-move">⋮⋮</div>
                          </div>
                        </div>

                        {/* Question Options */}
                        {['mcq', 'checkbox', 'dropdown'].includes(q.type) && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Options</h4>
                            <div className="space-y-2">
                              {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                  <input 
                                    value={opt} 
                                    onChange={(e) => handleUpdateOption(index, oIndex, e.target.value)} 
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                    placeholder={`Option ${oIndex + 1}`} 
                                    aria-label={`Option ${oIndex + 1} for Question ${index + 1}`} 
                                  />
                                  <button 
                                    onClick={() => handleRemoveOption(index, oIndex)} 
                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" 
                                    aria-label="Remove Option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => handleAddOption(index)} 
                                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 text-sm font-medium" 
                                aria-label="Add Option"
                              >
                                + Add Option
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Question Settings */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <label className="flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={q.required} 
                              onChange={(e) => handleUpdateQuestion(index, 'required', e.target.checked)} 
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                              aria-label="Mark as Required" 
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">Required question</span>
                          </label>
                          <div className="text-xs text-gray-400">Drag to reorder</div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
        {/* Save Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl" 
            aria-label="Save Form"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner color="#ffffff" size={20} />
                <span className="ml-2">Saving...</span>
              </div>
            ) : (
              `💾 ${isNewForm ? 'Create Form' : 'Update Form'} (Ctrl + Enter)`
            )}
          </button>
        </div>

        {/* Enhanced Delete Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="bg-white rounded-2xl shadow-2xl max-w-md mx-auto mt-20 p-0 overflow-hidden"
          overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-600">🗑️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Question</h2>
              <p className="text-gray-600">Are you sure you want to delete this question? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setModalIsOpen(false)} 
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Delete Question
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FormBuilder;
