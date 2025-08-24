// File: formAI/frontend/src/pages/FormView.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PuffLoader';

const FormView = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [allAnswers, setAllAnswers] = useState({});
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [finalMessage, setFinalMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/forms/${formId}`, { 
                    headers: token ? { Authorization: `Bearer ${token}` } : {} 
                });
                setForm(res.data);
                if (res.data && res.data.questions && res.data.questions.length > 0) {
                    setCurrentQuestion(res.data.questions[0]);
                    setCurrentAnswer(res.data.questions[0].type === 'checkbox' ? [] : '');
                } else {
                    setError('Form has no questions');
                }
            } catch (err) {
                console.error('Form fetch error:', err);
                if (err.response?.status === 403) {
                    setError('This form is private and requires authentication');
                } else if (err.response?.status === 404) {
                    setError('Form not found');
                } else {
                    setError('Failed to load form');
                }
                toast.error('Failed to load form');
            } finally {
                setIsLoading(false);
            }
        };
        fetchForm();
    }, [formId, token]);

    const handleNext = () => {
        if (currentQuestion.required && (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0))) {
            setError('This field is required.');
            return;
        }
        
        if (!form?.questions) return;
        
        // Save current answer
        const newAnswers = { ...allAnswers, [currentQuestion.label]: currentAnswer };
        setAllAnswers(newAnswers);
        
        // Move to next question
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < form.questions.length) {
            setCurrentQuestionIndex(nextIndex);
            const nextQuestion = form.questions[nextIndex];
            setCurrentQuestion(nextQuestion);
            setCurrentAnswer(nextQuestion.type === 'checkbox' ? [] : '');
            setProgress((nextIndex / form.questions.length) * 100);
            setError('');
        } else {
            // Form completed
            setIsFinished(true);
            setProgress(100);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            const prevIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(prevIndex);
            const prevQuestion = form.questions[prevIndex];
            setCurrentQuestion(prevQuestion);
            setCurrentAnswer(allAnswers[prevQuestion.label] || (prevQuestion.type === 'checkbox' ? [] : ''));
            setProgress((prevIndex / form.questions.length) * 100);
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (currentQuestion.required && (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0))) {
            setError('This field is required.');
            return;
        }
        
        // Save final answer
        const finalAnswers = { ...allAnswers, [currentQuestion.label]: currentAnswer };
        
        setIsLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/forms/submit/${formId}`, { 
                data: finalAnswers, 
                isConversational: false 
            }, { 
                headers: token ? { Authorization: `Bearer ${token}` } : {} 
            });
            setFinalMessage('Thank you, your response has been submitted!');
            toast.success('Submitted successfully!');
            setIsFinished(true);
        } catch (err) {
            setFinalMessage('There was an error submitting your response.');
            toast.error('Submission failed');
        } finally {
            setIsLoading(false);
        }
    };

    const renderInput = () => {
        if (!currentQuestion) return null;
        let placeholder = '';
        switch (currentQuestion.type) {
            case 'text':
                placeholder = 'e.g., Your answer here';
                return (
                    <input
                        type="text"
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder={placeholder}
                        aria-required={currentQuestion.required}
                        aria-invalid={error ? 'true' : 'false'}
                    />
                );
            case 'mcq':
                return currentQuestion.options.map(opt => (
                    <label key={opt} className="block">
                        <input 
                            type="radio" 
                            name={currentQuestion.label} 
                            value={opt} 
                            onChange={(e) => setCurrentAnswer(e.target.value)} 
                            required={currentQuestion.required}
                            checked={currentAnswer === opt}
                        /> {opt}
                    </label>
                ));
            case 'checkbox':
                return currentQuestion.options.map(opt => (
                    <label key={opt} className="block">
                        <input 
                            type="checkbox" 
                            value={opt} 
                            onChange={(e) => {
                                const newSelection = [...(currentAnswer || [])];
                                if (e.target.checked) {
                                    newSelection.push(opt);
                                } else {
                                    const index = newSelection.indexOf(opt);
                                    if (index > -1) {
                                        newSelection.splice(index, 1);
                                    }
                                }
                                setCurrentAnswer(newSelection);
                            }}
                            checked={(currentAnswer || []).includes(opt)}
                        /> {opt}
                    </label>
                ));
            case 'dropdown':
                return (
                    <select 
                        value={currentAnswer} 
                        onChange={(e) => setCurrentAnswer(e.target.value)} 
                        className="w-full p-2 border rounded" 
                        required={currentQuestion.required}
                    >
                        <option value="">Select an option</option>
                        {currentQuestion.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );
            case 'file':
                return (
                    <input 
                        type="file" 
                        onChange={(e) => setCurrentAnswer({ 
                            name: e.target.files[0]?.name, 
                            size: e.target.files[0]?.size 
                        })} 
                        className="w-full p-2 border rounded" 
                        required={currentQuestion.required} 
                    />
                );
            case 'rating':
                return (
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button 
                                key={star} 
                                onClick={() => setCurrentAnswer(star)} 
                                className={`text-3xl ${currentAnswer >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
                                aria-label={`Rate ${star} stars`}
                                type="button"
                            >
                                ★
                            </button>
                        ))}
                    </div>
                );
            default:
                return <p>Unsupported question type.</p>;
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 text-center pt-20">
                <Spinner color="#3B82F6" />
                <p className="mt-4">Loading form...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center pt-20">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="p-4 text-center pt-20">
                <p>Form not found or loading...</p>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="p-4 text-center pt-20">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-md mx-auto">
                    <p className="font-bold">Thank you!</p>
                    <p>{finalMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">{form.title}</h1>
                    
                    {form.questions && form.questions.length > 0 && (
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Question {currentQuestionIndex + 1} of {form.questions.length}
                            </p>
                        </div>
                    )}

                    {currentQuestion && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                {currentQuestion.label}
                                {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                            </h2>
                            
                            {renderInput()}
                            
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className={`px-4 py-2 rounded ${
                                currentQuestionIndex === 0 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-gray-500 text-white hover:bg-gray-600'
                            }`}
                        >
                            Previous
                        </button>
                        
                        {currentQuestionIndex < form.questions.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormView;