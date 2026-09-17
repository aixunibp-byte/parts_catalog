import { createTheme } from '@mui/material/styles';

// Nike-inspired theme: high-contrast, minimal, bold uppercase headings.
const baseTypography = {
  fontFamily: [
    '"Helvetica Neue"',
    'Helvetica',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    lineHeight: 1.02,
  },
  h2: {
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    fontSize: 'clamp(1.75rem, 4vw, 3rem)',
    lineHeight: 1.05,
  },
  h3: {
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: '1.05rem',
  },
  button: {
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  body1: {
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
};

export function getTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#FFFFFF' : '#111111',
        contrastText: isDark ? '#111111' : '#FFFFFF',
      },
      secondary: {
        main: '#FF4400',
      },
      background: {
        default: isDark ? '#111111' : '#FFFFFF',
        paper: isDark ? '#1A1A1A' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#FFFFFF' : '#111111',
        secondary: isDark ? '#B0B0B0' : '#707072',
      },
      divider: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(17,17,17,0.08)',
    },
    shape: {
      borderRadius: 0,
    },
    typography: baseTypography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            padding: '12px 28px',
            boxShadow: 'none',
          },
          contained: {
            '&:hover': {
              boxShadow: 'none',
              opacity: 0.85,
            },
          },
          outlined: {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: 'none',
            backgroundColor: 'transparent',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.7rem',
          },
        },
      },
    },
  });
}
