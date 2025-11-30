// src/App.js – PERFECTLY MATCHED TO HTML VERSION

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
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.75, color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
        Konfigurator to narzędzie pozwalające w prosty sposób, teoretycznie dobrać długość i typ łącznika dla podanych parametrów.
        Powstały wynik jest wyłącznie rekomendacją i nie zastępuje projektu technicznego oraz wymagań KOT i ETA dla podanych łączników.
      </Typography>

      <FormControl component="fieldset" sx={{ width: '100%', mb: 4 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              color="primary"
              size="large"
            />
          }
          label={
            <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
              Zapoznałem/am sie z powyższym i akceptuję.
            </Typography>
          }
        />
      </FormControl>

      <Button
        variant="contained"
        size="large"
        disabled={!accepted}
        onClick={onAccept}
        fullWidth
        sx={{ height: 56, fontSize: '1.15rem', textTransform: 'none' }}
      >
        Przejdź dalej
      </Button>
    </Box>
  );
}

function EmailStep({ setEmail, nextStep }) {
  const [localEmail, setLocalEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 0 && !formData.substrate) newErrors.substrate = 'Wybierz rodzaj podłoża';
    if (currentStep === 1 && !formData.insulationType) newErrors.insulationType = 'Wybierz typ izolacji';
    if (currentStep === 2 && (formData.recessedDepth < 0 || formData.recessedDepth > 160)) newErrors.recessedDepth = 'Głębokość montażu zagłębionego musi być między 0 a 160 mm';
    if (currentStep === 3 && (formData.hD < 10 || formData.hD > 400)) newErrors.hD = 'Grubość izolacji musi być między 10 a 400 mm';
    if (currentStep === 4 && (formData.adhesiveThickness < 10 || formData.adhesiveThickness > 50)) newErrors.adhesiveThickness = 'Grubość warstwy kleju musi być między 10 a 50 mm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = (recommendations) => {
    const substrateLabel = substrates.find(s => s.value === formData.substrate)?.label || '';
    const insulationTypeLabel = insulationTypes.find(i => i.value === formData.insulationType)?.label || '';

    const recommendationsHtml = `
    <table style="width:100%; border-collapse:collapse; margin:20px 0; font-size:14px;" border="1" cellpadding="10">
      <thead style="background:#f0f0f0;">
        <tr>
          <th>Nazwa</th>
          <th>Zalecana długość (mm)</th>
          <th>Materiał</th>
        </tr>
      </thead>
      <tbody>
        ${recommendations.map(rec => `
          <tr ${rec.name === 'LXK 10 H' ? 'style="background:#fff8e1; font-weight:bold;"' : ''}>
            <td style="color:${rec.name === 'LXK 10 H' ? '#dd0000' : 'inherit'};">
              ${rec.name} ${rec.name === 'LXK 10 H' ? ' ← rekomendowany' : ''}
            </td>
            <td style="text-align:center; font-weight:bold;">${rec.laRecommended}</td>
            <td>${rec.material}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

    const templateParams = {
      to_email: email,
      client_email: email,
      substrate: substrateLabel,
      insulationType: insulationTypeLabel,
      insulationThickness: formData.hD,
      adhesiveThickness: formData.adhesiveThickness,
      recessedDepth: formData.recessedDepth === 0 ? 'Brak' : `${formData.recessedDepth} mm`,

      disclaimer_html: `
      <div style="background:#fff8e1; border-left:5px solid #ff8f00; padding:15px; margin:20px 0; font-size:14px; line-height:1.6;">
        <strong>Potwierdzenie zapoznania się z warunkami korzystania</strong><br><br>
        Użytkownik potwierdził, że zapoznał się z następującymi warunkami: <br>
        • Konfigurator ma charakter wyłącznie orientacyjny i teoretyczny<br>
        • Wynik jest jedynie rekomendacją i <strong>nie zastępuje projektu technicznego</strong><br>
        • Wymagana jest weryfikacja przez specjalistę zgodnie z KOT i ETA
      </div>
    `,

      recommendations_html: recommendationsHtml,

      timestamp: new Date().toLocaleString('pl-PL', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };

    emailjs.send('service_wl8dg9a', 'template_jgv00kz', templateParams, 'ndfOyBTYvqBjOwsI_')
      .then(() => console.log('Email wysłany!'))
      .catch(err => console.error('EmailJS error:', err));
  };

  // ✅ EXACT LOGIC FROM HTML VERSION (main.js)
  const calculateLa = () => {
    const { substrate, insulationType, hD, adhesiveThickness, recessedDepth } = formData;
    const isRecessed = recessedDepth > 0;

<<<<<<< HEAD
    // ───── VALIDATION ─────
    if (isRecessed && recessedDepth >= hD) {
      setErrors({ global: 'Głębokość zaślepki nie może być większa lub równa grubości izolacji!' });
      setRecommendations([]);
      return;
    }
    if (isRecessed && hD - recessedDepth < 20) {
      setErrors({ global: 'Pozostała grubość izolacji musi wynosić min. 20 mm!' });
=======
    // Validation matching HTML version
    if (isRecessed && recessedDepth >= hD) {
      setErrors({ global: 'Zaślepka nie może być dłuższa niż izolacja!' });
>>>>>>> f7c5382dbadc7f190f0e289ea20a935abdb2cd4a
      setRecommendations([]);
      return;
    }

<<<<<<< HEAD
    const validModels = models
      .filter(m => m.categories.includes(substrate))
      .filter(m => insulationType !== 'MW' || m.hasMetalPin);

    const recommendations = [];

    validModels.forEach(model => {
      const hef = model.hef[substrate];
      if (!hef) return;

      let requiredLength;

      if (model.calculateRequired) {
        requiredLength = model.calculateRequired({
          hD,
          adhesiveThickness,
          recessedDepth,
          isRecessed,
        });
        if (requiredLength === null) return;
      } else {
        requiredLength = hD + adhesiveThickness - recessedDepth;
      }

      const total = requiredLength + hef;
      const suggested = model.availableLengths
        .filter(l => l >= total)
        .sort((a, b) => a - b)[0];

      if (suggested) {
        recommendations.push({
          name: model.name,
          laRecommended: suggested,
          material: model.material,
          pdfLink: model.pdfLink,
          priority: model.name === 'LXK 10 H' ? 1 : 0,
          calculationNote: model.name === 'LXK 10 H'
            ? isRecessed
              ? `Pozostała izolacja: ${hD - recessedDepth} mm + hₑ𝒻=${hef} mm`
              : `${hD} mm + klej ${adhesiveThickness} mm + hₑ𝒻=${hef} mm`
            : undefined,
        });
      }
    });

    // Sort: LXK 10 H first when valid, then shortest length
    recommendations.sort((a, b) => b.priority - a.priority || a.laRecommended - b.laRecommended);

    // This forces re-render immediately
    setRecommendations(recommendations);
    setErrors(recommendations.length === 0 ? { global: 'Brak pasujących łączników dla podanych parametrów.' } : {});

    // CRITICAL: go to results step
=======
    if (isRecessed && (hD - recessedDepth) < 20) {
      setErrors({ global: 'Zaślepka musi być co najmniej 20 mm krótsza od izolacji!' });
      setRecommendations([]);
      return;
    }

    const validModels = models.filter(m => m.categories.includes(substrate));
    const suggestions = [];

    validModels.forEach(model => {
      const hef = model.hef[substrate];

      // Skip if hef is undefined or 0
      if (hef === undefined || hef === 0) return;

      // Skip non-metal-pin models for mineral wool
      if (insulationType === 'MW' && !model.hasMetalPin) return;

      let required;

      // ✅ EXACT LOGIC FROM data.js
      if (typeof model.calculateRequired === 'function') {
        // LXK 10 H uses custom function
        required = model.calculateRequired({
          grubIzolacji: hD,
          grubKlej: adhesiveThickness,
          grubZaslepka: recessedDepth,
          isRecessed: isRecessed
        });

        if (required === null) return;
      } else {
        // ✅ STANDARD MODELS: EXACT FORMULA FROM main.js
        // required = grubIzolacji + grubKlej - grubZaslepka
        required = hD + adhesiveThickness - recessedDepth;
      }

      const offset = model.offset || 0;
      const finalRequired = required + offset + hef;

      if (finalRequired <= 0) return;

      // Find smallest available length that fits
      const available = model.availableLengths
        .filter(l => l >= finalRequired)
        .sort((a, b) => a - b)[0];

      if (!available) return;

      suggestions.push({
        ...model,
        laRecommended: available,  // ✅ Show the total product length to select
        hef: hef,
        totalLength: available,
        priority: model.name === 'LXK 10 H' ? 100 : (model.hasMetalPin ? 10 : 5),
        finalRequired: finalRequired
      });
    });

    // Sort by priority, then by length
    suggestions.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.totalLength - b.totalLength;
    });

    setRecommendations(suggestions);
    setErrors(suggestions.length === 0 ? { global: 'Brak pasujących łączników dla podanych parametrów.' } : {});

    if (suggestions.length > 0) {
      sendEmail(suggestions);
    }

>>>>>>> f7c5382dbadc7f190f0e289ea20a935abdb2cd4a
    setStep(prev => prev + 1);
  };

  const nextStep = () => { if (validateStep(step)) setStep(prev => prev + 1); };
  const prevStep = () => { setStep(prev => prev - 1); };
  const goToStep = (index) => {
    if (index > step) {
      let isValid = true;
      for (let i = step; i < index; i++) { if (!validateStep(i)) { isValid = false; break; } }
      if (isValid) setStep(index);
    } else {
      setStep(index);
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
    { label: 'Rekomendacja dla', title: 'Rekomendacja dla Twojej konfiguracji' },
  ];

  const stepIconsList = [
    <FoundationIcon key="foundation" />, <LayersIcon key="layers" />, <SettingsIcon key="settings" />,
    <HeightIcon key="height" />, <BuildIcon key="build" />, <CheckCircleIcon key="check" />,
  ];

  function CustomStepIcon(props) {
    const { active, completed, error } = props;
    const iconIndex = props.icon - 1;

    if (error) {
      return (
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: '50%',
          backgroundColor: 'error.main', color: 'white',
          boxShadow: '0 0 0 3px rgba(244, 67, 54, 0.3)',
        }}>
          {stepIconsList[iconIndex]}
        </Box>
      );
    }

    return (
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 40, height: 40, borderRadius: '50%',
        backgroundColor: active ? 'primary.main' : completed ? 'primary.main' : 'grey.300',
        color: active || completed ? 'white' : 'grey.600',
        boxShadow: active ? '0 0 0 3px rgba(221, 0, 0, 0.3)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {stepIconsList[iconIndex]}
      </Box>
    );
  }

  const stepComponents = [
    <Step0 substrate={formData.substrate} setSubstrate={(v) => updateFormData('substrate', v)} errors={errors} nextStep={nextStep} />,
    <Step1 insulationType={formData.insulationType} setInsulationType={(v) => updateFormData('insulationType', v)} errors={errors} nextStep={nextStep} prevStep={prevStep} />,
    <StepRecessedDepth recessedDepth={formData.recessedDepth} setRecessedDepth={(v) => updateFormData('recessedDepth', v)} errors={errors} prevStep={prevStep} buttonText="Dalej" onNext={nextStep} />,
    <Step2 hD={formData.hD} setHD={(v) => updateFormData('hD', v)} errors={errors} nextStep={nextStep} prevStep={prevStep} />,
    <StepAdhesive adhesiveThickness={formData.adhesiveThickness} setAdhesiveThickness={(v) => updateFormData('adhesiveThickness', v)} errors={errors} prevStep={prevStep} buttonText="Pokaż rekomendacje" onNext={calculateLa} />,
    <Step4 recommendations={recommendations} prevStep={prevStep} setStep={setStep} handleStartOver={handleStartOver} {...formData} errors={errors} email={email} />,
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 300, letterSpacing: '1.5px', my: 3, fontSize: { xs: '1.8rem', sm: '2.2rem' } }} className="app-title">
          Konfigurator łączników STARFIX
        </Typography>

        {!disclaimerAccepted ? (
          <DisclaimerStep onAccept={() => setDisclaimerAccepted(true)} />
        ) : !emailSubmitted ? (
          <EmailStep setEmail={setEmail} nextStep={() => setEmailSubmitted(true)} />
        ) : (
          <>
            <MuiStepper activeStep={step} alternativeLabel sx={{ mb: 4, overflow: 'auto' }} className="stepper-container">
              {stepsConfig.map((config, index) => (
                <Step key={config.label} completed={step > index}>
                  <StepLabel
                    slots={{ stepIcon: CustomStepIcon }}
                    onClick={() => goToStep(index)}
                    error={!!errors[Object.keys(formData)[index]]}
                    StepIconProps={{ error: !!errors[Object.keys(formData)[index]] }}
                    sx={{ cursor: 'pointer', '& .MuiStepLabel-label': { fontSize: { xs: '0.75rem', sm: '0.9rem' }, fontWeight: 500 } }}
                  >
                    {config.label}
                  </StepLabel>
                </Step>
              ))}
            </MuiStepper>

            <Box sx={{ mt: 4, p: { xs: 2, sm: 3 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }} className="main-content-box">
              <Typography variant="h5" component="h2" gutterBottom align="center">
                {stepsConfig[step].title}
              </Typography>
              <Box sx={{ p: 2 }}>{stepComponents[step]}</Box>
            </Box>
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <FormControlLabel
            control={<Switch checked={themeMode === 'dark'} onChange={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')} />}
            label={themeMode === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;