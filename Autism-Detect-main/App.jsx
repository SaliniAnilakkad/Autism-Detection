import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App() {
    const [activeSection, setActiveSection] = useState('about'); 
    const [doctorLoggedIn, setDoctorLoggedIn] = useState(false); 
    const [result, setResult] = useState(null);


  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  const [testResults, setTestResults] = useState({
    '0-3': { ADOS_TOTAL: '', ADOS_COMM: '', ADOS_SOCIAL: '', ADOS_STEREO_BEHAV: '', SRS_RAW_TOTAL: '', DX_GROUP: '' },
    '3-5': { FIQ: '', VIQ: '', ADOS_TOTAL: '', ADOS_COMM: '', ADOS_SOCIAL: '', ADOS_STEREO_BEHAV: '', SRS_RAW_TOTAL: '', DX_GROUP: '' },
    '6-12': { FIQ: '', VIQ: '', PIQ: '', ADOS_TOTAL: '', ADOS_COMM: '', ADOS_SOCIAL: '', ADOS_STEREO_BEHAV: '', SRS_RAW_TOTAL: '', AQ_TOTAL: '', DX_GROUP: '' },
    '13+': { FIQ: '', VIQ: '', PIQ: '', ADOS_TOTAL: '', ADOS_COMM: '', ADOS_SOCIAL: '', ADOS_STEREO_BEHAV: '', SRS_RAW_TOTAL: '', AQ_TOTAL: '', DX_GROUP: '' }
  });

  const About = () => (
    <div>
      <h2>About Us</h2>
      <p>This is an autism detection tool designed to help identify early signs of autism in children.</p>
    </div>
  );

  const Result = ({ result }) => { 
    const resultStyle = { color: result.prediction === 1 ? 'green' : result.prediction === 2 ? 'blue' : 'black', };
    return ( 
    <div> 
        
    <h2>Prediction Result</h2> 
    <p><strong>Patient ID:</strong> {result.patientId}</p> 
    <p><strong>Age:</strong> {result.age}</p> 
    <p><strong>Prediction:</strong> <span style={resultStyle}>{result.prediction === 1 ? 'Not Autistic' : 'Autistic'}</span></p>
    <p><strong>Probability:</strong> {result.probability.join(', ')}</p> 
    
    </div> ); };


const Services = () => {
  const [name, setName] = useState(''); // Define state for name
  const [age, setAge] = useState(''); // Define state for age
  const [gender, setGender] = useState('male'); // Default gender
  const [uniqueId, setUniqueId] = useState(''); // Define state for unique ID

  const handlePersonalDataSubmit = async (event) => {
    event.preventDefault();
    const generatedId = `ID-${Math.floor(Math.random() * 10000)}`;
    setUniqueId(generatedId);
    
    

    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, age, gender, unique_id: generatedId }), // Pass generatedId as unique_id
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log("Data saved successfully:", data);
      
    } else {
      console.error('Failed to register patient');
    }

    
  };

  return (
    <div>
      <h2>Services</h2>
      <form onSubmit={handlePersonalDataSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state on change
          placeholder="Enter your name"
        />
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)} // Update age state on change
          placeholder="Enter your age"
        />
        <label>Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)} // Update gender state on change
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {uniqueId && <p>Your Unique Patient ID: {uniqueId}</p>}
      
    </div>
  );
};







  const Assessment = () => {
      const [selectedCategory, setSelectedCategory] = useState('13+');
      const [testResults, setTestResults] = useState({
          '0-3': { patientId:'',SEX:'',AGE:'',FIQ:'',VIQ:'',PIQ:'',ADOS_TOTAL: '', ADOS_COMM: '', ADOS_SOCIAL: '', ADOS_STEREO_BEHAV: '', SRS_RAW_TOTAL: '',AQ_TOTAL:'' },
          '3-5': { patientId:'',SEX:'',AGE:'',FIQ: '', VIQ: '',PIQ:'', ADOS_TOTAL: '', ADOS_COMM: '', ADOS_SOCIAL: '', ADOS_STEREO_BEHAV: '', SRS_RAW_TOTAL: '',AQ_TOTAL:''},
          '6-12': {patientId:'',SEX:'',AGE:'', FIQ: '', VIQ: '', PIQ: '', ADOS_TOTAL: '', ADOS_COMM: '', ADOS_SOCIAL: '', ADOS_STEREO_BEHAV: '', SRS_RAW_TOTAL: '', AQ_TOTAL: '' },
          '13+': { patientId:'',SEX:'',AGE:'',FIQ: '', VIQ: '', PIQ: '', ADOS_TOTAL: '', ADOS_COMM: '', ADOS_SOCIAL: '', ADOS_STEREO_BEHAV: '', SRS_RAW_TOTAL: '', AQ_TOTAL: '' },
      });
  
      const handleCategoryClick = (category) => setSelectedCategory(category);
  
      const handleTestResultChange = (category, test, value) => {
          setTestResults((prev) => ({
              ...prev,
              [category]: { ...prev[category], [test]: value },
          }));
      };
  
      const handleSubmit = async () => {
        const dataToSend = {
            ...testResults[selectedCategory], // send only the selected category's data
        };
        console.log('Data to send:', dataToSend);
        if (!dataToSend.AGE || isNaN(dataToSend.AGE)) {
            alert('Please enter a valid ADOS_TOTAL value.');
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/model/predict-autism/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
            
            if (response.ok) {
                
                const result = await response.json(); 
                setResult(result); // Set the result in state 
                setActiveSection('result');
            } else {
                console.error('Failed to submit data:', response.statusText);
            }
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };
  
      return (
          <div className="assessment-content">
              <h2>Assessment</h2>
              <ul className="assessment-categories">
                  <li className={selectedCategory === '0-3' ? 'active' : ''} onClick={() => handleCategoryClick('0-3')}>0-3 years</li>
                  <li className={selectedCategory === '3-5' ? 'active' : ''} onClick={() => handleCategoryClick('3-5')}>3-5 years</li>
                  <li className={selectedCategory === '6-12' ? 'active' : ''} onClick={() => handleCategoryClick('6-12')}>6-12 years</li>
                  <li className={selectedCategory === '13+' ? 'active' : ''} onClick={() => handleCategoryClick('13+')}>13 years and older</li>
              </ul>
  
              <div className="test-section">
                  <h3>{selectedCategory} years</h3>
  
                  {/* Render inputs based on selected category */}
                  {selectedCategory === '0-3' && (
                      <>
                        <label>
                              patient_Id
                              <input type="text" value={testResults['0-3'].patientId} onChange={(e) => handleTestResultChange('0-3', 'patientId', e.target.value)} />
                          </label>
                          <label>
                              AGE:
                              <input type="number" value={testResults['0-3'].AGE} onChange={(e) => handleTestResultChange('0-3', 'AGE', e.target.value)} />
                          </label>
                          <label>
                              SEX (1 FOR MALE/ 2 FOR FEMALE):
                              <input type="number" value={testResults['0-3'].SEX} onChange={(e) => handleTestResultChange('0-3', 'SEX', e.target.value)} />
                          </label>
                          <label>
                              FIQ(PUT 0):
                              <input type="number" value={testResults['0-3'].FIQ} onChange={(e) => handleTestResultChange('0-3', 'FIQ', e.target.value)} />
                          </label>
                          <label>
                              VIQ(PUT 0):
                              <input type="number" value={testResults['0-3'].VIQ} onChange={(e) => handleTestResultChange('0-3', 'VIQ', e.target.value)} />
                          </label>
                          <label>
                              PIQ (PUT 0):
                              <input type="number" value={testResults['0-3'].PIQ} onChange={(e) => handleTestResultChange('0-3', 'PIQ', e.target.value)} />
                          </label>
                          <label>
                              ADOS_TOTAL:
                              <input type="number" value={testResults['0-3'].ADOS_TOTAL} onChange={(e) => handleTestResultChange('0-3', 'ADOS_TOTAL', e.target.value)} />
                          </label>
                          <label>
                              ADOS_COMM:
                              <input type="number" value={testResults['0-3'].ADOS_COMM} onChange={(e) => handleTestResultChange('0-3', 'ADOS_COMM', e.target.value)} />
                          </label>
                          <label>
                              ADOS_SOCIAL:
                              <input type="number" value={testResults['0-3'].ADOS_SOCIAL} onChange={(e) => handleTestResultChange('0-3', 'ADOS_SOCIAL', e.target.value)} />
                          </label>
                          <label>
                              ADOS_STEREO_BEHAV:
                              <input type="number" value={testResults['0-3'].ADOS_STEREO_BEHAV} onChange={(e) => handleTestResultChange('0-3', 'ADOS_STEREO_BEHAV', e.target.value)} />
                          </label>
                          <label>
                              SRS_RAW_TOTAL:
                              <input type="number" value={testResults['0-3'].SRS_RAW_TOTAL} onChange={(e) => handleTestResultChange('0-3', 'SRS_RAW_TOTAL', e.target.value)} />
                          </label>
                          <label>
                              AQ_TOTAL:
                              <input type="number" value={testResults['0-3'].AQ_TOTAL} onChange={(e) => handleTestResultChange('0-3', 'AQ_TOTAL', e.target.value)} />
                          </label>
                          
                      </>
                  )}
  
                  {selectedCategory === '3-5' && (
                      <>
                        <label>
                              patient_Id
                              <input type="text" value={testResults['3-5'].patientId} onChange={(e) => handleTestResultChange('3-5', 'patientId', e.target.value)} />
                          </label>
                          <label>
                              AGE:
                              <input type="number" value={testResults['3-5'].AGE} onChange={(e) => handleTestResultChange('3-5', 'AGE', e.target.value)} />
                          </label>
                          <label>
                              SEX (1 FOR MALE/ 2 FOR FEMALE):
                              <input type="number" value={testResults['3-5'].SEX} onChange={(e) => handleTestResultChange('3-5', 'SEX', e.target.value)} />
                          </label>
                          <label>
                              FIQ:
                              <input type="number" value={testResults['3-5'].FIQ} onChange={(e) => handleTestResultChange('3-5', 'FIQ', e.target.value)} />
                          </label>
                          <label>
                              VIQ:
                              <input type="number" value={testResults['3-5'].VIQ} onChange={(e) => handleTestResultChange('3-5', 'VIQ', e.target.value)} />
                          </label>
                          <label>
                              PIQ (PUT 0):
                              <input type="number" value={testResults['3-5'].PIQ} onChange={(e) => handleTestResultChange('3-5', 'PIQ', e.target.value)} />
                          </label>
                          <label>
                              ADOS_TOTAL:
                              <input type="number" value={testResults['3-5'].ADOS_TOTAL} onChange={(e) => handleTestResultChange('3-5', 'ADOS_TOTAL', e.target.value)} />
                          </label>
                          <label>
                              ADOS_COMM:
                              <input type="number" value={testResults['3-5'].ADOS_COMM} onChange={(e) => handleTestResultChange('3-5', 'ADOS_COMM', e.target.value)} />
                          </label>
                          <label>
                              ADOS_SOCIAL:
                              <input type="number" value={testResults['3-5'].ADOS_SOCIAL} onChange={(e) => handleTestResultChange('3-5', 'ADOS_SOCIAL', e.target.value)} />
                          </label>
                          <label>
                              ADOS_STEREO_BEHAV:
                              <input type="number" value={testResults['3-5'].ADOS_STEREO_BEHAV} onChange={(e) => handleTestResultChange('3-5', 'ADOS_STEREO_BEHAV', e.target.value)} />
                          </label>
                          <label>
                              SRS_RAW_TOTAL:
                              <input type="number" value={testResults['3-5'].SRS_RAW_TOTAL} onChange={(e) => handleTestResultChange('3-5', 'SRS_RAW_TOTAL', e.target.value)} />
                          </label>
                          <label>
                              AQ_TOTAL:
                              <input type="number" value={testResults['3-5'].AQ_TOTAL} onChange={(e) => handleTestResultChange('3-5', 'AQ_TOTAL', e.target.value)} />
                          </label>
                          
                      </>
                  )}
  
                  {selectedCategory === '6-12' && (
                      <>
                            <label>
                              patient_Id
                              <input type="text" value={testResults['6-12'].patientId} onChange={(e) => handleTestResultChange('6-12', 'patientId', e.target.value)} />
                          </label>
                          <label>
                              AGE:
                              <input type="number" value={testResults['6-12'].AGE} onChange={(e) => handleTestResultChange('6-12', 'AGE', e.target.value)} />
                          </label>
                          <label>
                              SEX (1 FOR MALE/ 2 FOR FEMALE):
                              <input type="number" value={testResults['6-12'].SEX} onChange={(e) => handleTestResultChange('6-12', 'SEX', e.target.value)} />
                          </label>
                          <label>
                              FIQ:
                              <input type="number" value={testResults['6-12'].FIQ} onChange={(e) => handleTestResultChange('6-12', 'FIQ', e.target.value)} />
                          </label>
                          <label>
                              VIQ:
                              <input type="number" value={testResults['6-12'].VIQ} onChange={(e) => handleTestResultChange('6-12', 'VIQ', e.target.value)} />
                          </label>
                          <label>
                              PIQ:
                              <input type="number" value={testResults['6-12'].PIQ} onChange={(e) => handleTestResultChange('6-12', 'PIQ', e.target.value)} />
                          </label>
                          <label>
                              ADOS_TOTAL:
                              <input type="number" value={testResults['6-12'].ADOS_TOTAL} onChange={(e) => handleTestResultChange('6-12', 'ADOS_TOTAL', e.target.value)} />
                          </label>
                          <label>
                              ADOS_COMM:
                              <input type="number" value={testResults['6-12'].ADOS_COMM} onChange={(e) => handleTestResultChange('6-12', 'ADOS_COMM', e.target.value)} />
                          </label>
                          <label>
                              ADOS_SOCIAL:
                              <input type="number" value={testResults['6-12'].ADOS_SOCIAL} onChange={(e) => handleTestResultChange('6-12', 'ADOS_SOCIAL', e.target.value)} />
                          </label>
                          <label>
                              ADOS_STEREO_BEHAV:
                              <input type="number" value={testResults['6-12'].ADOS_STEREO_BEHAV} onChange={(e) => handleTestResultChange('6-12', 'ADOS_STEREO_BEHAV', e.target.value)} />
                          </label>
                          <label>
                              SRS_RAW_TOTAL:
                              <input type="number" value={testResults['6-12'].SRS_RAW_TOTAL} onChange={(e) => handleTestResultChange('6-12', 'SRS_RAW_TOTAL', e.target.value)} />
                          </label>
                          <label>
                              AQ_TOTAL:
                              <input type="number" value={testResults['6-12'].AQ_TOTAL} onChange={(e) => handleTestResultChange('6-12', 'AQ_TOTAL', e.target.value)} />
                          </label>
                          
                      </>
                  )}
  
                  {selectedCategory === '13+' && (
                      <>
                        <label>
                              patient_Id
                              <input type="text" value={testResults['13+'].patientId} onChange={(e) => handleTestResultChange('13+', 'patientId', e.target.value)} />
                          </label>
                          <label>
                              AGE:
                              <input type="number" value={testResults['13+'].AGE} onChange={(e) => handleTestResultChange('13+', 'AGE', e.target.value)} />
                          </label>
                          <label>
                              SEX (1 FOR MALE/ 2 FOR FEMALE):
                              <input type="number" value={testResults['13+'].SEX} onChange={(e) => handleTestResultChange('13+', 'SEX', e.target.value)} />
                          </label>
                          <label>
                              FIQ:
                              <input type="number" value={testResults['13+'].FIQ} onChange={(e) => handleTestResultChange('13+', 'FIQ', e.target.value)} />
                          </label>
                          <label>
                              VIQ:
                              <input type="number" value={testResults['13+'].VIQ} onChange={(e) => handleTestResultChange('13+', 'VIQ', e.target.value)} />
                          </label>
                          <label>
                              PIQ:
                              <input type="number" value={testResults['13+'].PIQ} onChange={(e) => handleTestResultChange('13+', 'PIQ', e.target.value)} />
                          </label>
                          <label>
                              ADOS_TOTAL:
                              <input type="number" value={testResults['13+'].ADOS_TOTAL} onChange={(e) => handleTestResultChange('13+', 'ADOS_TOTAL', e.target.value)} />
                          </label>
                          <label>
                              ADOS_COMM:
                              <input type="number" value={testResults['13+'].ADOS_COMM} onChange={(e) => handleTestResultChange('13+', 'ADOS_COMM', e.target.value)} />
                          </label>
                          <label>
                              ADOS_SOCIAL:
                              <input type="number" value={testResults['13+'].ADOS_SOCIAL} onChange={(e) => handleTestResultChange('13+', 'ADOS_SOCIAL', e.target.value)} />
                          </label>
                          <label>
                              ADOS_STEREO_BEHAV:
                              <input type="number" value={testResults['13+'].ADOS_STEREO_BEHAV} onChange={(e) => handleTestResultChange('13+', 'ADOS_STEREO_BEHAV', e.target.value)} />
                          </label>
                          <label>
                              SRS_RAW_TOTAL:
                              <input type="number" value={testResults['13+'].SRS_RAW_TOTAL} onChange={(e) => handleTestResultChange('13+', 'SRS_RAW_TOTAL', e.target.value)} />
                          </label>
                          <label>
                              AQ_TOTAL:
                              <input type="number" value={testResults['13+'].AQ_TOTAL} onChange={(e) => handleTestResultChange('13+', 'AQ_TOTAL', e.target.value)} />
                          </label>
                          
                      </>
                  )}
  
                  {/* Submit Button */}
                  <button onClick={handleSubmit}>Submit</button>
              </div>
          </div>
      );
  };
  
  const History = () => {
    const [pregnancyDetails, setPregnancyDetails] = useState({
        sugarLevel: '',
        abortionHistory: '',
        bmi: '',
        bloodPressure: '',
    });

    const [birthMilestones, setBirthMilestones] = useState({
        weight: '',
        prematureBirth: '',
        liftingHeadMonth: '',
        rollingOverMonth: '',
        sittingUpMonth: '',
        crawlingMonth: '',
        standingWithSupportMonth: '',
        standingIndividuallyMonth: '',
    });

    const handlePregnancyDetailsChange = (field, value) => {
        setPregnancyDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleBirthMilestonesChange = (field, value) => {
        setBirthMilestones((prev) => ({ ...prev, [field]: value }));
    };

    const handleHistorySubmit = () => {
        console.log("Submitted Pregnancy and Birth Details:", { pregnancyDetails, birthMilestones });
        alert('History details submitted successfully!');
    };

    return (
        <div className="history-content">
            <h2>History</h2>

            {/* Pregnancy Details Section */}
            <div className="section pregnancy-details">
                <h3>Pregnancy Details</h3>
                <label>
                    Sugar Level:
                    <input type="text" value={pregnancyDetails.sugarLevel} onChange={(e) => handlePregnancyDetailsChange('sugarLevel', e.target.value)} />
                </label>
                <label>
                    Abortion History:
                    <input type="text" value={pregnancyDetails.abortionHistory} onChange={(e) => handlePregnancyDetailsChange('abortionHistory', e.target.value)} />
                </label>
                <label>
                    BMI:
                    <input type="text" value={pregnancyDetails.bmi} onChange={(e) => handlePregnancyDetailsChange('bmi', e.target.value)} />
                </label>
                <label>
                    Blood Pressure:
                    <input type="text" value={pregnancyDetails.bloodPressure} onChange={(e) => handlePregnancyDetailsChange('bloodPressure', e.target.value)} />
                </label>
            </div>

            {/* Birth and Milestones Section */}
            <div className="section birth-milestones">
                <h3>Birth and Milestones</h3>
                <label>
                    Weight (at birth):
                    <input type="text" value={birthMilestones.weight} onChange={(e) => handleBirthMilestonesChange('weight', e.target.value)} />
                </label>
                <label>
                    Premature Birth (yes/no):
                    <input type="text" value={birthMilestones.prematureBirth} onChange={(e) => handleBirthMilestonesChange('prematureBirth', e.target.value)} />
                </label>
                <label>
                    Lifting Head (in months):
                    <input type="number" value={birthMilestones.liftingHeadMonth} onChange={(e) => handleBirthMilestonesChange('liftingHeadMonth', e.target.value)} />
                </label>
                <label>
                    Rolling Over (in months):
                    <input type="number" value={birthMilestones.rollingOverMonth} onChange={(e) => handleBirthMilestonesChange('rollingOverMonth', e.target.value)} />
                </label>
                <label>
                    Sitting Up (in months):
                    <input type="number" value={birthMilestones.sittingUpMonth} onChange={(e) => handleBirthMilestonesChange('sittingUpMonth', e.target.value)} />
                </label>
                <label>
                    Crawling (in months):
                    <input type="number" value={birthMilestones.crawlingMonth} onChange={(e) => handleBirthMilestonesChange('crawlingMonth', e.target.value)} />
                </label>
                <label>
                    Standing with Support (in months):
                    <input type="number" value={birthMilestones.standingWithSupportMonth} onChange={(e) => handleBirthMilestonesChange('standingWithSupportMonth', e.target.value)} />
                </label>
                <label>
                    Standing Individually (in months):
                    <input type="number" value={birthMilestones.standingIndividuallyMonth} onChange={(e) => handleBirthMilestonesChange('standingIndividuallyMonth', e.target.value)} />
                </label>
            </div>

            {/* Submit Button */}
            <button onClick={handleHistorySubmit}>Submit History</button>
        </div>
    );
};

  

  


    const DoctorLogin = () => {
    const [loginName, setLoginName] = useState('');
    const [patientId, setPatientId] = useState('');
    const [doctorType, setDoctorType] = useState('');

    const handleDoctorLogin = async (e) => {
      e.preventDefault();
      if (loginName && patientId && doctorType) {
          try {
              const response = await fetch('http://localhost:8000/api/verify-patient/', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ unique_id: patientId }),
              });
  
              if (response.ok) {
                const data = await response.json();
                if (data.message === 'Patient found') {  // Update this condition
                    setDoctorLoggedIn(true);
                    setActiveSection('assessment');  // Navigate to assessment directly on login success
                } else {
                    alert(data.message);  // Use the message returned from the server
                }
            } else {
                alert('Error verifying patient ID.');
            }
            
          } catch (error) {
              alert('Network error: ' + error.message);
          }
      } else {
          alert('Please fill all the fields.');
      }
  };

    return (
      <div>
        <h2>Doctor Login</h2>
        <form onSubmit={handleDoctorLogin}>
          <label>Patient Name:</label>
          <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
          <label>Patient ID:</label>
          <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
          <label>Doctor Type:</label>
          <select value={doctorType} onChange={(e) => setDoctorType(e.target.value)}>
            <option value="">Select Doctor Type</option>
            <option value="pediatrician">Pediatrician</option>
            <option value="psychologist">Psychologist</option>
            <option value="psychiatrist">Psychiatrist</option>
          </select>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

  return ( <div className="app-container"> 
  <nav> 
    <h2>Navigation</h2> 
    <ul> 
        <li onClick={() => setActiveSection('about')} className="nav-item">About</li> 
        <li onClick={() => setActiveSection('services')} className="nav-item">Register</li> 
        <li onClick={() => setActiveSection('History')} className="nav-item">History</li> 
        <li onClick={() => setActiveSection('doctor-login')} className="nav-item">Doctor Login</li> 
        {doctorLoggedIn && <li onClick={() => setActiveSection('assessment')} className="nav-item">Assessment</li>} 
        <li onClick={() => setActiveSection('result')} className="nav-item">Result</li> 
    </ul> 
    </nav> 
    <div className="content"> 
            {activeSection === 'about' && <About />} 
            {activeSection === 'services' && <Services />} 
            {activeSection === 'History' && <History />} 
            {activeSection === 'doctor-login' && <DoctorLogin setActiveSection={setActiveSection} />} 
            {activeSection === 'result' && result && <Result result={result} />} 
            {doctorLoggedIn && activeSection === 'assessment' && <Assessment setResult={setResult} />} 
        </div> 
    </div> 
    );


}

export default App;
