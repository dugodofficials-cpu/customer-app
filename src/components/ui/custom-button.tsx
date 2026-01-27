import { Button, ButtonProps, Typography, TypographyProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  backgroundColor?: string;
  textColor?: string;
  textProps?: Partial<TypographyProps>;
}

export default function PrimaryButton({
  children,
  backgroundColor = '#0B6201', // Default green color from the album component
  textColor = '#FFF', // Default white color
  textProps,
  sx,
  ...rest
}: CustomButtonProps) {
  return (
    <Button
      sx={{
        display: 'flex',
        padding: '0.75rem',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.625rem',
        alignSelf: 'stretch',
        borderRadius: '0.5rem',
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