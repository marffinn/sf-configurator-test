// src/Steps.js
import React, { useState } from 'react';
import {
  Box, Button, Typography, FormControl, InputLabel, Select, MenuItem,
  Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Link as MuiLink, Alert, FormControlLabel, Switch, useTheme, useMediaQuery, Modal, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import { substrates, insulationTypes } from './data';
import companyLogo from './logo.png';

export function Step0(props) {
  const { substrate, setSubstrate, errors, nextStep } = props;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth error={!!errors.substrate}>
        <InputLabel id="substrate-select-label">Podłoże</InputLabel>
        <Select
          labelId="substrate-select-label"
          value={substrate}
          label="Podłoże"
          onChange={(e) => setSubstrate(e.target.value)}
        >
          {substrates.map((s) => (
            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
          ))}
        </Select>
        {errors.substrate && <Typography color="error" variant="caption">{errors.substrate}</Typography>}
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" onClick={nextStep} endIcon={<ArrowForwardIcon />}>
          Dalej
        </Button>
      </Box>
    </Box>
  );
}

export function Step1(props) {
  const { insulationType, setInsulationType, errors, nextStep, prevStep } = props;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth error={!!errors.insulationType}>
        <Typography variant="subtitle1">Typ izolacji</Typography>
        <Select value={insulationType} onChange={(e) => setInsulationType(e.target.value)} displayEmpty>
          <MenuItem value="" disabled>Wybierz typ izolacji</MenuItem>
          {insulationTypes.map((t) => (
            <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
          ))}
        </Select>
        {errors.insulationType && <Typography color="error" variant="caption">{errors.insulationType}</Typography>}
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={prevStep}>Wstecz</Button>
        <Button variant="contained" onClick={nextStep} endIcon={<ArrowForwardIcon />}>Dalej</Button>
      </Box>
    </Box>
  );
}

export function Step2(props) {
  const { hD, setHD, errors, nextStep, prevStep } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const desktopMarks = [
    { value: 50, label: '50mm' }, { value: 100, label: '100mm' }, { value: 150, label: '150mm' },
    { value: 200, label: '200mm' }, { value: 250, label: '250mm' }, { value: 300, label: '300mm' },
    { value: 350, label: '350mm' }, { value: 400, label: '400mm' },
  ];

  const mobileMarks = [
    { value: 50 }, { value: 100 }, { value: 150 }, { value: 200 }, { value: 250 },
    { value: 300 }, { value: 350 }, { value: 400 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: { xs: 1, sm: 2 } }}>
      <Typography variant="body1" align="center" sx={{ mb: -1 }}>
        Grubość izolacji: {hD} mm
      </Typography>
      <Slider
        value={hD}
        onChange={(_, v) => setHD(v)}
        valueLabelDisplay="auto"
        min={10}
        max={400}
        step={10}
        marks={isSmallScreen ? mobileMarks : desktopMarks}
      />
      {errors.hD && <Typography color="error" variant="caption">{errors.hD}</Typography>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={prevStep}>Wstecz</Button>
        <Button variant="contained" onClick={nextStep} endIcon={<ArrowForwardIcon />}>Dalej</Button>
      </Box>
    </Box>
  );
}

export function StepAdhesive(props) {
  const { adhesiveThickness, setAdhesiveThickness, errors, prevStep, onNext } = props;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle1">Grubość warstwy kleju + tynku</Typography>
      <Box sx={{ px: 2 }}>
        <Slider
          value={adhesiveThickness}
          onChange={(_, v) => setAdhesiveThickness(v)}
          min={0}
          max={50}
          step={10}
          marks={[
            { value: 0, label: '0 mm' },
            { value: 10, label: '10 mm' },
            { value: 20, label: '20 mm' },
            { value: 30, label: '30 mm' },
            { value: 40, label: '40 mm' },
            { value: 50, label: '50 mm' },
          ]}
          valueLabelDisplay="on"
        />
      </Box>
      {errors.adhesiveThickness && <Typography color="error">{errors.adhesiveThickness}</Typography>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={prevStep}>Wstecz</Button>
        <Button variant="contained" onClick={onNext} endIcon={<ArrowForwardIcon />}>
          Pokaż rekomendacje
        </Button>
      </Box>
    </Box>
  );
}

