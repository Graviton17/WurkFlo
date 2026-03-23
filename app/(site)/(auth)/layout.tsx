export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-page flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="auth-orb auth-orb-left" />
        <div className="auth-orb auth-orb-right" />
        <div className="auth-orb auth-orb-center" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {children}
      </div>
    </div>
  );
}
