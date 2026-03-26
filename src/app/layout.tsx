import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { ToastifyContainer } from "@/components/ToastifyContainer";

export const metadata: Metadata = {
  title: {
    default: "The Blog",
    template: "%s | The Blog",
  },
  description: "Blog criado com next para aprendizado e treinamento!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Container>
          <Header />

          {children}

          <Footer />
        </Container>

        <ToastifyContainer />
      </body>
    </html>
  );
}
