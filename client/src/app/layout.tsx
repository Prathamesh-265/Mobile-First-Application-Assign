import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "../providers/QueryProvider";
import { SmoothScrollProvider } from "../components/layout/SmoothScrollProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Task Manager",
  description:
    "A focused task manager with weather-aware, location-tagged tasks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <QueryProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#161522",
                color: "#fff",
                border: "1px solid #2c2a3d",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
