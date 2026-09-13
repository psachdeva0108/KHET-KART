import { createTheme } from '@mui/material/styles'

// Tokens extracted from the Claude Design HTML prototype (see
// docs/superpowers/specs/2026-09-06-react-rebuild-design.md).
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#04773b',
      dark: '#005a20',
      // Reference uses a third, even darker green specifically for headings
      // and the logo wordmark — kept as a non-standard palette key rather
      // than overloading `dark`, which the reference uses for interactive
      // (outlined button / link) text and borders instead.
      darker: '#053e1d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dd7b2b',
    },
    background: {
      default: '#fbf8f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#222c24',
      secondary: '#636c61',
    },
    divider: '#e0e2db',
  },
  shape: {
    borderRadius: 9,
  },
  // Reference site's main content column measures 1100px wide (not MUI's
  // default 1200px "lg") — shifting the lg breakpoint value here means every
  // `Container maxWidth="lg"` in the app matches it without per-page tweaks.
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1100, xl: 1536 },
  },
  typography: {
    fontFamily: '"Karla", sans-serif',
    // Every heading in the reference — hero, section titles, dialog/page
    // titles — uses a dark green by default, not just specific ones, so it
    // belongs on the variant itself rather than as sx overrides scattered
    // across pages. h1 (the homepage hero only) uses a fourth, even darker
    // shade (#003313) than every other heading level (#053e1d).
    h1: { fontFamily: '"Sora", sans-serif', fontWeight: 800, color: '#003313' },
    h2: { fontFamily: '"Sora", sans-serif', fontWeight: 800, color: '#053e1d' },
    h3: { fontFamily: '"Sora", sans-serif', fontWeight: 800, color: '#053e1d' },
    h4: { fontFamily: '"Sora", sans-serif', fontWeight: 700, color: '#053e1d' },
    h5: { fontFamily: '"Sora", sans-serif', fontWeight: 700, color: '#053e1d' },
    h6: { fontFamily: '"Sora", sans-serif', fontWeight: 700, color: '#053e1d' },
    button: { fontWeight: 700, textTransform: 'none', lineHeight: 1.2 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: 'none' },
        containedPrimary: {
          '&:hover': { boxShadow: 'none' },
        },
        outlined: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px' } },
        // Reference's outlined button uses a solid full-opacity border in
        // `primary.main` but a darker `primary.dark` text color — two
        // different shades, not MUI's default of one alpha-blended color.
        outlinedPrimary: ({ theme }) => ({
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.dark,
          '&:hover': { borderColor: theme.palette.primary.main, backgroundColor: 'rgba(4,119,59,0.04)' },
        }),
        sizeMedium: { padding: '9px 18px' },
        sizeLarge: { padding: '13px 26px', fontSize: '15px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          border: '1px solid #e0e2db',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 9, fontWeight: 700 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: '#e0e2db' },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
  },
})
