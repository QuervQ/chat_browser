export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>Supabase Realtime Room</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
