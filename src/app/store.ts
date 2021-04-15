import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import subscriptionReducer from 'features/Subscription/subscriptionSlice';

export const store = configureStore({
  reducer: {
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
