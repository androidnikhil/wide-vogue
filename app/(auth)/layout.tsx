
  export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        {children}
      </div>
    );
  }