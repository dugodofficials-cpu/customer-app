import { Button, ButtonProps, Typography, TypographyProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  backgroundColor?: string;
  textColor?: string;
  textProps?: Partial<TypographyProps>;
}

export default function RoundedButton({
  children,
  backgroundColor = '#fff',
  textColor = '#0C0C0C',
  textProps,
  sx,
  ...rest
}: CustomButtonProps) {
  return (
    <Button
      sx={{
        display: 'flex',
        height: '3rem',
        padding: '0.75rem',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '1.5rem',
        background: backgroundColor,
        '&:hover': {
          background: backgroundColor, // Maintain color on hover
          opacity: 0.9, // Add slight opacity change on hover
        },
        ...sx,
      }}
      {...rest}
    >
      <Typography
        sx={{
          color: textColor,
          fontFamily: 'Manrope',
          fontSize: '0.75rem',
          fontStyle: 'normal',
          fontWeight: 400,
          ...textProps?.sx,
        }}
        {...textProps}
      >
        {children}
      </Typography>
    </Button>
  );
} 