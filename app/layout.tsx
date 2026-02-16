import type { Metadata, Viewport } from "next";
import { Inter, DM_Mono } from "next/font/google";
import { AmplifyProvider } from "./AmplifyProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const dmMono = DM_Mono({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono" 
});

export const metadata: Metadata = {
  title: "Skylar Eade - Software Engineer",
  description: "Portfolio of Skylar Eade - Software Engineer specializing in quantitative finance and machine learning",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${dmMono.variable}`} style={{ margin: 0, padding: 0 }}>
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
