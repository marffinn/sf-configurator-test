// src/App.js
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import {
  ThemeProvider, createTheme, CssBaseline, Box, Container, Typography,
  Stepper as MuiStepper, Step, StepLabel, TextField, Button, Switch,
  FormControlLabel, Checkbox, FormControl
} from '@mui/material';

import { models, substrates, insulationTypes } from './data';
import { Step0, Step1, Step2, StepAdhesive, StepRecessedDepth, Step4 } from './Steps';
import './StepperCustom.css';
import FoundationIcon from '@mui/icons-material/Foundation';
import LayersIcon from '@mui/icons-material/Layers';
import HeightIcon from '@mui/icons-material/Height';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light' ? {
      primary: { main: '#dd0000' },
      background: { default: '#f5f5f5', paper: '#ffffff' },
      text: { primary: '#333333', secondary: '#555555' },
    } : {
      primary: { main: '#ff6b6b' },
      background: { default: '#121212', paper: '#1e1e1e' },
      text: { primary: '#ffffff', secondary: '#bbbbbb' },
    }),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'none',
          backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#f0f0f0' : '#2a2a2a',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: mode === 'light' ? '#333333' : '#ffffff',
        },
      },
    },
  },
});

function DisclaimerStep({ onAccept }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <Box sx={{ maxWidth: 660, mx: 'auto', p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Ważna informacja
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.75, color: 'text.secondary' }}>
        Konfigurator to narzędzie pozwalające w prosty sposób, teoretycznie dobrać długość i typ łącznika dla podanych parametrów.
        Powstały wynik jest wyłącznie rekomendacją i nie zastępuje projektu technicznego oraz wymagań KOT i ETA dla podanych łączników.<br />
        <br />
        Ważne: konfigurator działa wyłącznie dla kołków firmy Amex Starfix.
        Nie zalecamy używania go do doboru kołków innych producentów
      </Typography>

      <FormControl component="fieldset" sx={{ width: '100%', mb: 4 }}>
        <FormControlLabel
          control={<Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)} color="primary" size="large" />}
          label={<Typography sx={{ fontWeight: 500 }}>Zapoznałem/am się z powyższym i akceptuję.</Typography>}
        />
      </FormControl>

      <Button variant="contained" size="large" disabled={!accepted} onClick={onAccept} fullWidth sx={{ height: 56 }}>
        Przejdź dalej
      </Button>
    </Box>
  );
}

