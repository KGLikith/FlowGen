import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProviderApollo from "@/components/provider/ApolloProvider";
import { ThemeProvider } from "@/components/provider/theme-provider";
import QueryClientProvider from "@/components/provider/ClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowGen",
  description: "Automate it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ProviderApollo>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <QueryClientProvider>
                {children}
                {/* <Toaster /> */}
              </QueryClientProvider>
            </ThemeProvider>
          </ProviderApollo>
        </body>
      </html>
    </ClerkProvider>
  );
}
