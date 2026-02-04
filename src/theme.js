import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    // Your brand colors
    primary: {
      main: '#ff8c42', // Your orange
      light: '#ffb074',
      dark: '#e67828',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2d2d2d', // Your dark color
      light: '#545454',
      dark: '#1a1a1a',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc3545',
    },
    warning: {
      main: '#ffc107',
    },
    info: {
      main: '#0dcaf0',
    },
    success: {
      main: '#198754',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#2d2d2d',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.8rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  spacing: 8, // Keep MUI's 8px spacing system
  shape: {
    borderRadius: 8, // Slightly rounded corners
  },
  components: {
    // Optimize MUI components to work alongside Bootstrap
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          padding: '8px 16px',
          // Ensure buttons don't conflict with Bootstrap
          border: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Prevent Bootstrap button styles from affecting icon buttons
          border: 'none !important',
          padding: '8px',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          // Override Bootstrap container padding
          paddingLeft: '16px !important',
          paddingRight: '16px !important',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // Ensure paper components work well with Bootstrap
          boxSizing: 'border-box',
        },
      },
    },
  },
});

export default theme;
