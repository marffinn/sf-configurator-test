// src/data.js

const PUBLIC_URL = process.env.PUBLIC_URL || '';

export const models = [
  {
    name: 'LDK TZ',
    hef: { A: 25, B: 70, C: 70, D: 70, E: 70 },
    categories: ['A', 'B', 'C', 'D', 'E'],
    availableLengths: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 340, 380, 420],
    material: 'polipropylen',
    hasMetalPin: true,
    pdfLink: 'https://starfix.eu/wp-content/uploads/2025/08/1-ETA-2024.pdf',
    image: `${PUBLIC_URL}/images/fasteners/ldk-tz.png`,
    imageAlt: 'Łącznik LDK TZ',
  },
  {
    name: 'LDK TN',
    hef: { A: 25, B: 70, C: 70, D: 70, E: 70 },
    categories: ['A', 'B', 'C', 'D', 'E'],
    availableLengths: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300],
    material: 'polipropylen',
    hasMetalPin: true,
    pdfLink: 'https://starfix.eu/wp-content/uploads/2025/08/3-ETA-2024.pdf',
    image: `${PUBLIC_URL}/images/fasteners/ldk-tn.png`,
    imageAlt: 'Łącznik LDK TN',
  },
  {
    name: 'LDK GZN',
    hef: { A: 25, B: 40, C: 70, D: 70, E: 70 },
    categories: ['C', 'D', 'E'],
    availableLengths: [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300],
    material: 'polipropylen',
    hasMetalPin: false,
    pdfLink: 'https://starfix.eu/wp-content/uploads/2025/08/2-ETA-2024.pdf',
    image: `${PUBLIC_URL}/images/fasteners/ldk-gzn.png`,
    imageAlt: 'Łącznik LDK GZN',
  },
  {
    name: 'LFH TZ',
    hef: { A: 40, B: 40, C: 0, D: 40, E: 40 },
    categories: ['A', 'B', 'D'],
    availableLengths: [120, 140, 160, 180, 200, 220, 240, 260],
    material: 'polietylen HDPE',
    hasMetalPin: true,
    pdfLink: 'https://starfix.eu/wp-content/uploads/2021/05/LFH_TZ-2-ETA-2021-06.05.2021.pdf',
    image: `${PUBLIC_URL}/images/fasteners/lfh-tz.png`,
    imageAlt: 'Łącznik LFH TZ',
  },
  {
    name: 'LFH GZN',
    hef: { A: 40, B: 40, C: 0, D: 40, E: 40 },
    categories: ['A', 'B', 'D'],
    availableLengths: [90, 100, 120, 140, 160, 180, 200, 220, 240, 260],
    material: 'polietylen HDPE',
    hasMetalPin: false,
    pdfLink: 'https://starfix.eu/wp-content/uploads/2021/05/LFH_GZN-1-ETA-2021-06.05.2021.pdf',
    image: `${PUBLIC_URL}/images/fasteners/lfh-gzn.png`,
    imageAlt: 'Łącznik LFH GZN',
  },
  {
    name: 'LEH TN',
    hef: { A: 40, B: 40, C: 0, D: 40, E: 40 },
    categories: ['A', 'B', 'D'],
    availableLengths: [120, 140, 160, 180, 200, 220, 240, 260],
    material: 'polietylen HDPE',
    hasMetalPin: true,
    pdfLink: 'https://starfix.eu/wp-content/uploads/2021/04/LEH_TN-3-ETA-2021.pdf',
    image: `${PUBLIC_URL}/images/fasteners/leh-tn.png`,
    imageAlt: 'Łącznik LEH TN',
  },
  {
    name: 'LXK 10 H',
    hef: { A: 50, B: 50, C: 50, D: 50, E: 50 },
    categories: ['A', 'B', 'C', 'D', 'E'],
    availableLengths: [160, 180, 200, 220, 240, 260],
    material: 'polipropylen',
    hasMetalPin: true,
    pdfLink: 'https://starfix.eu/wp-content/uploads/2021/04/LXK-4-ETA-2021.pdf',
    image: `${PUBLIC_URL}/images/fasteners/lxk-10h.png`,
    imageAlt: 'Łącznik LXK 10 H – do montażu zagłębionego',


    calculateRequired: ({ grubIzolacji, grubKlej, grubZaslepka, isRecessed }) => {
      if (isRecessed) {
        if (grubIzolacji < 120) return null;
        const remaining = grubIzolacji - grubZaslepka;
        if (remaining < 100) return null;
        return remaining;
      }
      if (!isRecessed) {
        if (grubIzolacji < 100) return null;
        return grubIzolacji + grubKlej;
      }

      return null;
    }
  }
];

export const substrates = [
  { value: 'A', label: '(A) Beton zwykły (C12/15 do C50/60)' },
  { value: 'B', label: '(B) Cegła pełna (ceramiczna/silikatowa)' },
  { value: 'C', label: '(C) Cegła perforowana/kanałowa (Porotherm 25, 17 mm)' },
  { value: 'D', label: '(D) Beton na kruszywie lekkim (LAC)' },
  { value: 'E', label: '(E) Beton komórkowy (AAC)' },
];

export const insulationTypes = [
  { value: 'EPS', label: 'Styropian (EPS/XPS)' },
  { value: 'MW', label: 'Wełna mineralna' },
];