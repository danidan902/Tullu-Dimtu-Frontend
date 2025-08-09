import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import QR from '../assets/TelebirrQR.jpg'

const AdmissionForm = () => {

 const initialFormData = {
    // Personal Information
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    nationality: 'Ethiopian',
    religion: '',
    photo: null,

    // Academic Information
    applyingGrade: '',
    lastSchool: '',
    lastGrade: '',
    gradeAverage: '',

    // Parent/Guardian Information
    parentName: '',
    relationship: '',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: '',
    address: '',

    // Documents
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

  const [activeMethod, setActiveMethod] = useState(0); // 0 for Telebirr, 1 for CBE Birr
  const currentMethod = paymentMethods[activeMethod];
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    nationality: 'Ethiopian',
    religion: '',
    photo: null,
    
    // Academic Information
    applyingGrade: '',
    lastSchool: '',
    lastGrade: '',
    gradeAverage: '',
    
    // Parent/Guardian Information
    parentName: '',
    relationship: '',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: '',
    address: '',
    
    // Documents
    birthCertificate: null,
    transcript: null,
    transferCertificate: null,
    
    paymentReceipt: null
  });
  
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const relationships = ['Father', 'Mother', 'Guardian', 'Other'];
  const nationalities = ['Ethiopian', 'Other'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error when field is edited
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
        // Create FormData object for file uploads
        const formDataToSend = new FormData();
        
        // Append all form fields to FormData
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('dob', formData.dob);
        formDataToSend.append('nationality', formData.nationality);
        formDataToSend.append('religion', formData.religion);
        formDataToSend.append('applyingGrade', formData.applyingGrade);
        formDataToSend.append('lastSchool', formData.lastSchool);
        formDataToSend.append('lastGrade', formData.lastGrade);
        formDataToSend.append('gradeAverage', formData.gradeAverage);
        formDataToSend.append('parentName', formData.parentName);
        formDataToSend.append('relationship', formData.relationship);
        formDataToSend.append('parentPhone', formData.parentPhone);
        formDataToSend.append('parentEmail', formData.parentEmail);
        formDataToSend.append('parentOccupation', formData.parentOccupation);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('paymentMethod', currentMethod.name);
        
        // Append files if they exist
        if (formData.photo) formDataToSend.append('photo', formData.photo);
        if (formData.birthCertificate) formDataToSend.append('birthCertificate', formData.birthCertificate);
        if (formData.transcript) formDataToSend.append('transcript', formData.transcript);
        if (formData.transferCertificate) formDataToSend.append('transferCertificate', formData.transferCertificate);
        if (formData.paymentReceipt) formDataToSend.append('paymentReceipt', formData.paymentReceipt);
        
        // Send data to backend
        const response = await axios.post('https://tullu-dimtu-1.onrender.com/api/admissions', formDataToSend, {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tullu Dimtu Secondary School
          </h1>
          <h2 className="mt-3 text-xl font-semibold text-indigo-600">Admission Application</h2>
          <p className="mt-2 text-gray-600">
            Complete the form below to apply for admission for the upcoming academic year.
          </p>
        </motion.div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'} transition-colors duration-300 text-sm`}
                  >
                    {step}
                  </div>
                  <span className={`text-xs mt-1 ${currentStep >= step ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                    {step === 1 ? 'Personal' : step === 2 ? 'Academic' : step === 3 ? 'Parent' : step === 4 ? 'Documents' : 'Payment'}
                  </span>
                </div> 
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-indigo-600 h-2 rounded-full"
                initial={{ width: `${(currentStep - 1) * 20}%` }}
                animate={{ width: `${(currentStep - 1) * 20}%` }}
                transition={{ duration: 0.5 }}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 text-center"
                >
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">Application Submitted Successfully!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Thank you for applying to Tullu Dimtu Secondary School. Your application is being processed.
                    You will receive a confirmation email within 3 business days.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setSubmitSuccess(false)}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              ) : currentStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.firstName ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.lastName ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender *
                      </label>
                      <div className="mt-1">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.gender ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                        Date of Birth *
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="dob"
                          id="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.dob ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                        Nationality *
                      </label>
                      <div className="mt-1">
                        <select
                          id="nationality"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.nationality ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        >
                          {nationalities.map(nation => (
                            <option key={nation} value={nation}>{nation}</option>
                          ))}
                        </select>
                        {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="religion" className="block text-sm font-medium text-gray-700">
                        Religion (Optional)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="religion"
                          id="religion"
                          value={formData.religion}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Passport-size Photo *
                      </label>
                      <div className="mt-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleFileClick('photo')}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {formData.photo ? formData.photo.name : 'Upload Photo'}
                        </button>
                        {formData.photo && (
                          <span className="ml-3 text-sm text-gray-500">
                            {formData.photo.name}
                          </span>
                        )}
                      </div>
                      {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                      <p className="mt-1 text-xs text-gray-500">
                        JPEG or PNG, max 2MB
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : currentStep === 2 ? (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Academic Information</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="applyingGrade" className="block text-sm font-medium text-gray-700">
                        Applying for Grade *
                      </label>
                      <div className="mt-1">
                        <select
                          id="applyingGrade"
                          name="applyingGrade"
                          value={formData.applyingGrade}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.applyingGrade ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        >
                          <option value="">Select Grade</option>
                          {grades.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                        {errors.applyingGrade && <p className="mt-1 text-sm text-red-600">{errors.applyingGrade}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="lastGrade" className="block text-sm font-medium text-gray-700">
                        Last Grade Completed *
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="lastGrade"
                          id="lastGrade"
                          value={formData.lastGrade}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.lastGrade ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.lastGrade && <p className="mt-1 text-sm text-red-600">{errors.lastGrade}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="lastSchool" className="block text-sm font-medium text-gray-700">
                        Last School Attended *
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="lastSchool"
                          id="lastSchool"
                          value={formData.lastSchool}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.lastSchool ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.lastSchool && <p className="mt-1 text-sm text-red-600">{errors.lastSchool}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="gradeAverage" className="block text-sm font-medium text-gray-700">
                        Grade Average (Optional)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="gradeAverage"
                          id="gradeAverage"
                          value={formData.gradeAverage}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                          placeholder="e.g., 3.8 GPA"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : currentStep === 3 ? (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Parent/Guardian Information</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="parentName"
                          id="parentName"
                          value={formData.parentName}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.parentName ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.parentName && <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                        Relationship to Student *
                      </label>
                      <div className="mt-1">
                        <select
                          id="relationship"
                          name="relationship"
                          value={formData.relationship}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.relationship ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        >
                          <option value="">Select Relationship</option>
                          {relationships.map(rel => (
                            <option key={rel} value={rel}>{rel}</option>
                          ))}
                        </select>
                        {errors.relationship && <p className="mt-1 text-sm text-red-600">{errors.relationship}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="parentOccupation" className="block text-sm font-medium text-gray-700">
                        Occupation (Optional)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="parentOccupation"
                          id="parentOccupation"
                          value={formData.parentOccupation}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="parentPhone"
                          id="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.parentPhone ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.parentPhone && <p className="mt-1 text-sm text-red-600">{errors.parentPhone}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="parentEmail"
                          id="parentEmail"
                          value={formData.parentEmail}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.parentEmail ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.parentEmail && <p className="mt-1 text-sm text-red-600">{errors.parentEmail}</p>}
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Home Address *
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="address"
                          name="address"
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                          className={`block w-full rounded-md ${errors.address ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border`}
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : currentStep === 4 ? (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Required Documents</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Birth Certificate *
                      </label>
                      <div className="mt-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleFileClick('birthCertificate')}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {formData.birthCertificate ? formData.birthCertificate.name : 'Upload Document'}
                        </button>
                        {formData.birthCertificate && (
                          <span className="ml-3 text-sm text-gray-500">
                            {formData.birthCertificate.name}
                          </span>
                        )}
                      </div>
                      {errors.birthCertificate && <p className="mt-1 text-sm text-red-600">{errors.birthCertificate}</p>}
                      <p className="mt-1 text-xs text-gray-500">
                        PDF or scanned image, max 5MB
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Transcript/Report Card *
                      </label>
                      <div className="mt-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleFileClick('transcript')}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {formData.transcript ? formData.transcript.name : 'Upload Document'}
                        </button>
                        {formData.transcript && (
                          <span className="ml-3 text-sm text-gray-500">
                            {formData.transcript.name}
                          </span>
                        )}
                      </div>
                      {errors.transcript && <p className="mt-1 text-sm text-red-600">{errors.transcript}</p>}
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Transfer Certificate (If Applicable)
                      </label>
                      <div className="mt-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleFileClick('transferCertificate')}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {formData.transferCertificate ? formData.transferCertificate.name : 'Upload Document'}
                        </button>
                        {formData.transferCertificate && (
                          <span className="ml-3 text-sm text-gray-500">
                            {formData.transferCertificate.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto border border-gray-100 transform transition-all hover:scale-[1.01]">
                    <h2 className="text-3xl font-bold text-center text-gradient bg-gradient-to-r  to-purple-600 mb-6">
                      🎓 Admission Fee Payment
                    </h2>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-100">
                      <p className="font-semibold text-center text-blue-800 mb-4 text-lg">
                        Pay via Telebirr or CBE Birr
                      </p>
                      
                      {/* Payment Method Selector */}
                      <div className="flex justify-center space-x-4 mb-6">
                        {paymentMethods.map((method, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveMethod(index)}
                            className={`flex items-center px-4 py-2 rounded-full transition-all ${activeMethod === index 
                              ? `bg-${method.color}-600 green-white shadow-md` 
                              : `bg-white text-${method.color}-600 border border-${method.color}-200 hover:bg-${method.color}-50`}`}
                          >
                            {method.icon}
                            <span className="ml-2">{method.name}</span>
                          </button>
                        ))}
                      </div>
                      
                      {/* QR Code Display */}
                      <div className="flex flex-col items-center mb-6">
                        <div className={`w-48 h-48 mb-3 border-2 border-${currentMethod.color}-300 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center`}>
                          <div className={`w-full h-full bg-${currentMethod.color}-50 flex items-center justify-center rounded-lg`}>
                             <img 
      src={currentMethod.image} 
      alt={`${currentMethod.name} QR Code`}
      className="w-full h-full object-contain rounded-lg "
    />
                          </div>
                        </div>
                        <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full bg-${currentMethod.color}-100`}>
                          <div className={`w-3 h-3 rounded-full bg-${currentMethod.color}-600`}></div>
                          <span className={`text-sm font-medium text-${currentMethod.color}-800`}>{currentMethod.name}</span>
                        </div>
                      </div>
                      
                      <p className="text-center text-gray-600 mb-3 text-sm">
                        Scan the QR Code with your {currentMethod.name} app
                      </p>
                      
                      <div className="text-center">
                        <p className="font-medium text-gray-700 mb-1">{currentMethod.name} Pay Code:</p>
                        <div className={`text-2xl font-mono bg-white px-4 py-2 rounded-lg inline-block border border-${currentMethod.color}-200 shadow-sm`}>
                          {currentMethod.payCode}
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center font-bold text-xl bg-white/80 rounded-lg py-2 px-4 inline-block mx-auto border border-gray-200">
                        💵 Fee: <span className="text-indigo-700">500 ETB</span>
                      </div>
                    </div>

                    <hr className="my-5 border-t border-gray-200" />

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-center mb-4 flex items-center justify-center">
                        <span className="bg-indigo-100 p-2 rounded-full mr-2">📤</span>
                        Upload Payment Receipt
                      </h3>
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => handleFileClick('paymentReceipt')}
                          className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-md"
                        >
                          {formData.paymentReceipt ? formData.paymentReceipt.name : 'Select Receipt'}
                        </button>
                        {formData.paymentReceipt && (
                          <span className="mt-2 text-sm text-gray-500">
                            {formData.paymentReceipt.name}
                          </span>
                        )}
                        {errors.paymentReceipt && (
                          <p className="mt-1 text-sm text-red-600">{errors.paymentReceipt}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          JPEG, PNG or PDF, max 5MB
                        </p>
                      </div>
                    </div>

                    {submitError && (
                      <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {submitError}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!submitSuccess && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Need help? Contact admissions office at <span className="text-indigo-600">admissions@tulludimtu.edu</span> or call <span className="text-indigo-600">+251 123 456 789</span></p>
          <p className="mt-2">© {new Date().getFullYear()} Tullu Dimtu Secondary School. All rights reserved. Developed by Daniel sheleme.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdmissionForm;
