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

let GoogleAuth: any;
const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
const DISCOVERY_URLS = [
  'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
];

function useProvideAuth() {
  // initializing state when app is loading module
  const [initialized, setInitialized] = React.useState<boolean>(false);

  // save user profile
  const [user, setUser] = React.useState<UserType | null>(null);

  /**
   * Load the API's client and auth2 modules.
   * Call the initClient function after the modules load.
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

          GoogleAuth = gapi.auth2.getAuthInstance();

          // Listen for sign-in states changes.
          GoogleAuth.isSignedIn.listen(updateSignInStatus);

          // Handle initial sign-in state. (Determine if user is already signed in.)
          updateSignInStatus();
        });
    });
  }, []);

  /**
   * Listener called when user completes auth flow.
   */
  const updateSignInStatus = () => {
    const user = GoogleAuth.currentUser.get();
    const isAuthorized = user.hasGrantedScopes(SCOPE);

    if (isAuthorized) {
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

  const signIn = () => GoogleAuth.signIn();
  const signOut = () => GoogleAuth.signOut();
  const revokeAccess = () => GoogleAuth.disconnect();

  return {
    initialized,
    user,
    signIn,
    signOut,
    revokeAccess,
  };
}
