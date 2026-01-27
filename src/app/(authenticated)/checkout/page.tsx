'use client';

import Footer from '@/components/layout/footer';
import CartReview from '@/components/protected/checkout/cart-review';
import OrderConfirmation from '@/components/protected/checkout/order-confirmation';
import PaymentMethod from '@/components/protected/checkout/payment-method';
import ShippingDetails from '@/components/protected/checkout/shipping-details';
import { useCart } from '@/hooks/cart';
import { ProductType } from '@/lib/api/products';
import { Box, Container, Step, StepLabel, Stepper } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const steps = ['Cart Review', 'Shipping Details', 'Payment Method', 'Confirmation'];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [hasPhysicalItems, setHasPhysicalItems] = useState(false);
  const { data: cartItems } = useCart();

  useEffect(() => {
    if (cartItems?.data.items.some((item) => item.product.type === ProductType.PHYSICAL)) {
      setHasPhysicalItems(true);
    }
  }, [cartItems]);
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
        return <CartReview onNext={(step) => handleNext(step)} hasPhysicalItems={hasPhysicalItems} />;
      case 1:
        return <ShippingDetails onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <PaymentMethod onNext={(step) => handleNext(step)} onBack={(step) => handleBack(step)} hasPhysicalItems={hasPhysicalItems} />;
      case 3:
        return <OrderConfirmation />;
      default:
        return <CartReview onNext={(step) => handleNext(step)} hasPhysicalItems={hasPhysicalItems} />;
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
