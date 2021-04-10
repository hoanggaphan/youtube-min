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

function initClient(updateSignInStatus: () => void) {
  const discoveryUrls = [
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
  ];

  gapi.client
    .init({
      apiKey: process.env.NEXT_PUBLIC_GG_API_KEY,
      clientId: process.env.NEXT_PUBLIC_GG_CLIENT_ID,
      discoveryDocs: discoveryUrls,
      scope: SCOPE,
    })
    .then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in states changes.
      GoogleAuth.isSignedIn.listen(updateSignInStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      updateSignInStatus();
    });
}

function useProvideAuth() {
  // null is initial state _ true is sign-in _ false is sign-out.
  const [isSignedIn, setIsSignedIn] = React.useState<boolean | null>(null);

  // save user profile
  const [user, setUser] = React.useState<UserType | null>(null);


  /**
   * Load the API's client and auth2 modules.
   * Call the initClient function after the modules load.
   */
  React.useEffect(() => {
    gapi.load('client:auth2', () => initClient(updateSignInStatus));
  }, []);


  /**
   * Listener called when user completes auth flow.
   */
  const updateSignInStatus = () => {
    const user = GoogleAuth.currentUser.get();

    if (user.isSignedIn()) {
      setIsSignedIn(true);

      const userProfile = user.getBasicProfile();
      const newUser = {
        imgUrl: userProfile.EI,
        id: userProfile.ER,
        fullName: userProfile.Te,
        lastName: userProfile.kR,
        firstName: userProfile.oT,
        email: userProfile.zt,
      };
      setUser(newUser);
    } else {
      setIsSignedIn(false);
    }
  };


  const signIn = () => GoogleAuth.signIn();
  const signOut = () => GoogleAuth.signOut();
  const revokeAccess = () => GoogleAuth.disconnect();
  
  return {
    user,
    isSignedIn,
    signIn,
    signOut,
    revokeAccess,
  };
}
