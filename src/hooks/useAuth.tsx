import React from 'react';

type AuthContextType = ReturnType<typeof useProvideAuth>;

type PropsType = {
  children?: React.ReactNode;
};

type UserType = {
  imgUrl: string;
  id: string;
  fullName: string;
  lastName: string;
  firstName: string;
  email: string;
};

const authContext = React.createContext({} as AuthContextType);

export function ProvideAuth({ children }: PropsType): JSX.Element {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return React.useContext(authContext);
}

const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
const DISCOVERY_URLS = [
  'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
];

export function useInitClient() {
  const [initialized, setInitialized] = React.useState<boolean>(false);

  /**
   * Load the API's client and auth2 modules.
   * Initialize Client for first load
   */
  React.useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: process.env.REACT_APP_GG_API_KEY,
          clientId: process.env.REACT_APP_GG_CLIENT_ID,
          discoveryDocs: DISCOVERY_URLS,
          scope: SCOPE,
        })
        .then(function () {
          setInitialized(true);
        });
    });
  }, []);

  return { initialized };
}

export const isLogin = () => {
  const GoogleAuth = gapi.auth2.getAuthInstance();
  const user = GoogleAuth.currentUser.get();
  const isAuthorized = user.hasGrantedScopes(SCOPE);
  return isAuthorized ? true : false;
};

function useProvideAuth() {
  const [user, setUser] = React.useState<UserType | null>(null);
  const GoogleAuth = React.useRef(gapi.auth2.getAuthInstance());

  /**
   * Handle initial sign-in state.
   * Determine if user is already signed in.
   */
  React.useEffect(() => {
    updateSignInStatus();
  }, []);

  /**
   * Listen for sign-in states changes.
   */
  const updateSignInStatus = () => {
    const user = GoogleAuth.current.currentUser.get();

    if (isLogin()) {
      const userProfile = user.getBasicProfile();
      const newUser = {
        imgUrl: userProfile.getImageUrl(),
        id: userProfile.getId(),
        fullName: userProfile.getName(),
        lastName: userProfile.getFamilyName(),
        firstName: userProfile.getGivenName(),
        email: userProfile.getEmail(),
      };
      setUser(newUser);
    } else {
      setUser(null);
    }
  };

  const signIn = () => GoogleAuth.current.signIn().then(updateSignInStatus);
  const signOut = () => GoogleAuth.current.signOut().then(updateSignInStatus);
  const revokeAccess = () =>
    GoogleAuth.current.disconnect().then(updateSignInStatus);

  return {
    user,
    signIn,
    signOut,
    revokeAccess,
  };
}
