import { Box, Typography } from '@mui/material';

export default function TermsOfService() {
  return (
    <Box sx={{ p: 8, minHeight: '100vh', color: '#fff' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Terms of Service
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          1. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By accessing and using Dugod&apos;s services, including our website, music streaming
          platform, merchandise store, and game features, you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use our services.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          2. User Accounts
        </Typography>
        <Typography paragraph>
          You must create an account to access certain features of our services. You are responsible
          for maintaining the confidentiality of your account information and for all activities
          that occur under your account.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          3. Content and Services
        </Typography>
        <Typography paragraph>
          Our services provide access to music, merchandise, and interactive game content. All
          content available through our services is protected by copyright and other intellectual
          property rights.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          4. Purchase and Payment Terms
        </Typography>
        <Typography paragraph>
          When making purchases through our platform, you agree to provide accurate payment
          information and authorize us to charge your chosen payment method for the amount of your
          purchase, including any applicable taxes and fees.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          5. Prohibited Activities
        </Typography>
        <Typography paragraph>
          Users are prohibited from engaging in any unlawful activities, including but not limited
          to unauthorized copying or distribution of content, harassment of other users, or
          attempting to gain unauthorized access to our systems.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          6. Termination
        </Typography>
        <Typography paragraph>
          We reserve the right to terminate or suspend your account and access to our services at
          our discretion, particularly in cases of violation of these terms or suspected fraudulent
          activity.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          7. Changes to Terms
        </Typography>
        <Typography paragraph>
          We may modify these terms at any time. We will notify users of any material changes
          through our platform or via email. Your continued use of our services after such
          modifications constitutes acceptance of the updated terms.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          8. Contact Information
        </Typography>
        <Typography paragraph>
          If you have any questions about these Terms of Service, please contact us at
          support@dugodofficial.com.
        </Typography>
      </Box>
    </Box>
  );
}
