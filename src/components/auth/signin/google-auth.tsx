import { useGoogleSignUp } from '@/hooks/auth';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { enqueueSnackbar } from 'notistack';
import { Box } from '@mui/material';

export default function GoogleAuth() {
  const googleSignUpMutation = useGoogleSignUp();

  const googleLogin = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      enqueueSnackbar('We could not sign you in with Google', { variant: 'error' });
      return;
    }

    googleSignUpMutation.mutate({ token: credentialResponse.credential });
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexBasis: '100%' }}>
      <GoogleLogin
        onSuccess={googleLogin}
        useOneTap={true}
        auto_select={false}
        context="use"
        ux_mode="popup"
        logo_alignment="left"
        theme="filled_black"
        text="signin_with"
        width="100%"
        size="large"
        nonce={''}
        login_uri={`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`}
        onError={() => enqueueSnackbar('Login Failed', { variant: 'error' })}
      />
    </Box>
  );
}
