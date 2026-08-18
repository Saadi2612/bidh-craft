import React from "react";

export const metadata = {
  title: "THEBIDHCRAFT CMS",
  description: "Content management for thebidhcraft.com",
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
