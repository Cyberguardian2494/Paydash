/*
  PayDash App v1.0
  Main application logic file.
*/
document.addEventListener('DOMContentLoaded', () => {

  // =================================================================
  //  PART 1: "DOM REFERENCES"
  // =================================================================
  
  // --- Screens ---
  const logScreen = document.getElementById('log-screen');
  const payScreen = document.getElementById('pay-screen');
  const settingsScreen = document.getElementById('settings-screen');

  // --- Navigation Buttons ---
  const navLogBtn = document.getElementById('nav-log-btn');
  const navPayBtn = document.getElementById('nav-pay-btn');
  const navSettingsBtn = document.getElementById('nav-settings-btn');

  // --- "Log" Screen Elements ---
  const logForm = document.getElementById('log-form');
  const logDate = document.getElementById('log-date');
  const logJob = document.getElementById('log-job');
  const logHours = document.getElementById('log-hours');
  const logJob1Option = document.getElementById('log-job-1-option');
  const logJob2Option = document.getElementById('log-job-2-option');
  const recentShiftsList = document.getElementById('recent-shifts-list');

  // --- "Paycheck" Screen Elements ---
  const job1Start = document.getElementById('job1-start');
  const job1End = document.getElementById('job1-end');
  const job2Start = document.getElementById('job2-start');
  const job2End = document.getElementById('job2-end');
  
  const job1NameDisplay = document.getElementById('job1-name-display');
  const job1RateDisplay = document.getElementById('job1-rate-display');
  const job2NameDisplay = document.getElementById('job2-name-display');
  const job2RateDisplay = document.getElementById('job2-rate-display');
  
  const job1HoursSpan = document.getElementById('job1-hours');
  const job1PaySpan = document.getElementById('job1-pay');
  const job2HoursSpan = document.getElementById('job2-hours');
  const job2PaySpan = document.getElementById('job2-pay');
  const totalPaySpan = document.getElementById('total-pay');
  const job1ResultLabel = document.getElementById('job1-result-label');
  const job2ResultLabel = document.getElementById('job2-result-label');

  // --- "Settings" Screen Elements ---
  const job1NameInput = document.getElementById('job1-name');
  const job1RateInput = document.getElementById('job1-rate');
  const job2NameInput = document.getElementById('job2-name');
  const job2RateInput = document.getElementById('job2-rate');
  const resetAppBtn = document.getElementById('reset-app-btn');

  // --- "Security" Lock Screen Elements ---
  const lockScreen = document.getElementById('lock-screen');
  const pinInput = document.getElementById('pin-input');
  const pinUnlockBtn = document.getElementById('pin-unlock-btn');
  const pinErrorMsg = document.getElementById('pin-error-msg');
  
  // --- "Security" Settings Page Elements ---
  const setPinContainer = document.getElementById('set-pin-container');
  const managePinContainer = document.getElementById('manage-pin-container');
  const newPin = document.getElementById('new-pin');
  const confirmPin = document.getElementById('confirm-pin');
  const pinSetBtn = document.getElementById('pin-set-btn');
  const pinStatusMsg = document.getElementById('pin-status-msg');
  const pinRemoveBtn = document.getElementById('pin-remove-btn');

  // =================================================================
  //  PART 2: SCREEN/TAB SWITCHING LOGIC
  // =================================================================

  navLogBtn.addEventListener('click', () => {
    logScreen.classList.remove('hidden');
    payScreen.classList.add('hidden');
    settingsScreen.classList.add('hidden');

    navLogBtn.classList.add('bg-blue-600', 'text-white');
    navLogBtn.classList.remove('text-gray-400');
    
    navPayBtn.classList.add('text-gray-400');
    navPayBtn.classList.remove('bg-blue-600', 'text-white');
    
    navSettingsBtn.classList.add('text-gray-400');
    navSettingsBtn.classList.remove('bg-blue-600', 'text-white');
  });

  navPayBtn.addEventListener('click', () => {
    logScreen.classList.add('hidden');
    payScreen.classList.remove('hidden');
    settingsScreen.classList.add('hidden');

    navPayBtn.classList.add('bg-blue-600', 'text-white');
    navPayBtn.classList.remove('text-gray-400');
    
    navLogBtn.classList.add('text-gray-400');
    navLogBtn.classList.remove('bg-blue-600', 'text-white');
    
    navSettingsBtn.classList.add('text-gray-400');
    navSettingsBtn.classList.remove('bg-blue-600', 'text-white');
    
    calculatePay(); // Re-run calculation when switching to this tab
  });

  navSettingsBtn.addEventListener('click', () => {
    logScreen.classList.add('hidden');
    payScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');

    navSettingsBtn.classList.add('bg-blue-600', 'text-white');
    navSettingsBtn.classList.remove('text-gray-400');

    navLogBtn.classList.add('text-gray-400');
    navLogBtn.classList.remove('bg-blue-600', 'text-white');
    
    navPayBtn.classList.add('text-gray-400');
    navPayBtn.classList.remove('bg-blue-600', 'text-white');
    // Checks which security view to show (Set vs Manage)
    updateSecurityUI();
  });

  // =================================================================
  //  PART 3: DATA STORAGE LOGIC
  // =================================_
  const getShifts = () => {
    const shifts = localStorage.getItem('hourLog');
    if (!shifts) {
      return [];
    }
    return JSON.parse(shifts);
  };

  const saveShift = (newShift) => {
    const allShifts = getShifts();
    allShifts.unshift(newShift);
    localStorage.setItem('hourLog', JSON.stringify(allShifts));
  };

  // =================================================================
  //  PART 4: DISPLAY/RENDERING LOGIC
  // =================================================================
  const renderRecentShifts = () => {
    recentShiftsList.innerHTML = '';
    const allShifts = getShifts();
    
    if (allShifts.length === 0) {
      recentShiftsList.innerHTML = '<p class="text-gray-500">No shifts logged yet.</p>';
      return;
    }
    
    const recentShifts = allShifts.slice(0, 5);
    
    recentShifts.forEach(shift => {
      const shiftElement = document.createElement('div');
      shiftElement.className = 'bg-gray-800 p-3 rounded-lg flex justify-between items-center';
      
      const date = new Date(shift.date + 'T00:00:00'); // Fix for date parsing
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      shiftElement.innerHTML = `
        <span class="font-semibold">${shift.job} - ${shift.hours} hours</span>
        <span class="text-gray-400 text-sm">${formattedDate}</span>
      `;
      
      recentShiftsList.appendChild(shiftElement);
    });
  };

  // =================================================================
  //  PART 5: "LOG SHIFT" FORM LOGIC
  // =================================================================
  logForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const newShift = {
      id: Date.now(),
      date: logDate.value,
      job: logJob.value,
      hours: logHours.valueAsNumber
    };
    
    saveShift(newShift);
    renderRecentShifts();
    calculatePay();
    logForm.reset();
    setTodayDate();
  });

  // =================================================================
  //  PART 6: PAYCHECK CALCULATION LOGIC
  // =================================================================
  const calculatePay = () => {
    // Get the rates *every time* we calculate
    const job1Rate = parseFloat(job1RateInput.value) || 0;
    const job2Rate = parseFloat(job2RateInput.value) || 0;

    // Get the names *every time* we calculate
    const job1Name = job1NameInput.value.trim() || 'Job 1';
    const job2Name = job2NameInput.value.trim() || 'Job 2';
    
    const allShifts = getShifts();
    const j1StartDate = job1Start.value;
    const j1EndDate = job1End.value;
    const j2StartDate = job2Start.value;
    const j2EndDate = job2End.value;

    let job1TotalHours = 0;
    let job2TotalHours = 0;

    if (j1StartDate && j1EndDate) {
      const job1Shifts = allShifts.filter(shift => {
        return shift.job === job1Name &&
               shift.date >= j1StartDate &&
               shift.date <= j1EndDate;
      });
      job1TotalHours = job1Shifts.reduce((total, shift) => total + shift.hours, 0);
    }
    
    if (j2StartDate && j2EndDate) {
      const job2Shifts = allShifts.filter(shift => {
        return shift.job === job2Name &&
               shift.date >= j2StartDate &&
               shift.date <= j2EndDate;
      });
      job2TotalHours = job2Shifts.reduce((total, shift) => total + shift.hours, 0);
    }
    
    const job1Pay = job1TotalHours * job1Rate;
    const job2Pay = job2TotalHours * job2Rate;
    const totalPay = job1Pay + job2Pay;
    
    job1HoursSpan.textContent = job1TotalHours.toFixed(1);
    job1PaySpan.textContent = `£${job1Pay.toFixed(2)}`;
    
    job2HoursSpan.textContent = job2TotalHours.toFixed(1);
    job2PaySpan.textContent = `£${job2Pay.toFixed(2)}`;
    
    totalPaySpan.textContent = `£${totalPay.toFixed(2)}`;
  };
  
  // =================================================================
  //  PART 7: SETTINGS SAVE/LOAD LOGIC
  // =================================================================
  const KEYS = {
    job1Name: 'paydash_job1_name',
    job1Rate: 'paydash_job1_rate',
    job2Name: 'paydash_job2_name',
    job2Rate: 'paydash_job2_rate',
  };

  const saveSettings = () => {
    localStorage.setItem(KEYS.job1Name, job1NameInput.value);
    localStorage.setItem(KEYS.job1Rate, job1RateInput.value);
    localStorage.setItem(KEYS.job2Name, job2NameInput.value);
    localStorage.setItem(KEYS.job2Rate, job2RateInput.value);
  };

  const loadSettings = () => {
    const savedJ1Name = localStorage.getItem(KEYS.job1Name);
    const savedJ1Rate = localStorage.getItem(KEYS.job1Rate);
    const savedJ2Name = localStorage.getItem(KEYS.job2Name);
    const savedJ2Rate = localStorage.getItem(KEYS.job2Rate);

    const j1Name = (savedJ1Name !== null) ? savedJ1Name : '';
    const j1Rate = (savedJ1Rate !== null) ? savedJ1Rate : '';
    const j2Name = (savedJ2Name !== null) ? savedJ2Name : '';
    const j2Rate = (savedJ2Rate !== null) ? savedJ2Rate : '';

    // 1. Update the Settings screen inputs
    job1NameInput.value = j1Name;
    job1RateInput.value = j1Rate;
    job2NameInput.value = j2Name;
    job2RateInput.value = j2Rate;

    // 2. Update the Log screen dropdown
    logJob1Option.value = j1Name;
    logJob1Option.textContent = j1Name;
    logJob2Option.value = j2Name;
    logJob2Option.textContent = j2Name;

    // 3. Update the Paycheck screen result labels
    job1ResultLabel.textContent = `${j1Name}:`;
    job2ResultLabel.textContent = `${j2Name}:`;
    
    // 4. Update the Paycheck screen read-only displays
    // Ensure j1Rate/j2Rate are treated as numbers for toFixed
    const j1RateNum = parseFloat(j1Rate) || 0;
    const j2RateNum = parseFloat(j2Rate) || 0;
    
    job1NameDisplay.textContent = j1Name;
    job1RateDisplay.textContent = `£${j1RateNum.toFixed(2)}/hr`;
    job2NameDisplay.textContent = j2Name;
    job2RateDisplay.textContent = `£${j2RateNum.toFixed(2)}/hr`;
  };

  const onSettingsChanged = () => {
    saveSettings();
    loadSettings();
    calculatePay();
  };

  // =================================================================
  //  PART 8: RESET APP LOGIC
  // =================================================================
  resetAppBtn.addEventListener('click', () => {
    const isConfirmed = window.confirm(
      'ARE YOU SURE?\n\nThis will permanently delete all shifts and settings.'
    );
    if (isConfirmed) {
      // 3. This is the new "smart" reset.
      //    We manually remove *only* the data keys.
      localStorage.removeItem('hourLog');
      localStorage.removeItem(KEYS.job1Name);
      localStorage.removeItem(KEYS.job1Rate);
      localStorage.removeItem(KEYS.job2Name);
      localStorage.removeItem(KEYS.job2Rate);
      //    Notice we DO NOT remove the PIN hash (paydash_pin_hash).

      // 4. 'location.reload()' forces the app to refresh.
      //    The PIN will still be there, but all other data will be gone.
      location.reload();
    }
  });
  // =================================================================
  //  PART 9: PIN & CRYPTO LOGIC
  // =================================================================
  
  // This is the key we'll use in localStorage.
  const PIN_HASH_KEY = 'paydash_pin_hash';

  // --- Helper function to check if a PIN is set ---
  function isPinSet() {
    // '!!' converts the result (string or null) into a true/false boolean.
    return !!localStorage.getItem(PIN_HASH_KEY);
  }

  // --- Helper function to convert text to a format for hashing ---
  function textToBuffer(text) {
    const encoder = new TextEncoder();
    return encoder.encode(text);
  }

  // --- The Main Hashing Function ---
  // 'async' means this function returns a "Promise"
  // because crypto operations take a moment.
  async function hashPin(pin) {
    const buffer = textToBuffer(pin);
    // 'window.crypto.subtle.digest' is the core API
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    
    // This converts the hash buffer back into a hex string we can save
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // --- "Set PIN" Button Logic ---
  // 'async' is needed because we 'await' the hashPin function
  pinSetBtn.addEventListener('click', async () => {
    const newPinVal = newPin.value;
    const confirmPinVal = confirmPin.value;

    // --- Validation Checks ---
    if (newPinVal.length < 4 || confirmPinVal.length < 4) {
      pinStatusMsg.textContent = 'PIN must be 4 digits.';
      pinStatusMsg.className = 'text-red-400 h-6'; // Set class for red text
      return;
    }
    if (newPinVal !== confirmPinVal) {
      pinStatusMsg.textContent = 'PINs do not match.';
      pinStatusMsg.className = 'text-red-400 h-6';
      return;
    }

    // --- If validation passes ---
    try {
      const pinHash = await hashPin(newPinVal);
      localStorage.setItem(PIN_HASH_KEY, pinHash);
      
      // Show success message
      pinStatusMsg.textContent = 'PIN set successfully!';
      pinStatusMsg.className = 'text-green-400 h-6'; // Set class for green text
      
      // Clear the inputs
      newPin.value = '';
      confirmPin.value = '';
      
      // Update the UI to show the "Manage PIN" view
      updateSecurityUI();

    } catch (error) {
      pinStatusMsg.textContent = 'Error setting PIN. Try again.';
      pinStatusMsg.className = 'text-red-400 h-6';
      console.error('PIN Hashing Error:', error);
    }
  });

  // --- "Remove PIN" Button Logic ---
  pinRemoveBtn.addEventListener('click', () => {
    // We add a confirmation just in case
    const isConfirmed = window.confirm('Are you sure you want to remove the PIN?');
    if (isConfirmed) {
      localStorage.removeItem(PIN_HASH_KEY);
      // Update the UI to show the "Set PIN" view
      updateSecurityUI();
      // We'll re-use the status message from the "Set PIN" form
      pinStatusMsg.textContent = 'PIN removed successfully.';
      pinStatusMsg.className = 'text-green-400 h-6';
    }
  });

  // --- "Smart UI" Function ---
  // This function checks if a PIN is set and shows/hides
  // the correct containers on the Settings page.
  function updateSecurityUI() {
    if (isPinSet()) {
      // A PIN is set: Show "Manage" and hide "Set"
      managePinContainer.classList.remove('hidden');
      setPinContainer.classList.add('hidden');
    } else {
      // No PIN is set: Show "Set" and hide "Manage"
      managePinContainer.classList.add('hidden');
      setPinContainer.classList.remove('hidden');
    }
  }

  // --- "Unlock" Button Logic ---
  // 'async' because we need to 'await' the hash function
  pinUnlockBtn.addEventListener('click', async () => {
    const pinTry = pinInput.value;
    
    // 1. Hash the PIN the user just typed.
    const testHash = await hashPin(pinTry);
    
    // 2. Get the PIN we saved in storage.
    const savedHash = localStorage.getItem(PIN_HASH_KEY);

    // 3. Compare them!
    if (testHash === savedHash) {
      // SUCCESS!
      lockScreen.classList.add('hidden'); // Hide the lock screen
      pinInput.value = ''; // Clear the input
      pinErrorMsg.textContent = ''; // Clear any errors
      
      // *** CRITICAL: Now that we are unlocked,
      //     we run the app's startup logic.
      initializeApp();
      
    } else {
      // FAILURE!
      pinErrorMsg.textContent = 'Incorrect PIN.';
      pinInput.value = ''; // Clear the input for re-try
    }
  });

  // =================================================================
  //  PART 10: APP INITIALIZATION (RUNS ON STARTUP)
  // =================================================================

  // --- Add listeners for the SETTINGS inputs ---
  job1NameInput.addEventListener('input', onSettingsChanged);
  job1RateInput.addEventListener('input', onSettingsChanged);
  job2NameInput.addEventListener('input', onSettingsChanged);
  job2RateInput.addEventListener('input', onSettingsChanged);

  // --- Add listeners for the PAYCHECK DATE inputs ---
  job1Start.addEventListener('change', calculatePay);
  job1End.addEventListener('change', calculatePay);
  job2Start.addEventListener('change', calculatePay);
  job2End.addEventListener('change', calculatePay);

  // --- Helper function to set the date input to today ---
  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    logDate.value = today;
  };
  
  // --- Create a new function for our startup logic ---
  // We will call this *after* the app is unlocked.
  function initializeApp() {
    console.log('App initializing...');
    updateSecurityUI(); // Checks PIN status for settings page
    loadSettings();     // 1. Load all saved names and rates
    setTodayDate();     // 2. Set the date input to today
    renderRecentShifts(); // 3. Render any shifts
    calculatePay();     // 4. Run the calculator
  }

  // --- THIS IS THE NEW LAUNCH LOGIC ---
  // This is the *only* code that runs immediately.
  // It checks if a PIN is set.
  if (isPinSet()) {
    // If PIN is set, just show the lock screen.
    // The app will NOT initialize yet.
    lockScreen.classList.remove('hidden');
  } else {
    // If NO PIN is set, the app is unlocked.
    // Run the startup logic immediately.
    initializeApp();
  }

}); // <-- This closes the 'DOMContentLoaded' listener