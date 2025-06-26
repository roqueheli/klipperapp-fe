import { AttendancesProvider } from "@/contexts/AttendancesContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AttendancesProvider>{children}</AttendancesProvider>;
}