function EmailStep({ setEmail, nextStep }) {
  const [localEmail, setLocalEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (validateEmail(localEmail)) {
      setEmail(localEmail);
      nextStep();
    } else {
      setError('Proszę podać poprawny adres email.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Podaj swój adres email, aby otrzymać wyniki
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        type="email"
        value={localEmail}
        onChange={(e) => setLocalEmail(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        error={!!error}
        helperText={error}
        fullWidth
      />
      <Button variant="contained" size="large" onClick={handleSubmit} fullWidth sx={{ height: 56 }}>
        Kontynuuj
      </Button>
    </Box>
  );
}

function App() {
  const [themeMode, setThemeMode] = useState('light');
  const theme = getTheme(themeMode);

  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    substrate: 'A',
    insulationType: 'EPS',
    hD: 80,
    adhesiveThickness: 10,
    recessedDepth: 0,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 0 && !formData.substrate) newErrors.substrate = 'Wybierz rodzaj podłoża';
    if (currentStep === 1 && !formData.insulationType) newErrors.insulationType = 'Wybierz typ izolacji';
    if (currentStep === 2 && (formData.recessedDepth < 0 || formData.recessedDepth > 160))
      newErrors.recessedDepth = 'Głębokość montażu zagłębionego musi być między 0 a 160 mm';
    if (currentStep === 3 && (formData.hD < 10 || formData.hD > 400))
      newErrors.hD = 'Grubość izolacji musi być między 10 a 400 mm';
    if (currentStep === 4 && (formData.adhesiveThickness < 0 || formData.adhesiveThickness > 50))
      newErrors.adhesiveThickness = 'Grubość warstwy kleju musi być między 0 a 50 mm';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = (list) => {
    const params = {
      to_email: email,
      substrate: substrates.find(s => s.value === formData.substrate)?.label || '',
      insulation: insulationTypes.find(i => i.value === formData.insulationType)?.label || '',
      hD: formData.hD,
      adhesive_thickness: formData.adhesiveThickness,
      recessed_depth: formData.recessedDepth,
      recommendations: list.map(r => `${r.name} – ${r.laRecommended} mm`).join('\n'),
    };

    emailjs.send('service_wl8dg9a', 'template_jgv00kz', params, 'ndfOyBTYvqBjOwsI_')
      .then(() => console.log('Email wysłany'))
      .catch(err => console.error('Błąd emailjs:', err));
  };

  const calculateLa = () => {
    const { substrate, hD, adhesiveThickness, recessedDepth } = formData;
    const isRecessed = recessedDepth > 0;

    const suggestions = models
      .filter(m => m.categories.includes(substrate))
      .map(model => {
        const hef = model.hef[substrate] || 0;
        let required;

        if (model.name === 'LXK 10 H') {
          if (!isRecessed || hD < 120) return null;
          const remaining = hD - recessedDepth;
          if (remaining < 100) return null;
          required = remaining;
        } else {
          required = isRecessed ? hD - recessedDepth + hef : hD + adhesiveThickness + hef;
        }

        const available = model.availableLengths.find(l => l >= required);
        return available ? { ...model, laRequired: required, laRecommended: available } : null;
      })
      .filter(Boolean);

    setRecommendations(suggestions);

    // WP Stats
    try {
      window.parent.postMessage({
        type: 'SF_STATS',
        payload: {
          source: 'etix',
          substrate: substrates.find(s => s.value === substrate)?.label || '',
          insulation_type: insulationTypes.find(i => i.value === formData.insulationType)?.label || '',
          hD, adhesive_thickness: adhesiveThickness, recessed_depth: recessedDepth,
          recommendations: suggestions.map(s => ({ name: s.name, length: s.laRecommended })),
          email
        }
      }, '*');
    } catch (e) { console.error(e); }

    if (email && suggestions.length > 0) sendEmail(suggestions);

    setStep(prev => prev + 1);
  };

  const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);
  const goToStep = (idx) => {
    if (idx < step || (idx > step && [...Array(idx - step).keys()].every(i => validateStep(step + i)))) {
      setStep(idx);
    }
  };

  const handleStartOver = () => {
    setFormData({ substrate: 'A', insulationType: 'EPS', hD: 80, adhesiveThickness: 10, recessedDepth: 0 });
    setRecommendations([]);
    setErrors({});
    setStep(0);
  };

  const stepsConfig = [
    { label: 'Rodzaj podłoża', title: 'Wybierz rodzaj podłoża' },
    { label: 'Typ izolacji', title: 'Wybierz typ izolacji' },
    { label: 'Montaż z zaślepką', title: 'Czy stosujesz montaż zagłębiony z zaślepką?' },
    { label: 'Grubość izolacji', title: 'Podaj grubość izolacji' },
    { label: 'Grubość warstwy kleju i tynku', title: 'Grubość warstwy kleju i tynku' },
    { label: 'Rekomendacja', title: 'Rekomendacja dla Twojej konfiguracji' },
  ];

  const icons = [
    <FoundationIcon />, <LayersIcon />, <SettingsIcon />,
    <HeightIcon />, <BuildIcon />, <CheckCircleIcon />
  ];

  const CustomStepIcon = ({ active, completed }) => {
    const idx = (active || completed) ? step : step - 1;
    return (
      <Box sx={{
        width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: active || completed ? 'primary.main' : 'grey.300',
        color: active || completed ? 'white' : 'grey.600',
        boxShadow: active ? '0 0 0 3px rgba(221,0,0,0.3)' : 'none',
      }}>
        {icons[idx] || icons[icons.length - 1]}
      </Box>
    );
  };

  const stepComponents = [
    <Step0 substrate={formData.substrate} setSubstrate={v => updateFormData('substrate', v)} errors={errors} nextStep={nextStep} />,
    <Step1 insulationType={formData.insulationType} setInsulationType={v => updateFormData('insulationType', v)} errors={errors} nextStep={nextStep} prevStep={prevStep} />,
    <StepRecessedDepth recessedDepth={formData.recessedDepth} setRecessedDepth={v => updateFormData('recessedDepth', v)} errors={errors} prevStep={prevStep} buttonText="Dalej" onNext={nextStep} />,
    <Step2 hD={formData.hD} setHD={v => updateFormData('hD', v)} errors={errors} nextStep={nextStep} prevStep={prevStep} />,
    <StepAdhesive adhesiveThickness={formData.adhesiveThickness} setAdhesiveThickness={v => updateFormData('adhesiveThickness', v)} errors={errors} prevStep={prevStep} buttonText="Pokaż rekomendacje" onNext={calculateLa} />,
    <Step4 recommendations={recommendations} prevStep={prevStep} handleStartOver={handleStartOver} {...formData} email={email} />,
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" className="app-title" sx={{ my: 3, fontWeight: 300 }}>
          Konfigurator łączników STARFIX
        </Typography>

        {!disclaimerAccepted ? (
          <DisclaimerStep onAccept={() => setDisclaimerAccepted(true)} />
        ) : !emailSubmitted ? (
          <EmailStep setEmail={setEmail} nextStep={() => setEmailSubmitted(true)} />
        ) : (
          <>
            <MuiStepper activeStep={step} alternativeLabel sx={{ mb: 4 }} className="stepper-container">
              {stepsConfig.map((cfg, i) => (
                <Step key={i} completed={step > i}>
                  <StepLabel StepIconComponent={CustomStepIcon} onClick={() => goToStep(i)} sx={{ cursor: 'pointer' }}>
                    {cfg.label}
                  </StepLabel>
                </Step>
              ))}
            </MuiStepper>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }} className="main-content-box">
              <Typography variant="h5" align="center" gutterBottom>{stepsConfig[step].title}</Typography>
              <Box sx={{ p: 2 }}>{stepComponents[step]}</Box>
            </Box>
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <FormControlLabel
            control={<Switch checked={themeMode === 'dark'} onChange={() => setThemeMode(m => m === 'light' ? 'dark' : 'light')} />}
            label={themeMode === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;