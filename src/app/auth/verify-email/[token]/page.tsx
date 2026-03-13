import { redirect } from 'next/navigation';

export default async function VerifyEmailTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  redirect(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}
