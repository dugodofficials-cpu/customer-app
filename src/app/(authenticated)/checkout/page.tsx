'use client';

import Footer from '@/components/layout/footer';
import CartReview from '@/components/protected/checkout/cart-review';
import OrderConfirmation from '@/components/protected/checkout/order-confirmation';
import PaymentMethod from '@/components/protected/checkout/payment-method';
import { Box, Container, Step, StepLabel, Stepper } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const steps = ['Cart Review', 'Payment Method', 'Confirmation'];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const params = useSearchParams();

  useEffect(() => {
    if (!params.get('orderId')) {
      setActiveStep(0);
    }
  }, [params]);

  const handleNext = (step?: number) => {
    if (step !== undefined) {
      setActiveStep(step);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = (step?: number) => {
    if (step !== undefined) {
      setActiveStep(step);
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <CartReview onNext={(step) => handleNext(step)} />;
      case 1:
        return <PaymentMethod onNext={(step) => handleNext(step)} onBack={(step) => handleBack(step)} />;
      case 2:
        return <OrderConfirmation />;
      default:
        return <CartReview onNext={(step) => handleNext(step)} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        backgroundColor: '#000',
        paddingY: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            width: '100%',
            marginBottom: 6,
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: '#7B7B7B',
                fontFamily: 'Satoshi',
                '&.Mui-active': {
                  color: '#fff',
                },
                '&.Mui-completed': {
                  color: '#0B6201',
                },
              },
              '& .MuiStepIcon-root': {
                color: '#333',
                '&.Mui-active': {
                  color: '#fff',
                },
                '&.Mui-completed': {
                  color: '#0B6201',
                },
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {renderStep()}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 4,
          }}
        >
          <Footer />
        </Box>
      </Container>
    </Box>
  );
}
