"use client";

import { revalidateAction } from "@/actions/revalidate";

export function ExampleRevalidate() {
  return (
    <div>
      <button onClick={() => revalidateAction()}>REVALIDATE HOME</button>
    </div>
  );
}
