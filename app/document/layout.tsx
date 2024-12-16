import HeaderForm from "@/components/Document/HeaderForm";
import { Spinner } from "@nextui-org/react";
import React, { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <div className="overflow-auto h-screenDevice p-app flex flex-col">
      <Suspense
        fallback={
          <div
            className={`absolute inset-0 bg-backdrop flex items-center justify-center`}
          >
            <Spinner />
          </div>
        }
      >
        <div className={``}>
          <HeaderForm />
        </div>
      </Suspense>
      <div className={`mt-app flex-1 flex flex-col`}>
        {children}
      </div>
    </div>
  );
}
