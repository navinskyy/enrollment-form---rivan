import './globals.css';

export const metadata = {
  title: 'RivanCyber Training Institute Inc. – Enrollment Form',
  description: 'Student enrollment form for RivanCyber Training Institute Inc.',
  icons: { icon: '/logo.png' },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=Source+Sans+3:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
