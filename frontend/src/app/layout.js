export const metadata = {
  title: 'Sales Manager',
  description: 'Mini Sales App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