export function StepRecessedDepth(props) {
  const {
    recessedDepth,
    setRecessedDepth,
    errors,
    prevStep,
    buttonText = 'Dalej',
    onNext,
  } = props;

  const isRecessed = recessedDepth > 0;

  const handleSwitch = (e) => {
    setRecessedDepth(e.target.checked ? 20 : 0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, px: { xs: 1, sm: 2 } }}>
      {/* Pytanie + przełącznik TAK/NIE */}
      <Box sx={{ textAlign: 'center' }}>

        <FormControlLabel
          control={
            <Switch
              checked={isRecessed}
              onChange={handleSwitch}
              color="primary"
              size="large"
            />
          }
          label={<Typography variant="h5" sx={{ fontWeight: 600 }}>{isRecessed ? 'TAK' : 'NIE'}</Typography>}
          labelPlacement="end"
        />
      </Box>

      {/* Slider – widoczny tylko przy TAK */}
      {isRecessed && (
        <Box>
          <Typography variant="body1" align="center" gutterBottom>
            Głębokość montażu zagłębionego: <strong>{recessedDepth} mm</strong>
          </Typography>
          <Slider
            value={recessedDepth}
            onChange={(_, v) => setRecessedDepth(v)}
            min={0}
            max={160}
            step={10}
            marks={[
              { value: 0, label: '0 mm' },
              { value: 20, label: '20 mm' },
              { value: 40, label: '40 mm' },
              { value: 80, label: '80 mm' },
              { value: 120, label: '120 mm' },
              { value: 160, label: '160 mm' },
            ]}
            valueLabelDisplay="auto"
          />
          {errors.recessedDepth && (
            <Typography color="error" align="center" sx={{ mt: 1 }}>
              {errors.recessedDepth}
            </Typography>
          )}
        </Box>
      )}

      {/* NOWA INFORMACJA NA DOLE */}
      <Typography
        variant="caption"
        align="center"
        sx={{
          color: 'text.secondary',
          fontStyle: 'italic',
          mt: 2,
          display: 'block'
        }}
      >
        * 20 mm to standardowa grubość zaślepki.
      </Typography>

      {/* Przyciski */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mt: 3 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={prevStep}>
          Wstecz
        </Button>
        <Button variant="contained" onClick={onNext} endIcon={<ArrowForwardIcon />}>
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
}

export function Step4(props) {
  const {
    recommendations,
    prevStep,
    handleStartOver,
    substrate,
    insulationType,
    hD,
    adhesiveThickness,
    recessedDepth,
    email,
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (rec) => {
    setSelectedImage(rec);
    setModalOpen(true);
  };

  const handlePrint = () => window.print();

  const substrateLabel = substrates.find(s => s.value === substrate)?.label || '';
  const insulationLabel = insulationTypes.find(i => i.value === insulationType)?.label || '';

  return (
    <Box sx={{ textAlign: 'center' }}>
      <img src={companyLogo} alt="Starfix Logo" className="print-logo" />

      <Typography variant="h6" gutterBottom>Tvoje parametry:</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Podłoże: <strong>{substrateLabel}</strong><br />
        Izolacja: <strong>{insulationLabel}</strong><br />
        Grubość izolacji: <strong>{hD} mm</strong><br />
        Warstwa kleju + tynk: <strong>{adhesiveThickness} mm</strong><br />
        Montaż zagłębiony: <strong>{recessedDepth > 0 ? `${recessedDepth} mm` : 'Nie'}</strong>
      </Typography>

      {recommendations.length > 0 ? (
        <Box>
          <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto', mb: 3 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nazwa</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>Materiał</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Dokumentacja</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.name}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {rec.image && (
                          <Box
                            component="img"
                            src={rec.image}
                            alt={rec.imageAlt || rec.name}
                            onClick={() => openModal(rec)}
                            sx={{
                              width: 64,
                              height: 64,
                              objectFit: 'cover',
                              borderRadius: 2,
                              cursor: 'pointer',
                              border: rec.name === 'LXK 10 H' ? '3px solid #dd0000' : '2px solid #e0e0e0'
                            }}
                          />
                        )}
                        <Box>
                          <Typography fontWeight="bold" color={rec.name === 'LXK 10 H' ? 'primary' : 'inherit'}>
                            {rec.name} {rec.laRecommended} mm
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                            {rec.material}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{rec.material}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {rec.pdfLink && (
                        <MuiLink href={rec.pdfLink} target="_blank" rel="noopener noreferrer">
                          <PictureAsPdfIcon sx={{ fontSize: 18 }} /> PDF
                        </MuiLink>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="success" sx={{ mb: 3 }} className="email-alert">
            Rekomendacje zostały wysłane na adres {email}
          </Alert>
        </Box>
      ) : (
        <Typography variant="h6" color="error" sx={{ my: 4 }}>
          Nie znaleziono odpowiedniego produktu. Skontaktuj się z działem technicznym.
        </Typography>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }} className="action-buttons-container">
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Drukuj</Button>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={prevStep}>Wstecz</Button>
        <Button variant="outlined" onClick={handleStartOver}>Zacznij od nowa</Button>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, maxWidth: '90vw' }}>
          <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setModalOpen(false)}>
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <>
              <Typography variant="h6" gutterBottom>{selectedImage.name}</Typography>
              <img src={selectedImage.image} alt={selectedImage.name} style={{ maxWidth: '100%', borderRadius: 8 }} />
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}