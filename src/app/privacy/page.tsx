import { Box, Typography } from '@mui/material';

export default function PrivacyPolicy() {
  return (
    <Box sx={{ p: 8, minHeight: '100vh', color: '#fff' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Privacy Policy
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          1. Information We Collect
        </Typography>
        <Typography paragraph>
          We collect information you provide directly to us, including name, email address, payment
          information, and other details you share when using our services. We also automatically
          collect certain information about your device and how you interact with our platform.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          2. How We Use Your Information
        </Typography>
        <Typography paragraph>
          We use the information we collect to provide, maintain, and improve our services, process
          your transactions, communicate with you, and personalize your experience. We may also use
          your information to detect and prevent fraud or abuse of our services.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          3. Information Sharing
        </Typography>
        <Typography paragraph>
          We do not sell your personal information. We may share your information with third-party
          service providers who assist us in operating our platform, processing payments, and
          analyzing our services. These providers are bound by confidentiality obligations.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          4. Data Security
        </Typography>
        <Typography paragraph>
          We implement appropriate technical and organizational measures to protect your personal
          information. However, no method of transmission over the Internet is 100% secure, and we
          cannot guarantee absolute security.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          5. Your Rights
        </Typography>
        <Typography paragraph>
          You have the right to access, correct, or delete your personal information. You may also
          have the right to restrict or object to certain processing of your information. Contact us
          to exercise these rights.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          6. Cookies and Tracking
        </Typography>
        <Typography paragraph>
          We use cookies and similar tracking technologies to collect information about how you
          interact with our services. You can control cookie settings through your browser
          preferences.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          7. Children&apos;s Privacy
        </Typography>
        <Typography paragraph>
          Our services are not intended for children under 13. We do not knowingly collect personal
          information from children under 13. If you believe we have collected information from a
          child under 13, please contact us.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          8. Changes to Privacy Policy
        </Typography>
        <Typography paragraph>
          We may update this privacy policy from time to time. We will notify you of any material
          changes by posting the updated policy on our platform or via email.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          9. Contact Us
        </Typography>
        <Typography paragraph>
          If you have any questions about this Privacy Policy, please contact us at
          privacy@dugodofficial.com.
        </Typography>
      </Box>
    </Box>
  );
}
