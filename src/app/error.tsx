"use client";

import ErrorMessage from "@/components/ErrorMessage";

export default function RootErrorPage() {
  return (
    <ErrorMessage
      pageTitle="Internal Server Error"
      contentTitle="501"
      content="Erro 501 - Algum erro inesperado acontece. Tente novamente mais tarde!"
    />
  );
}
