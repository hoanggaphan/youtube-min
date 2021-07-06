import CssBaseline from '@material-ui/core/CssBaseline';
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import Snackbar from 'components/Snackbar';
import React from 'react';
import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';
import App from './App';
import * as serviceWorker from './serviceWorker';
import SWRDevtools from '@jjordy/swr-devtools';
import { cache, mutate } from 'swr';
import ProvideGlobal from 'hooks/useGlobal';

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        img: {
          display: 'inline-block',
          maxWidth: '100%',
        },
        body: {
          overflowX: 'hidden',
          overflowY: 'scroll',
          backgroundColor: '#f9f9f9',
        },
        '::-webkit-scrollbar': {
          width: '16px',
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '10px',
          backgroundClip: 'padding-box',
          border: '4px solid transparent',
          '&:hover': {
            background: '#ccc',
            borderRadius: '10px',
            backgroundClip: 'padding-box',
            border: '4px solid transparent',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1070, // 960 change to 1070
      lg: 1280,
      xl: 1920,
    },
  },
});

const swrConfigs = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
};

ReactDOM.render(
  <React.StrictMode>
    <ProvideGlobal>
      <SWRConfig value={swrConfigs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Snackbar>
            <SWRDevtools cache={cache} mutate={mutate} />
            <App />
          </Snackbar>
        </ThemeProvider>
      </SWRConfig>
    </ProvideGlobal>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
