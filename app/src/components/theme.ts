'use client';
import { Noto_Serif_JP } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { jaJP } from '@mui/material/locale'; // Import Japanese locale

const notoSerifJp = Noto_Serif_JP({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fdfdfd', // Off-white
      paper: '#ffffff',
    },
    primary: {
      main: '#6d4c41', // Sepia-like brown
    },
    secondary: {
      main: '#a1887f', // Lighter brown
    },
    text: {
      primary: '#4e342e',
      secondary: '#795548',
    },
  },
  typography: {
    fontFamily: notoSerifJp.style.fontFamily,
    h5: {
      color: '#5d4037'
    },
    h6: {
      color: '#5d4037'
    }
  },
}, jaJP); // Pass Japanese locale to createTheme

export default theme;
