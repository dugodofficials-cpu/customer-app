import { ROUTES } from '@/util/paths';
import { Box, Button, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SupportDialog from '@/components/ui/support-dialog';

export default function About() {
  const router = useRouter();
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);

  return (
    <Box
      sx={{
        maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '1440px' },
        margin: '0 auto',
      }}
    >
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '33rem',
              borderRadius: '0.75rem',
              overflow: 'hidden',
            }}
          >
            <Image
              src={'/assets/aboutNew.jpg'}
              alt="About"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <Typography
            sx={{
              color: '#FFF',
              fontFamily: 'ClashDisplay-Bold',
              fontSize: '1.25rem',
              fontStyle: 'normal',
              fontWeight: 700,
            }}
          >
            Meet DuGod
          </Typography>

          <Typography
            sx={{
              color: '#C4C4C4',
              fontSize: '1.25rem',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '120%',
            }}
          >
            From Lagos streets to your speakers.
            <br />
            DuGod blends Hip-Hop and raw storytelling with unmatched spirit.
          </Typography>
          <Box
            sx={{
              position: 'relative',
              padding: { xs: '1rem', md: '1rem' },
              backgroundColor: 'rgba(42, 195, 24, 0.05)',
              borderRadius: '0.5rem',
              marginTop: '.5rem',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: { xs: '-0.5rem', md: '-0.75rem' },
                top: { xs: '-0.25rem', md: '-0.5rem' },
                fontSize: { xs: '3rem', md: '4rem' },
                color: '#2AC318',
                fontFamily: 'serif',
                lineHeight: 1,
                opacity: 0.3,
                pointerEvents: 'none',
              }}
            >
              &ldquo;
            </Box>
            <Typography
              component="blockquote"
              sx={{
                color: '#E0E0E0',
                fontFamily: 'Manrope',
                fontSize: { xs: '1rem', md: '1rem' },
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: '1.8',
                margin: 0,
                position: 'relative',
              }}
            >
              If all the wisdom of the sages of our time were to be condensed into a single requiem,
              this would be it. DuGod&apos;s brand of hyper conscious rap fuses deep African poetry
              with fiery political commentary. His rhythmic fusion is a whirlwind of genres, stories
              and melodies that tell the tale of a kingdom that once was, a kingdom that shall soon
              rise.
              <br />
              <br />
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  color: '#2AC318',
                  marginTop: '1rem',
                }}
              >
                It&apos;s your musical miracle.
              </Box>
            </Typography>
            <Typography
              sx={{
                color: '#C4C4C4',
                fontFamily: 'Manrope',
                fontSize: '0.875rem',
                fontStyle: 'normal',
                fontWeight: 500,
                marginTop: '1.5rem',
                textAlign: 'right',
                letterSpacing: '0.05em',
              }}
            >
              — KUKOYI
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '1.8rem',
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                padding: '0.75rem 0.5rem',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.25rem',
                borderRadius: '0.25rem',
                border: '0.4px solid #2AC318',
                background: '#0C0C0C',
              }}
            >
              <Typography
                sx={{
                  color: '#FFF',
                  textAlign: 'center',
                  fontFamily: 'Manrope',
                  fontSize: '0.75rem',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '120%',
                }}
              >
                💬 &quot;His sound is therapy with rhythm.&quot;{' '}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                padding: '0.75rem 0.5rem',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.25rem',
                borderRadius: '0.25rem',
                border: '0.4px solid #2AC318',
                background: '#0C0C0C',
              }}
            >
              <Typography
                sx={{
                  color: '#FFF',
                  textAlign: 'center',
                  fontFamily: 'Manrope',
                  fontSize: '0.75rem',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '120%',
                }}
              >
                📀 2+ albums released
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              onClick={() => router.push(ROUTES.MUSIC)}
              sx={{
                display: 'flex',
                padding: '0.75rem',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.625rem',
                borderRadius: '2rem',
                background: '#0B6201',
                width: '10.5rem',
                boxShadow: '0px 4px 24px 0px rgba(42, 195, 24, 0.32)',
              }}
            >
              <Typography
                sx={{
                  color: '#FFF',
                  textAlign: 'center',
                  fontFamily: 'Manrope',
                  fontSize: '0.8125rem',
                  fontStyle: 'normal',
                  fontWeight: 800,
                  lineHeight: '120%',
                }}
              >
                EXPLORE MUSIC
              </Typography>
            </Button>
            <Button
              onClick={() => setIsSupportDialogOpen(true)}
              sx={{
                display: 'flex',
                padding: '0.75rem',
                paddingInline: '1.5rem',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.625rem',
                borderRadius: '2rem',
                background: '#0B6201',
                boxShadow: '0px 4px 24px 0px rgba(42, 195, 24, 0.32)',
              }}
            >
              <Typography
                sx={{
                  color: '#FFF',
                  textAlign: 'center',
                  fontFamily: 'Manrope',
                  fontSize: '0.8125rem',
                  fontStyle: 'normal',
                  fontWeight: 800,
                  lineHeight: '120%',
                }}
              >
                SUPPORT THE MOVEMENT
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>

      <SupportDialog open={isSupportDialogOpen} onClose={() => setIsSupportDialogOpen(false)} />
    </Box>
  );
}
