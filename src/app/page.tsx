import HomeComponent from '@/components/home';

export default function Home() {
  const initialTimeLeft = '00:00:00';
  return <HomeComponent initialTimeLeft={initialTimeLeft} />;
}
