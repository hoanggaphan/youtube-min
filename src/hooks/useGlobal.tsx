import React from 'react';

type State = {
  alert: {
    home: boolean;
    results: boolean;
  };
};

const initialState: State = {
  alert: {
    home: true,
    results: true,
  },
};

type Action = { type: 'TOGGLE_ALERT_HOME' } | { type: 'TOGGLE_ALERT_RESULTS' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_ALERT_HOME': {
      const alert = { ...state.alert, home: !state.alert.home };
      return { ...state, alert };
    }
    case 'TOGGLE_ALERT_RESULTS': {
      const alert = { ...state.alert, results: !state.alert.results };
      return { ...state, alert };
    }
    default:
      return state;
  }
}

type Context = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export const globalContext = React.createContext<Context>({
  state: initialState,
  dispatch: () => undefined,
});

export default function ProvideGlobal({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <globalContext.Provider value={{ state, dispatch }}>
      {children}
    </globalContext.Provider>
  );
}
