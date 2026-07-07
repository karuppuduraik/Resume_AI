import React, { useState, useEffect } from 'react';
import { FaPalette, FaUndo, FaCog, FaTimes } from 'react-icons/fa';

const ThemeCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#B97A56');

  const presets = [
    { name: 'Warm Brown', hex: '#B97A56' },
    { name: 'Gold/Amber', hex: '#D4AF37' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Royal Blue', hex: '#3B82F6' },
    { name: 'Velvet Purple', hex: '#8B5CF6' },
    { name: 'Crimson Red', hex: '#EF4444' },
    { name: 'Sunset Orange', hex: '#F97316' },
  ];

  // Helper to lighten/darken a hex color
  const adjustColor = (hex, percent) => {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    R = R > 0 ? R : 0;
    G = G > 0 ? G : 0;
    B = B > 0 ? B : 0;

    const rHex = R.toString(16).padStart(2, '0');
    const gHex = G.toString(16).padStart(2, '0');
    const bHex = B.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  const hexToRgb = (hex) => {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);
    return `${R}, ${G}, ${B}`;
  };

  const hexToHsl = (hex) => {
    let R = parseInt(hex.substring(1, 3), 16) / 255;
    let G = parseInt(hex.substring(3, 5), 16) / 255;
    let B = parseInt(hex.substring(5, 7), 16) / 255;

    let min = Math.min(R, G, B);
    let max = Math.max(R, G, B);
    let delta = max - min;

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      switch (max) {
        case R: h = (G - B) / delta + (G < B ? 6 : 0); break;
        case G: h = (B - R) / delta + 2; break;
        case B: h = (R - G) / delta + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const updateTheme = (color) => {
    setPrimaryColor(color);
    const darkColor = adjustColor(color, -20);
    const lightColor = adjustColor(color, 25);
    const secondaryColor = adjustColor(color, 15);
    const secondaryDark = adjustColor(secondaryColor, -15);
    const secondaryLight = adjustColor(secondaryColor, 25);
    const rgbValues = hexToRgb(color);

    // Calculate background and card variables dynamically from Hue and Saturation
    const hsl = hexToHsl(color);
    const bgLight = `hsl(${hsl.h}, ${Math.round(hsl.s * 0.15)}%, 98%)`;
    const bgDark = `hsl(${hsl.h}, ${Math.round(hsl.s * 0.1)}%, 7%)`;
    const cardLight = '#FFFFFF';
    const cardDark = `hsl(${hsl.h}, ${Math.round(hsl.s * 0.1)}%, 11%)`;

    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--color-primary-dark', darkColor);
    document.documentElement.style.setProperty('--color-primary-light', lightColor);
    document.documentElement.style.setProperty('--color-primary-rgb', rgbValues);
    document.documentElement.style.setProperty('--color-secondary', secondaryColor);
    document.documentElement.style.setProperty('--color-secondary-dark', secondaryDark);
    document.documentElement.style.setProperty('--color-secondary-light', secondaryLight);
    document.documentElement.style.setProperty('--color-bg-light', bgLight);
    document.documentElement.style.setProperty('--color-bg-dark', bgDark);
    document.documentElement.style.setProperty('--color-card-light', cardLight);
    document.documentElement.style.setProperty('--color-card-dark', cardDark);

    localStorage.setItem('admin-custom-color', color);
  };

  useEffect(() => {
    const savedColor = localStorage.getItem('admin-custom-color') || '#B97A56';
    updateTheme(savedColor);

    return () => {
      // Reset variables on logout / unmount
      document.documentElement.style.removeProperty('--color-primary');
      document.documentElement.style.removeProperty('--color-primary-dark');
      document.documentElement.style.removeProperty('--color-primary-light');
      document.documentElement.style.removeProperty('--color-primary-rgb');
      document.documentElement.style.removeProperty('--color-secondary');
      document.documentElement.style.removeProperty('--color-secondary-dark');
      document.documentElement.style.removeProperty('--color-secondary-light');
      document.documentElement.style.removeProperty('--color-bg-light');
      document.documentElement.style.removeProperty('--color-bg-dark');
      document.documentElement.style.removeProperty('--color-card-light');
      document.documentElement.style.removeProperty('--color-card-dark');
    };
  }, []);

  const handleReset = () => {
    updateTheme('#B97A56');
    localStorage.removeItem('admin-custom-color');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating customize panel */}
      {isOpen && (
        <div className="mb-4 w-72 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-5 shadow-premium glass-card transition-all duration-300">
          <div className="flex items-center justify-between mb-4 border-b border-brandBorder-light dark:border-brandBorder-dark pb-2.5">
            <h4 className="text-sm font-bold font-poppins text-brandText-light dark:text-brandText-dark flex items-center gap-1.5">
              <FaPalette className="text-primary" /> Brand Theme Customizer
            </h4>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-brandText-light"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Color Presets Grid */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark block mb-2 font-inter">
                Preset Schemes
              </span>
              <div className="grid grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => updateTheme(preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`h-7 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer ${
                      primaryColor === preset.hex 
                        ? 'border-brandText-light dark:border-brandText-dark scale-105 shadow-sm' 
                        : 'border-transparent'
                    }`}
                    title={preset.name}
                  >
                    {primaryColor === preset.hex && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Selector */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark block mb-2 font-inter">
                Custom Color Picker
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => updateTheme(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-brandBorder-light dark:border-brandBorder-dark bg-transparent"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-brandText-light dark:text-brandText-dark uppercase">
                    {primaryColor}
                  </span>
                  <span className="text-[10px] text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                    Click to pick custom color
                  </span>
                </div>
              </div>
            </div>

            {/* Reset option */}
            <button
              onClick={handleReset}
              className="w-full py-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-brandText-light dark:text-brandText-dark rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FaUndo className="text-[10px]" /> Reset to Default Theme
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-premium cursor-pointer transition-all duration-300 active:scale-95 group"
        title="Customize Theme Color"
      >
        <FaCog className="h-5 w-5 animate-spin-slow group-hover:rotate-45 transition-transform duration-500 text-brandText-dark" />
      </button>
    </div>
  );
};

export default ThemeCustomizer;
