import CssBaseline from '@material-ui/core/CssBaseline';
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import * as serviceWorker from './serviceWorker';
import { SWRConfig } from 'swr';

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        img: {
          display: 'block',
        },

        body: {
          overflowX: 'hidden',
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
    <Provider store={store}>
      <SWRConfig value={swrConfigs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </SWRConfig>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
