// src/App.js – FINAL VERSION WITH PRIORITY BOOST + FULL LOGIC

import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, Stepper as MuiStepper, Step, StepLabel, TextField, Button, Switch, FormControlLabel } from '@mui/material';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3 }}>
      <Typography variant="h6">Podaj swój adres email, aby kontynuować</Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={localEmail}
        onChange={(e) => setLocalEmail(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        error={!!error}
        helperText={error}
        sx={{ width: '100%', maxWidth: '400px' }}
      />
      <Button variant="contained" onClick={handleSubmit}>Rozpocznij konfigurację</Button>
    </Box>
  );
}

function App() {
  const [themeMode, setThemeMode] = useState('light');
  const theme = getTheme(themeMode);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
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
    const substrateLabel = substrates.find(s => s.value === formData.substrate)?.label;
    const insulationTypeLabel = insulationTypes.find(i => i.value === formData.insulationType)?.label;

    const recommendationsHtml = `
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Nazwa</th><th>Długość (mm)</th><th>Materiał</th><th>Hef (mm)</th>
          </tr>
        </thead>
        <tbody>
          ${recommendations.map(rec => `
            <tr>
              <td>${rec.name}</td><td>${rec.laRecommended}</td><td>${rec.material}</td><td>${rec.hef}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const templateParams = {
      to_email: email, subject: 'Rekomendacje Łączników ETICS', client_email: email, substrate: substrateLabel,
      insulationType: insulationTypeLabel, insulationThickness: formData.hD, adhesiveThickness: formData.adhesiveThickness,
      recessedDepth: formData.recessedDepth === 0 ? 'Brak' : `${formData.recessedDepth} mm`, recommendations_html: recommendationsHtml
    };

    emailjs.send('service_wl8dg9a', 'template_jgv00kz', templateParams, 'ndfOyBTYvqBjOwsI_')
      .then((response) => { console.log('Email wysłany!', response.status, response.text); })
      .catch((err) => { console.error('Błąd EmailJS:', err); });
  };

  const calculateLa = () => {
    const { substrate, insulationType, hD, adhesiveThickness, recessedDepth } = formData;
    const isRecessed = recessedDepth > 0;

    // Validation
    if (isRecessed && recessedDepth >= hD) {
      setErrors({ global: 'Głębokość zaślepki nie może być większa lub równa grubości izolacji!' });
      setRecommendations([]);
      return;
    }
    if (isRecessed && hD - recessedDepth < 20) {
      setErrors({ global: 'Pozostała grubość izolacji musi wynosić min. 20 mm!' });
      setRecommendations([]);
      return;
    }

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
          image: model.image,
          imageAlt: model.imageAlt,
          priority: model.name === 'LXK 10 H' ? 1 : 0,
          calculationNote: model.name === 'LXK 10 H'
            ? isRecessed
              ? `Pozostała izolacja: ${hD - recessedDepth} mm + hₑ𝒻=${hef} mm`
              : `${hD} mm + klej ${adhesiveThickness} mm + hₑ𝒻=${hef} mm`
            : undefined,
        });
      }
    });

    recommendations.sort((a, b) => b.priority - a.priority || a.laRecommended - b.laRecommended);

    setRecommendations(recommendations);
    setErrors(recommendations.length === 0 ? { global: 'Brak pasujących łączników dla podanych parametrów.' } : {});

    if (recommendations.length > 0) {
      sendEmail(recommendations);
    }

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
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: 'error.main', color: 'white', fontSize: '1.2rem',
            transition: 'all 0.3s ease', boxShadow: '0 0 0 3px rgba(244, 67, 54, 0.3)',
          }}
        >
          {stepIconsList[iconIndex]}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: '50%',
          backgroundColor: active ? 'primary.main' : completed ? 'primary.main' : 'grey.300',
          color: active || completed ? 'white' : 'grey.600', fontSize: '1.2rem',
          transition: 'all 0.3s ease', boxShadow: active ? '0 0 0 3px rgba(221, 0, 0, 0.3)' : 'none',
        }}
      >
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
        <Typography variant="h4" align="center" sx={{ fontWeight: 300, letterSpacing: '1.5px', my: 3, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }} className="app-title">
          Konfigurator Łączników ETICS
        </Typography>
        {!emailSubmitted ? (
          <EmailStep setEmail={setEmail} nextStep={() => setEmailSubmitted(true)} />
        ) : (
          <>
            <MuiStepper activeStep={step} alternativeLabel sx={{ mb: 4, overflow: 'auto' }} className="stepper-container">
              {stepsConfig.map((config, index) => (
                <Step key={config.label} completed={step > index} sx={{ minWidth: { xs: 'auto', sm: 'auto' } }}>
                  <StepLabel
                    slots={{ stepIcon: CustomStepIcon }}
                    onClick={() => goToStep(index)}
                    error={!!errors[Object.keys(formData)[index]]}
                    StepIconProps={{ error: !!errors[Object.keys(formData)[index]] }}
                    sx={{ cursor: 'pointer', fontSize: { xs: '0.75rem', sm: '0.9rem' }, '& .MuiStepLabel-label': { fontSize: { xs: '0.75rem', sm: '0.9rem' }, fontWeight: 500 } }}
                  >
                    {config.label}
                  </StepLabel>
                </Step>
              ))}
            </MuiStepper>
            <Box sx={{ mt: 4, p: { xs: 2, sm: 3 }, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }} className="main-content-box">
              <Typography variant="h5" component="h2" gutterBottom align="center">{stepsConfig[step].title}</Typography>
              <Box sx={{ p: 2, borderRadius: 1 }}>{stepComponents[step]}</Box>
            </Box>
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} className="dark-mode-container">
          <FormControlLabel
            control={<Switch checked={themeMode === 'dark'} onChange={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')} />}
            label={themeMode === 'light' ? 'Tryb Ciemny' : 'Tryb Jasny'}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;