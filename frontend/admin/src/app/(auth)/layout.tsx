export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-1 text-[0.7rem] font-bold tracking-[0.16em] text-gold-primary uppercase">
            Charte Graphique
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink">
            KHADMATONA <em className="text-gold-primary not-italic">Group</em>
          </h1>
        </div>
        <div className="rounded-lg border border-border bg-surface p-8 shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
}
