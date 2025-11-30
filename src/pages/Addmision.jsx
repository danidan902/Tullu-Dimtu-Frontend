import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import QR from '../assets/TelebirrQR.jpg';

const AdmissionForm = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    nationality: 'Ethiopian',
    religion: '',
    photo: null,
    applyingGrade: '',
    lastSchool: '',
    lastGrade: '',
    gradeAverage: '',
    parentName: '',
    relationship: '',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: '',
    address: '',
    birthCertificate: null,
    transcript: null,
    transferCertificate: null,
    paymentReceipt: null
  };

  const paymentMethods = [
    {
      name: "Telebirr",
      color: "green",
      image: QR,
      payCode: "150120",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#3B82F6">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      )
    },
    {
      name: "CBE Birr",
      color: "blue",
      image: QR,
      payCode: "250230",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#10B981">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
        </svg>
      )
    }
  ];

  const [activeMethod, setActiveMethod] = useState(0);
  const currentMethod = paymentMethods[activeMethod];
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const relationships = ['Father', 'Mother', 'Guardian', 'Other'];
  const nationalities = ['Ethiopian', 'Other'];

  // Mouse move effect for background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.nationality) newErrors.nationality = 'Nationality is required';
      if (!formData.photo) newErrors.photo = 'Photo is required';
    }
    
    if (step === 2) {
      if (!formData.applyingGrade) newErrors.applyingGrade = 'Grade is required';
      if (!formData.lastSchool.trim()) newErrors.lastSchool = 'Last school is required';
      if (!formData.lastGrade.trim()) newErrors.lastGrade = 'Last grade is required';
    }
    
    if (step === 3) {
      if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
      if (!formData.relationship) newErrors.relationship = 'Relationship is required';
      if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Phone number is required';
      if (!formData.parentEmail.trim()) {
        newErrors.parentEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
        newErrors.parentEmail = 'Email is invalid';
      }
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }
    
    if (step === 4) {
      if (!formData.birthCertificate) newErrors.birthCertificate = 'Birth certificate is required';
      if (!formData.transcript) newErrors.transcript = 'Transcript is required';
    }
    
    if (step === 5) {
      if (!formData.paymentReceipt) newErrors.paymentReceipt = 'Payment receipt is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(5)) {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== '') {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        formDataToSend.append('paymentMethod', currentMethod.name);
        
        const response = await axios.post('http://localhost:5001/api/admissions', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          setSubmitSuccess(true);
        } else {
          setSubmitError(response.data.message || 'Submission failed. Please try again.');
        }

        setFormData(initialFormData);
      } catch (error) {
        console.error('Submission error:', error);
        setSubmitError(error.response?.data?.message || 'An error occurred during submission. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFileClick = (fieldName) => {
    fileInputRef.current.name = fieldName;
    fileInputRef.current.click();
  };

  // Floating background elements
  const FloatingElements = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
        }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          left: `${100 - mousePosition.x}%`,
          top: `${100 - mousePosition.y}%`,
        }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl opacity-15"
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          left: `${mousePosition.x * 0.7}%`,
          top: `${mousePosition.y * 0.7}%`,
        }}
      />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingElements />
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.div 
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold text-white sm:text-5xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Tullu Dimtu Secondary School
            </motion.h1>
            
            <motion.h2 
              className="text-xl font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Admission Application
            </motion.h2>
            
            <motion.p 
              className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Begin your educational journey with us. Complete the form below to apply for admission for the upcoming academic year.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Enhanced Progress Bar */}
            <div className="px-8 py-6 border-b border-white/20 bg-white/5">
              <div className="flex justify-between mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <motion.div 
                    key={step} 
                    className="flex flex-col items-center relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 ${
                        currentStep >= step 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
                          : 'bg-white/20 backdrop-blur-sm border border-white/30'
                      } transition-all duration-300 text-sm font-semibold`}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: currentStep >= step ? "0 10px 30px -5px rgba(59, 130, 246, 0.5)" : "0 5px 15px -3px rgba(255, 255, 255, 0.2)"
                      }}
                    >
                      {currentStep > step ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={currentStep >= step ? 'text-white' : 'text-gray-300'}>{step}</span>
                      )}
                    </motion.div>
                    <span className={`text-xs mt-2 font-medium ${currentStep >= step ? 'text-white' : 'text-gray-400'} transition-colors duration-300`}>
                      {step === 1 ? 'Personal' : step === 2 ? 'Academic' : step === 3 ? 'Parent' : step === 4 ? 'Documents' : 'Payment'}
                    </span>
                    
                    {/* Connection line */}
                    {step < 5 && (
                      <div className="absolute top-6 left-12 w-16 h-0.5 bg-white/30 -z-10">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: currentStep > step ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                          style={{ originX: 0 }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
                  initial={{ width: `${(currentStep - 1) * 20}%` }}
                  animate={{ width: `${(currentStep - 1) * 20}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                accept="image/*,.pdf"
              />

              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="p-12 text-center"
                  >
                    <motion.div 
                      className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-2xl shadow-green-500/25 mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <motion.svg 
                        className="h-12 w-12 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </motion.div>
                    
                    <motion.h3 
                      className="text-3xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Application Submitted Successfully!
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Thank you for choosing Tullu Dimtu Secondary School. Your application has been received and is being processed.
                      You will receive a confirmation email with further instructions within 3 business days.
                    </motion.p>
                    
                    <motion.button
                      type="button"
                      className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-2xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                      onClick={() => setSubmitSuccess(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </motion.div>
                ) : currentStep === 1 ? (
                  <FormStep1 
                    formData={formData} 
                    errors={errors} 
                    handleChange={handleChange} 
                    handleFileClick={handleFileClick}
                    nationalities={nationalities}
                  />
                ) : currentStep === 2 ? (
                  <FormStep2 
                    formData={formData} 
                    errors={errors} 
                    handleChange={handleChange}
                    grades={grades}
                  />
                ) : currentStep === 3 ? (
                  <FormStep3 
                    formData={formData} 
                    errors={errors} 
                    handleChange={handleChange}
                    relationships={relationships}
                  />
                ) : currentStep === 4 ? (
                  <FormStep4 
                    formData={formData} 
                    errors={errors} 
                    handleFileClick={handleFileClick}
                  />
                ) : (
                  <FormStep5 
                    formData={formData}
                    errors={errors}
                    handleFileClick={handleFileClick}
                    activeMethod={activeMethod}
                    setActiveMethod={setActiveMethod}
                    paymentMethods={paymentMethods}
                    currentMethod={currentMethod}
                    submitError={submitError}
                  />
                )}
              </AnimatePresence>

              {!submitSuccess && (
                <div className="px-8 py-6 bg-white/5 backdrop-blur-lg border-t border-white/20 flex justify-between">
                  {currentStep > 1 ? (
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-6 py-3 border border-white/30 text-sm font-medium rounded-xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300"
                      whileHover={{ scale: 1.02, x: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </motion.button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 5 ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white ${
                        isSubmitting 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300`}
                      whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.svg 
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </motion.svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </motion.button>
                  )}
                </div>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-sm text-gray-400"
          >
            <p>Need help? Contact admissions office at <span className="text-blue-400">admissions@tulludimtu.edu</span> or call <span className="text-blue-400">+251 123 456 789</span></p>
            <p className="mt-2">© {new Date().getFullYear()} Tullu Dimtu Secondary School. All rights reserved. Developed by Daniel sheleme.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Individual form step components for better organization
const FormStep1 = ({ formData, errors, handleChange, handleFileClick, nationalities }) => (
  <motion.div
    key="step1"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.4 }}
    className="p-8"
  >
    <motion.h3 
      className="text-2xl font-bold text-white mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      Personal Information
    </motion.h3>
    <motion.p 
      className="text-gray-300 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Tell us about yourself
    </motion.p>
    
    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
      {[
        { id: 'firstName', label: 'First Name *', type: 'text', span: 3 },
        { id: 'lastName', label: 'Last Name *', type: 'text', span: 3 },
        { id: 'gender', label: 'Gender *', type: 'select', span: 3, options: ['', 'Male', 'Female', 'Other'] },
        { id: 'dob', label: 'Date of Birth *', type: 'date', span: 3 },
        { id: 'nationality', label: 'Nationality *', type: 'select', span: 3, options: nationalities },
        { id: 'religion', label: 'Religion (Optional)', type: 'text', span: 3 },
      ].map((field, index) => (
        <motion.div
          key={field.id}
          className={`sm:col-span-${field.span}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
            {field.label}
          </label>
          <div className="relative">
            {field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className={`block w-full rounded-xl bg-white/5 backdrop-blur-sm border ${
                  errors[field.id] ? 'border-red-400/50' : 'border-white/20'
                } text-white placeholder-gray-400 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 py-3 px-4`}
              >
                {field.options.map(option => (
                  <option key={option} value={option} className="text-gray-900">
                    {option || 'Select...'}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.id}
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className={`block w-full rounded-xl bg-white/5 backdrop-blur-sm border ${
                  errors[field.id] ? 'border-red-400/50' : 'border-white/20'
                } text-white placeholder-gray-400 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 py-3 px-4`}
                placeholder={`Enter ${field.label.toLowerCase().replace(' *', '')}`}
              />
            )}
          </div>
          {errors[field.id] && (
            <motion.p 
              className="mt-2 text-sm text-red-400 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </motion.p>
          )}
        </motion.div>
      ))}

      <motion.div
        className="sm:col-span-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Passport-size Photo *
        </label>
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <button
            type="button"
            onClick={() => handleFileClick('photo')}
            className="inline-flex items-center px-6 py-3 border border-white/30 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formData.photo ? formData.photo.name : 'Upload Photo'}
          </button>
          {formData.photo && (
            <span className="ml-4 text-sm text-green-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Selected
            </span>
          )}
        </motion.div>
        {errors.photo && (
          <motion.p 
            className="mt-2 text-sm text-red-400 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {errors.photo}
          </motion.p>
        )}
        <p className="mt-2 text-xs text-gray-400">
          JPEG or PNG, max 2MB
        </p>
      </motion.div>
    </div>
  </motion.div>
);

const FormStep2 = ({ formData, errors, handleChange, grades }) => (
  <motion.div
    key="step2"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.4 }}
    className="p-8"
  >
    <motion.h3 
      className="text-2xl font-bold text-white mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      Academic Information
    </motion.h3>
    <motion.p 
      className="text-gray-300 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Your educational background
    </motion.p>
    
    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
      {[
        { id: 'applyingGrade', label: 'Applying for Grade *', type: 'select', span: 3, options: ['', ...grades] },
        { id: 'lastGrade', label: 'Last Grade Completed *', type: 'text', span: 3 },
        { id: 'lastSchool', label: 'Last School Attended *', type: 'text', span: 6 },
        { id: 'gradeAverage', label: 'Grade Average (Optional)', type: 'text', span: 3, placeholder: 'e.g., 3.8 GPA' },
      ].map((field, index) => (
        <motion.div
          key={field.id}
          className={`sm:col-span-${field.span}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
            {field.label}
          </label>
          <div className="relative">
            {field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className={`block w-full rounded-xl bg-white/5 backdrop-blur-sm border ${
                  errors[field.id] ? 'border-red-400/50' : 'border-white/20'
                } text-white placeholder-gray-400 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 py-3 px-4`}
              >
                {field.options.map(option => (
                  <option key={option} value={option} className="text-gray-900">
                    {option || 'Select...'}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.id}
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className={`block w-full rounded-xl bg-white/5 backdrop-blur-sm border ${
                  errors[field.id] ? 'border-red-400/50' : 'border-white/20'
                } text-white placeholder-gray-400 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 py-3 px-4`}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase().replace(' *', '')}`}
              />
            )}
          </div>
          {errors[field.id] && (
            <motion.p 
              className="mt-2 text-sm text-red-400 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </motion.p>
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const FormStep3 = ({ formData, errors, handleChange, relationships }) => (
  <motion.div
    key="step3"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.4 }}
    className="p-8"
  >
    <motion.h3 
      className="text-2xl font-bold text-white mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      Parent/Guardian Information
    </motion.h3>
    <motion.p 
      className="text-gray-300 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Contact details of parent or guardian
    </motion.p>
    
    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
      {[
        { id: 'parentName', label: 'Full Name *', type: 'text', span: 6 },
        { id: 'relationship', label: 'Relationship to Student *', type: 'select', span: 3, options: ['', ...relationships] },
        { id: 'parentOccupation', label: 'Occupation (Optional)', type: 'text', span: 3 },
        { id: 'parentPhone', label: 'Phone Number *', type: 'tel', span: 3 },
        { id: 'parentEmail', label: 'Email Address *', type: 'email', span: 3 },
        { id: 'address', label: 'Home Address *', type: 'textarea', span: 6 },
      ].map((field, index) => (
        <motion.div
          key={field.id}
          className={`sm:col-span-${field.span}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
            {field.label}
          </label>
          <div className="relative">
            {field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className={`block w-full rounded-xl bg-white/5 backdrop-blur-sm border ${
                  errors[field.id] ? 'border-red-400/50' : 'border-white/20'
                } text-white placeholder-gray-400 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 py-3 px-4`}
              >
                {field.options.map(option => (
                  <option key={option} value={option} className="text-gray-900">
                    {option || 'Select...'}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.id}
                rows={3}
                value={formData[field.id]}
                onChange={handleChange}
                className={`block w-full rounded-xl bg-white/5 backdrop-blur-sm border ${
                  errors[field.id] ? 'border-red-400/50' : 'border-white/20'
                } text-white placeholder-gray-400 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 py-3 px-4 resize-none`}
                placeholder={`Enter ${field.label.toLowerCase().replace(' *', '')}`}
              />
            ) : (
              <input
                type={field.type}
                name={field.id}
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className={`block w-full rounded-xl bg-white/5 backdrop-blur-sm border ${
                  errors[field.id] ? 'border-red-400/50' : 'border-white/20'
                } text-white placeholder-gray-400 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 py-3 px-4`}
                placeholder={`Enter ${field.label.toLowerCase().replace(' *', '')}`}
              />
            )}
          </div>
          {errors[field.id] && (
            <motion.p 
              className="mt-2 text-sm text-red-400 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </motion.p>
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const FormStep4 = ({ formData, errors, handleFileClick }) => (
  <motion.div
    key="step4"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.4 }}
    className="p-8"
  >
    <motion.h3 
      className="text-2xl font-bold text-white mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      Required Documents
    </motion.h3>
    <motion.p 
      className="text-gray-300 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Upload the necessary documents for your application
    </motion.p>
    
    <div className="grid grid-cols-1 gap-6">
      {[
        { id: 'birthCertificate', label: 'Birth Certificate *', description: 'PDF or scanned image, max 5MB' },
        { id: 'transcript', label: 'Transcript/Report Card *', description: 'PDF or scanned image, max 5MB' },
        { id: 'transferCertificate', label: 'Transfer Certificate (If Applicable)', description: 'PDF or scanned image, max 5MB' },
      ].map((doc, index) => (
        <motion.div
          key={doc.id}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:border-white/30 transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-medium">{doc.label}</h4>
                <p className="text-gray-400 text-sm mt-1">{doc.description}</p>
              </div>
            </div>
            
            <motion.button
              type="button"
              onClick={() => handleFileClick(doc.id)}
              className="inline-flex items-center px-4 py-2 border border-white/30 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {formData[doc.id] ? (
                <>
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Change
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </>
              )}
            </motion.button>
          </div>
          
          {formData[doc.id] && (
            <motion.div 
              className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <p className="text-green-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Selected:</span> {formData[doc.id].name}
              </p>
            </motion.div>
          )}
          
          {errors[doc.id] && (
            <motion.p 
              className="mt-3 text-sm text-red-400 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors[doc.id]}
            </motion.p>
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const FormStep5 = ({ formData, errors, handleFileClick, activeMethod, setActiveMethod, paymentMethods, currentMethod, submitError }) => (
  <motion.div
    key="step5"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.4 }}
    className="p-8"
  >
    <div className="max-w-2xl mx-auto">
      <motion.div 
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-3xl font-bold text-center text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          🎓 Admission Fee Payment
        </motion.h2>
        
        <motion.p 
          className="text-center text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Complete your application by paying the admission fee
        </motion.p>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-6 mb-6 border border-blue-500/20">
          <p className="font-semibold text-center text-blue-400 mb-6 text-lg">
            Pay via Telebirr or CBE Birr
          </p>
          
          {/* Payment Method Selector */}
          <div className="flex justify-center space-x-4 mb-8">
            {paymentMethods.map((method, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveMethod(index)}
                className={`flex items-center px-6 py-3 rounded-2xl transition-all duration-300 ${
                  activeMethod === index 
                    ? `bg-gradient-to-r from-${method.color}-500 to-${method.color}-600 shadow-lg shadow-${method.color}-500/25 text-white` 
                    : `bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {method.icon}
                <span className="ml-2 font-medium">{method.name}</span>
              </motion.button>
            ))}
          </div>
          
          {/* QR Code Display */}
          <motion.div 
            className="flex flex-col items-center mb-6"
            key={activeMethod}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`w-56 h-56 mb-4 border-2 border-${currentMethod.color}-400 rounded-2xl bg-white p-3 shadow-2xl shadow-${currentMethod.color}-500/25 flex items-center justify-center`}>
              <div className={`w-full h-full bg-${currentMethod.color}-50 flex items-center justify-center rounded-xl`}>
                <img 
                  src={currentMethod.image} 
                  alt={`${currentMethod.name} QR Code`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-${currentMethod.color}-500/20 border border-${currentMethod.color}-400/30`}>
              <div className={`w-3 h-3 rounded-full bg-${currentMethod.color}-400`}></div>
              <span className={`text-sm font-medium text-${currentMethod.color}-300`}>{currentMethod.name}</span>
            </div>
          </motion.div>
          
          <p className="text-center text-gray-300 mb-4 text-sm">
            Scan the QR Code with your {currentMethod.name} app
          </p>
          
          <div className="text-center">
            <p className="font-medium text-gray-300 mb-2">{currentMethod.name} Pay Code:</p>
            <motion.div 
              className={`text-2xl font-mono bg-white/10 px-6 py-3 rounded-xl inline-block border border-${currentMethod.color}-400/30 shadow-lg`}
              whileHover={{ scale: 1.02 }}
            >
              {currentMethod.payCode}
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-6 text-center font-bold text-xl bg-white/10 rounded-xl py-3 px-6 inline-block mx-auto border border-white/20"
            whileHover={{ scale: 1.05 }}
          >
            💵 Fee: <span className="text-blue-400">500 ETB</span>
          </motion.div>
        </div>

        <hr className="my-6 border-t border-white/20" />

        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-center mb-4 flex items-center justify-center text-white">
            <span className="bg-blue-500/20 p-2 rounded-full mr-3">📤</span>
            Upload Payment Receipt
          </h3>
          <div className="flex flex-col items-center">
            <motion.button
              type="button"
              onClick={() => handleFileClick('paymentReceipt')}
              className="inline-flex items-center px-6 py-3 border border-white/30 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {formData.paymentReceipt ? formData.paymentReceipt.name : 'Select Receipt'}
            </motion.button>
            {formData.paymentReceipt && (
              <motion.span 
                className="mt-3 text-sm text-green-400 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Receipt uploaded successfully
              </motion.span>
            )}
            {errors.paymentReceipt && (
              <motion.p 
                className="mt-2 text-sm text-red-400 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.paymentReceipt}
              </motion.p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              JPEG, PNG or PDF, max 5MB
            </p>
          </div>
        </motion.div>

        {submitError && (
          <motion.div 
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {submitError}
          </motion.div>
        )}
      </motion.div>
    </div>
  </motion.div>
);

export default AdmissionForm;
