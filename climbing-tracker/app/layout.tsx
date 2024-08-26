// climbing-tracker/app/layout.tsx
import './globals.css';
import { AuthProvider } from './lib/AuthContext'; // Import your AuthProvider

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children} {/* This will provide access to the auth state */}
        </AuthProvider>
      </body>
    </html>
  );
}
