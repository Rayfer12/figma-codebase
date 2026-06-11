import { useState, useRef, useEffect } from 'react';
import { Home, Grid3x3, Volume2, User, Moon, Settings, Wind, Zap, Fan, Footprints, Heart, Clock, Headphones, ArrowRight, ChevronLeft, MoreVertical, Timer, Mic, Camera, Save, Battery, BatteryCharging, Building2, Umbrella } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Hand Fan state
  const [fanCameraOpen, setFanCameraOpen] = useState(false);
  const [fanAngle, setFanAngle] = useState(0);

  // Reaction Test state
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [earlyTap, setEarlyTap] = useState(false);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionStart = useRef<number>(0);

  useEffect(() => {
    return () => { if (reactionTimer.current) clearTimeout(reactionTimer.current); };
  }, []);

  // Battery API
  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        // @ts-ignore - Battery API may not be in TypeScript types
        if (navigator.getBattery) {
          // @ts-ignore
          const battery = await navigator.getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
          });
        }
      } catch (error) {
        // Battery API not supported, use fallback
        setBatteryLevel(85); // Mock value
        setIsCharging(false);
      }
    };
    getBatteryInfo();
  }, []);

  const handleSaveData = (activityName: string) => {
    setSaveMessage(`${activityName} data saved!`);
    setMenuOpen(null);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address (e.g., user@gmail.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePasswords = () => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignIn = () => {
    if (validateEmail(email) && password) {
      setCurrentPage('home');
    } else if (!email) {
      setEmailError('Email is required');
    }
  };

  const handleCreateAccount = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordMatch = validatePasswords();

    if (isEmailValid && isPasswordMatch && password && confirmPassword) {
      setCurrentPage('home');
    } else if (!email) {
      setEmailError('Email is required');
    }
  };

  const handleReactionTap = () => {
    if (reactionState === 'idle' || reactionState === 'result') {
      setEarlyTap(false);
      setReactionTime(null);
      setReactionState('waiting');
      const delay = 1500 + Math.random() * 3500;
      reactionTimer.current = setTimeout(() => {
        reactionStart.current = Date.now();
        setReactionState('ready');
      }, delay);
    } else if (reactionState === 'waiting') {
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
      setEarlyTap(true);
      setReactionState('result');
    } else if (reactionState === 'ready') {
      setReactionTime(Date.now() - reactionStart.current);
      setReactionState('result');
    }
  };

  const activities = [
    { name: 'Breathing Pace', icon: Wind, color: 'bg-blue-500' },
    { name: 'E-Freelance', icon: Building2, color: 'bg-purple-500' },
    { name: 'Hand Fan', icon: Fan, color: 'bg-green-500' },
    { name: 'Human Pace', icon: Footprints, color: 'bg-orange-500' },
    { name: 'Parachute Drop', icon: Umbrella, color: 'bg-pink-500' },
    { name: 'Reaction Test', icon: Clock, color: 'bg-teal-500' },
    { name: 'Sound Hunter', icon: Headphones, color: 'bg-purple-600' },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Mobile Container */}
        <div className={`max-w-md mx-auto h-screen flex flex-col ${darkMode ? 'bg-[#0a0b1a]' : 'bg-white'}`}>

          {/* Status Bar - Top of every page */}
          <div className={`px-6 pt-3 pb-2 flex items-center justify-end ${darkMode ? 'bg-[#0a0b1a]' : 'bg-white'}`}>
            <div className="flex items-center gap-1.5">
              {isCharging ? (
                <BatteryCharging className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              ) : (
                <Battery className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
              )}
              <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {batteryLevel !== null ? `${batteryLevel}%` : '--'}
              </span>
            </div>
          </div>

          {/* Sign In Page */}
          {currentPage === 'sign-in' && (
            <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`absolute top-8 right-8 p-2 rounded-lg transition-colors ${darkMode ? 'bg-[#1a1b2e] hover:bg-[#232438]' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <Moon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-gray-600'}`} />
              </button>

              <h1 className={`text-3xl font-semibold mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sign In</h1>

              <div className="w-full space-y-4 mb-8">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    onBlur={() => validateEmail(email)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      emailError
                        ? 'border-red-500'
                        : darkMode
                        ? 'bg-[#1a1b2e] border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } ${darkMode ? 'bg-[#1a1b2e] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1.5 ml-1">{emailError}</p>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode
                      ? 'bg-[#1a1b2e] border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <button
                onClick={handleSignIn}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl py-3.5 mb-6 transition-colors"
              >
                Sign In
              </button>

              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setCurrentPage('create-account');
                    setEmailError('');
                    setPasswordError('');
                  }}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* Create Account Page */}
          {currentPage === 'create-account' && (
            <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`absolute top-8 right-8 p-2 rounded-lg transition-colors ${darkMode ? 'bg-[#1a1b2e] hover:bg-[#232438]' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <Moon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-gray-600'}`} />
              </button>

              <h1 className={`text-3xl font-semibold mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>

              <div className="w-full space-y-4 mb-8">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    onBlur={() => validateEmail(email)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      emailError
                        ? 'border-red-500'
                        : darkMode
                        ? 'bg-[#1a1b2e] border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } ${darkMode ? 'bg-[#1a1b2e] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1.5 ml-1">{emailError}</p>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (confirmPassword) validatePasswords();
                  }}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode
                      ? 'bg-[#1a1b2e] border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    onBlur={validatePasswords}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      passwordError
                        ? 'border-red-500'
                        : darkMode
                        ? 'bg-[#1a1b2e] border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } ${darkMode ? 'bg-[#1a1b2e] text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {passwordError && (
                    <p className="text-red-400 text-xs mt-1.5 ml-1">{passwordError}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleCreateAccount}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl py-3.5 mb-6 transition-colors"
              >
                Create Account
              </button>

              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setCurrentPage('sign-in');
                    setEmailError('');
                    setPasswordError('');
                  }}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* Home Page - Activities Grid */}
          {currentPage === 'home' && (
            <>
              {/* Header */}
              <div className="px-6 pt-12 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentPage('settings')}>
                    <Settings className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                </div>

                <div className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Good Evening 👋</div>
                <h1 className={`text-3xl mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Explore Activities</h1>
              </div>

              {/* Activity Grid */}
              <div className="flex-1 px-6 pb-32 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {activities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <button
                        key={activity.name}
                        onClick={() => {
                          if (activity.name === 'Breathing Pace') setCurrentPage('breathing-pace');
                          else if (activity.name === 'Human Pace') setCurrentPage('human-pace');
                          else if (activity.name === 'Sound Hunter') setCurrentPage('sound-hunter');
                          else if (activity.name === 'E-Freelance') setCurrentPage('e-freelance');
                          else if (activity.name === 'Parachute Drop') setCurrentPage('parachute-drop');
                          else if (activity.name === 'Reaction Test') setCurrentPage('reaction-test');
                          else if (activity.name === 'Hand Fan') setCurrentPage('hand-fan');
                        }}
                        className={`rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors ${
                          darkMode ? 'bg-[#1a1b2e] hover:bg-[#232438]' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className={`${activity.color} w-16 h-16 rounded-full flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className={`text-sm text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Settings Page */}
          {currentPage === 'settings' && (
            <>
              {/* Header */}
              <div className={`px-6 pt-12 pb-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentPage('home')}>
                    <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                  <h2 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
                  <div className="w-6"></div>
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
                {/* Dark Mode Toggle */}
                <div className={`flex items-center justify-between rounded-2xl px-4 py-3 mb-4 ${darkMode ? 'bg-[#1a1b2e]' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Moon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{darkMode ? 'Dark Mode' : 'Light Mode'}</div>
                      <div className="text-gray-500 text-xs">Enjoy your experience</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* Battery Info */}
                <div className={`flex items-center justify-between rounded-2xl px-4 py-3 mb-4 ${darkMode ? 'bg-[#1a1b2e]' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`${isCharging ? 'bg-green-500/20' : 'bg-yellow-500/20'} p-2 rounded-lg`}>
                      {isCharging ? (
                        <BatteryCharging className={`w-5 h-5 ${isCharging ? 'text-green-400' : 'text-yellow-400'}`} />
                      ) : (
                        <Battery className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Battery</div>
                      <div className="text-gray-500 text-xs">
                        {batteryLevel !== null ? `${batteryLevel}%` : 'Checking...'} {isCharging ? '(Charging)' : ''}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {batteryLevel !== null ? `${batteryLevel}%` : '--'}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setCurrentPage('sign-in');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 transition-colors ${darkMode ? 'bg-[#1a1b2e] hover:bg-[#232438]' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <User className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Logout</div>
                      <div className="text-gray-500 text-xs">Sign out of your account</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </>
          )}

          {/* Breathing Pace Page */}
          {currentPage === 'breathing-pace' && (
            <>
              {/* Header */}
              <div className={`px-6 pt-12 pb-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentPage('home')}>
                    <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                  <div className="w-6"></div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === 'breathing-pace' ? null : 'breathing-pace')}>
                      <MoreVertical className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                    {menuOpen === 'breathing-pace' && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 ${darkMode ? 'bg-[#1a1b2e] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <button
                          onClick={() => handleSaveData('Breathing Pace')}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-[#232438] text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Data</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Icon */}
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Wind className="w-6 h-6 text-white" />
                  </div>
                  <h1 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Breathing Pace<br />Chart</h1>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
                {saveMessage && (
                  <div className="mb-4 bg-green-500/20 border border-green-500 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{saveMessage}</span>
                  </div>
                )}
                <h2 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h2>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Do a light exercise to get yourself pumping
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Rest and put your phone completely flat on your chest
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Press record and breathe naturally for 30 seconds
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>4</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Get your results!
                    </p>
                  </div>
                </div>

                {/* Start Timer Button */}
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-colors">
                  <Timer className="w-5 h-5" />
                  <span>Start 30s Timer</span>
                </button>

                <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  (Running on Android)
                </p>
              </div>
            </>
          )}

          {/* Human Pace Page */}
          {currentPage === 'human-pace' && (
            <>
              {/* Header */}
              <div className={`px-6 pt-12 pb-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentPage('home')}>
                    <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                  <div className="w-6"></div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === 'human-pace' ? null : 'human-pace')}>
                      <MoreVertical className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                    {menuOpen === 'human-pace' && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 ${darkMode ? 'bg-[#1a1b2e] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <button
                          onClick={() => handleSaveData('Human Pace')}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-[#232438] text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Data</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Icon */}
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Footprints className="w-6 h-6 text-white" />
                  </div>
                  <h1 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Muscle and<br />stability checker</h1>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
                {saveMessage && (
                  <div className="mb-4 bg-green-500/20 border border-green-500 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{saveMessage}</span>
                  </div>
                )}
                <h2 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h2>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Hold your phone and stretch your arms out while tapping record
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Check results and see how stable your arms are!
                    </p>
                  </div>
                </div>

                {/* Start Test Button */}
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-colors">
                  <Timer className="w-5 h-5" />
                  <span>Start Test</span>
                </button>

                <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  (Running on Android)
                </p>
              </div>
            </>
          )}

          {/* Sound Hunter Page */}
          {currentPage === 'sound-hunter' && (
            <>
              {/* Header */}
              <div className={`px-6 pt-12 pb-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentPage('home')}>
                    <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                  <div className="w-6"></div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === 'sound-hunter' ? null : 'sound-hunter')}>
                      <MoreVertical className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                    {menuOpen === 'sound-hunter' && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 ${darkMode ? 'bg-[#1a1b2e] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <button
                          onClick={() => handleSaveData('Sound Hunter')}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-[#232438] text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Data</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Icon */}
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12 L6 8 L6 16 L2 12" fill="currentColor" />
                      <path d="M9 6 L9 18" strokeLinecap="round" />
                      <path d="M12 4 L12 20" strokeLinecap="round" />
                      <path d="M15 7 L15 17" strokeLinecap="round" />
                      <path d="M18 9 L18 15" strokeLinecap="round" />
                      <path d="M21 11 L21 13" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h1 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sound Hunters</h1>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
                {saveMessage && (
                  <div className="mb-4 bg-green-500/20 border border-green-500 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{saveMessage}</span>
                  </div>
                )}
                <h2 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h2>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Hold the phone near an audio source.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Click start to listen for 5 seconds.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Get your decibel count and damage assessment!
                    </p>
                  </div>
                </div>

                {/* Start Recording Button */}
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-4 px-6 flex items-center justify-center gap-2 transition-colors">
                  <Mic className="w-5 h-5" />
                  <span>Start 5s Recording</span>
                </button>

                <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  (Running on Android)
                </p>
              </div>
            </>
          )}

          {/* E-Freelance Page */}
          {currentPage === 'e-freelance' && (
            <>
              {/* Header */}
              <div className={`px-6 pt-12 pb-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentPage('home')}>
                    <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                  <div className="w-6"></div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === 'e-freelance' ? null : 'e-freelance')}>
                      <MoreVertical className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                    {menuOpen === 'e-freelance' && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 ${darkMode ? 'bg-[#1a1b2e] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <button
                          onClick={() => handleSaveData('E-Freelance')}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-[#232438] text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Data</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Icon */}
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h1 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Earthquake<br />Resistance</h1>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
                {saveMessage && (
                  <div className="mb-4 bg-green-500/20 border border-green-500 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{saveMessage}</span>
                  </div>
                )}
                <h2 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h2>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Place phone onto a surface or model building
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Press start, wait for the timer, and shake the surface!
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Get your magnitude and damage
                    </p>
                  </div>
                </div>

                {/* Start Timer Button */}
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-colors">
                  <Timer className="w-5 h-5" />
                  <span>Start 10s Timer</span>
                </button>

                <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  (Running on Android)
                </p>
              </div>
            </>
          )}

          {/* Hand Fan Page */}
          {currentPage === 'hand-fan' && (
            <>
              {/* Header */}
              <div className={`px-6 pt-12 pb-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => { setCurrentPage('home'); setFanCameraOpen(false); }}>
                    <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                  <div className="w-6"></div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === 'hand-fan' ? null : 'hand-fan')}>
                      <MoreVertical className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                    {menuOpen === 'hand-fan' && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 ${darkMode ? 'bg-[#1a1b2e] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <button
                          onClick={() => handleSaveData('Hand Fan')}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-[#232438] text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Data</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Icon */}
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Fan className="w-6 h-6 text-white" />
                  </div>
                  <h1 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hand Fan Test</h1>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
                {saveMessage && (
                  <div className="mb-4 bg-green-500/20 border border-green-500 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{saveMessage}</span>
                  </div>
                )}
                <h2 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h2>

                {/* Steps */}
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Stand a piece of paper upright on a table.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Turn on a fan or blow on the paper so it bends backward.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Open the camera, align the red line with the bend of the paper, and calculate!
                    </p>
                  </div>
                </div>

                {/* Camera View */}
                {fanCameraOpen ? (
                  <>
                    <div className="relative w-full rounded-2xl overflow-hidden mb-4" style={{ height: '220px' }}>
                      {/* Simulated camera background */}
                      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <div className="grid grid-cols-6 grid-rows-4 w-full h-full opacity-10">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="border border-gray-500" />
                          ))}
                        </div>
                      </div>
                      {/* Rotatable red line */}
                      <div
                        className="absolute left-1/2 top-1/2 w-0.5 bg-red-500 origin-center"
                        style={{
                          height: '300px',
                          transform: `translate(-50%, -50%) rotate(${fanAngle}deg)`,
                        }}
                      />
                      {/* Corner markers */}
                      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-green-400" />
                      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-green-400" />
                      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-green-400" />
                      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-green-400" />
                      {/* Angle readout */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 rounded px-2 py-0.5">
                        <span className="text-red-400 text-xs">{fanAngle}°</span>
                      </div>
                    </div>

                    {/* Instruction */}
                    <p className={`text-center text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Adjust the red line to match the bend of the paper.
                    </p>

                    {/* Angle Controls */}
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => setFanAngle(a => a - 5)}
                        className={`flex-1 rounded-2xl py-3 text-sm font-medium transition-colors ${darkMode ? 'bg-[#1a1b2e] hover:bg-[#232438] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
                      >
                        - 5°
                      </button>
                      <button
                        onClick={() => setFanAngle(a => a + 5)}
                        className={`flex-1 rounded-2xl py-3 text-sm font-medium transition-colors ${darkMode ? 'bg-[#1a1b2e] hover:bg-[#232438] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
                      >
                        + 5°
                      </button>
                    </div>

                    {/* Calculate Button */}
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-4 px-6 flex items-center justify-center gap-2 transition-colors">
                      <span>Calculate Wind Speed</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setFanCameraOpen(true); setFanAngle(0); }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Open Camera to Measure</span>
                  </button>
                )}

                <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  (Running on Android)
                </p>
              </div>
            </>
          )}

          {/* Parachute Drop Page */}
          {currentPage === 'parachute-drop' && (
            <>
              {/* Header */}
              <div className={`px-6 pt-12 pb-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentPage('home')}>
                    <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                  <div className="w-6"></div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === 'parachute-drop' ? null : 'parachute-drop')}>
                      <MoreVertical className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                    {menuOpen === 'parachute-drop' && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 ${darkMode ? 'bg-[#1a1b2e] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <button
                          onClick={() => handleSaveData('Parachute Drop')}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-[#232438] text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Data</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Icon */}
                <div className="flex items-center gap-3">
                  <div className="bg-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Umbrella className="w-6 h-6 text-white" />
                  </div>
                  <h1 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Parachute<br />Dropper</h1>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
                {saveMessage && (
                  <div className="mb-4 bg-green-500/20 border border-green-500 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{saveMessage}</span>
                  </div>
                )}
                <h2 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h2>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Grab some toys and a makeshift parachute.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Point your camera to capture the full fall.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tap when the toy crosses the top line, and tap again at the bottom line!
                    </p>
                  </div>
                </div>

                {/* Open Camera Button */}
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span>Open Camera to Start</span>
                </button>

                <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  (Running on Android)
                </p>
              </div>
            </>
          )}

          {/* Reaction Test Page */}
          {currentPage === 'reaction-test' && (
            <>
              {/* Header */}
              <div className={`px-6 pt-12 pb-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => { setCurrentPage('home'); setReactionState('idle'); if (reactionTimer.current) clearTimeout(reactionTimer.current); }}>
                    <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                  <div className="w-6"></div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === 'reaction-test' ? null : 'reaction-test')}>
                      <MoreVertical className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                    {menuOpen === 'reaction-test' && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 ${darkMode ? 'bg-[#1a1b2e] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <button
                          onClick={() => handleSaveData('Reaction Test')}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-[#232438] text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Data</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Icon */}
                <div className="flex items-center gap-3">
                  <div className="bg-teal-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h1 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reaction Test</h1>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto flex flex-col">
                {saveMessage && (
                  <div className="mb-4 bg-green-500/20 border border-green-500 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{saveMessage}</span>
                  </div>
                )}
                <h2 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h2>

                {/* Steps */}
                <div className="space-y-3 mb-6">
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tap the big button to start.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Wait for the button to turn green (no early tapping!).
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      When it lights up, tap it as fast as you can to get your millisecond score.
                    </p>
                  </div>
                </div>

                {/* Big Reaction Button */}
                <button
                  onClick={handleReactionTap}
                  className={`w-full rounded-2xl flex items-center justify-center transition-colors select-none ${
                    reactionState === 'ready'
                      ? 'bg-green-500 active:bg-green-600'
                      : reactionState === 'waiting'
                      ? 'bg-teal-400 active:bg-teal-500'
                      : 'bg-teal-500 active:bg-teal-600'
                  }`}
                  style={{ minHeight: '200px' }}
                >
                  <span className="text-white text-xl font-semibold">
                    {reactionState === 'idle' && 'Tap to Start'}
                    {reactionState === 'waiting' && 'Wait...'}
                    {reactionState === 'ready' && 'TAP NOW!'}
                    {reactionState === 'result' && 'Tap to restart'}
                  </span>
                </button>

                {/* Result Box */}
                <div className={`mt-4 rounded-2xl px-6 py-4 ${darkMode ? 'bg-[#1a1b2e]' : 'bg-gray-100'}`}>
                  <p className={`text-center font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Reaction Time
                  </p>
                  {reactionState === 'result' && (
                    <p className={`text-center text-2xl font-bold ${earlyTap ? 'text-red-400' : 'text-teal-400'}`}>
                      {earlyTap ? 'Too early!' : `${reactionTime} ms`}
                    </p>
                  )}
                  {reactionState !== 'result' && (
                    <p className={`text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>—</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Bottom Navigation - Hidden on Sign In and Create Account pages */}
          {currentPage !== 'sign-in' && currentPage !== 'create-account' && (
            <div className={`absolute bottom-0 left-0 right-0 border-t ${
              darkMode ? 'bg-[#0a0b1a] border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="max-w-md mx-auto px-2 py-4 overflow-x-auto">
                <div className="flex items-center justify-start gap-4 min-w-max px-2">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className={`flex flex-col items-center gap-1 min-w-[60px] ${currentPage === 'home' ? 'text-cyan-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">Home</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('hand-fan')}
                    className={`flex flex-col items-center gap-1 min-w-[60px] ${currentPage === 'hand-fan' ? 'text-cyan-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Fan className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">Hand Fan</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('human-pace')}
                    className={`flex flex-col items-center gap-1 min-w-[60px] ${currentPage === 'human-pace' ? 'text-cyan-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Footprints className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">Human Pace</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('sound-hunter')}
                    className={`flex flex-col items-center gap-1 min-w-[60px] ${currentPage === 'sound-hunter' ? 'text-cyan-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Headphones className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">Sound Hunter</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('breathing-pace')}
                    className={`flex flex-col items-center gap-1 min-w-[60px] ${currentPage === 'breathing-pace' ? 'text-cyan-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Wind className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">Breathing Pace</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('parachute-drop')}
                    className={`flex flex-col items-center gap-1 min-w-[60px] ${currentPage === 'parachute-drop' ? 'text-cyan-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">Parachute</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('e-freelance')}
                    className={`flex flex-col items-center gap-1 min-w-[60px] ${currentPage === 'e-freelance' ? 'text-cyan-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Zap className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">E-Freelance</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('reaction-test')}
                    className={`flex flex-col items-center gap-1 min-w-[60px] ${currentPage === 'reaction-test' ? 'text-cyan-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Clock className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">Reaction Test</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}