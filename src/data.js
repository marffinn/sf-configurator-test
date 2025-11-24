// src/data.js  ← THIS FILE REPLACES YOUR CURRENT ONE

// === MODELS (updated logic from the new version) ===
export const models = [
    {
        name: 'LDK TZ',
        hef: { A: 25, B: 70, C: 70, D: 70, E: 70 },
        categories: ['A', 'B', 'C', 'D', 'E'],
        availableLengths: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 340, 380, 420],
        material: 'polipropylen',
        hasMetalPin: true,
        pdfLink: 'https://starfix.eu/wp-content/uploads/2025/08/1-ETA-2024.pdf',
    },
    {
        name: 'LDK TN',
        hef: { A: 25, B: 70, C: 70, D: 70, E: 70 },
        categories: ['A', 'B', 'C', 'D', 'E'],
        availableLengths: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300],
        material: 'polipropylen',
        hasMetalPin: true,
        pdfLink: 'https://starfix.eu/wp-content/uploads/2025/08/3-ETA-2024.pdf',
    },
    {
        name: 'LDK GZN',
        hef: { A: 25, B: 40, C: 70, D: 70, E: 70 },
        categories: ['C', 'D', 'E'],
        availableLengths: [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300],
        material: 'polipropylen',
        hasMetalPin: false,
        pdfLink: 'https://starfix.eu/wp-content/uploads/2025/08/2-ETA-2024.pdf',
    },
    {
        name: 'LFH TZ',
        hef: { A: 40, B: 40, C: 0, D: 40, E: 40 },
        categories: ['A', 'B', 'D'],
        availableLengths: [120, 140, 160, 180, 200, 220, 240, 260],
        material: 'polietylen HDPE',
        hasMetalPin: true,
        pdfLink: 'https://starfix.eu/wp-content/uploads/2021/05/LFH_TZ-2-ETA-2021-06.05.2021.pdf',
    },
    {
        name: 'LFH GZN',
        hef: { A: 40, B: 40, C: 0, D: 40, E: 40 },
        categories: ['A', 'B', 'D'],
        availableLengths: [90, 100, 120, 140, 160, 180, 200, 220, 240, 260],
        material: 'polietylen HDPE',
        hasMetalPin: false,
        pdfLink: 'https://starfix.eu/wp-content/uploads/2021/05/LFH_GZN-1-ETA-2021-06.05.2021.pdf',
    },
    {
        name: 'LEH TN',
        hef: { A: 40, B: 40, C: 0, D: 40, E: 40 },
        categories: ['A', 'B', 'D'],
        availableLengths: [120, 140, 160, 180, 200, 220, 240, 260],
        material: 'polietylen HDPE',
        hasMetalPin: true,
        pdfLink: 'https://starfix.eu/wp-content/uploads/2021/04/LEH_TN-3-ETA-2021.pdf',
    },
    {
        name: 'LXK 10 H',
        hef: { A: 50, B: 50, C: 50, D: 50, E: 50 },
        categories: ['A', 'B', 'C', 'D', 'E'],
        availableLengths: [160, 180, 200, 220, 240, 260],
        material: 'polipropylen',
        hasMetalPin: true,
        pdfLink: 'https://starfix.eu/wp-content/uploads/2021/04/LXK-4-ETA-2021.pdf',

        calculateRequired: ({ hD, adhesiveThickness, recessedDepth, isRecessed }) => {
            if (isRecessed) {
                if (hD < 120) return null;
                const remaining = hD - recessedDepth;
                if (remaining < 100) return null;
                return remaining;
            } else {
                if (hD < 100) return null;
                return hD + adhesiveThickness;
            }
        },
    },
];

// === UI LISTS (unchanged – needed for selects) ===
export const substrates = [
    { value: 'A', label: 'Beton zwykły (C12/15 do C50/60)' },
    { value: 'B', label: 'Cegła pełna (ceramiczna/silikatowa)' },
    { value: 'C', label: 'Cegła perforowana/kanałowa (Porotherm 25, 17 mm)' },
    { value: 'D', label: 'Beton na kruszywie lekkim (LAC)' },
    { value: 'E', label: 'Beton komórkowy (AAC)' },
];

export const insulationTypes = [
    { value: 'EPS', label: 'Styropian (EPS/XPS)' },
    { value: 'MW', label: 'Wełna mineralna' },
];