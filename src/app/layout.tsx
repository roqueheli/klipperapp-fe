import Footer from "@/components/footer/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import ToasterProvider from "@/components/ui/ToasterProvider";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-black dark:bg-gray-900 dark:text-white transition-colors`}
      >
        <ThemeProvider>
          <div className="w-full flex flex-col justify-center items-center">
            {children}
            <Footer />
          </div>
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
