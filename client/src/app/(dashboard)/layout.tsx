import { Navbar } from '../../components/layout/Navbar';

// Shared chrome for every authenticated route - the middleware already
// guarantees a valid token got here, so this layout is just the shell.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
