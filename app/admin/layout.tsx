export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Replaced <html> and <body> with a wrapper div
    <div className="bg-gray-50 min-h-screen text-gray-900 antialiased">
      {children}
    </div>
  );
}