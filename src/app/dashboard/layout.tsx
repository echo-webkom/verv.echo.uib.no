type LayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: LayoutProps) {
  return <main className="mx-auto w-full max-w-6xl space-y-8 px-6">{children}</main>;
}
