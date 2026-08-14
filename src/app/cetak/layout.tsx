// @ts-ignore: allow side-effect CSS import without type declarations
import "../globals.css";

export const metadata = {
  title: 'Cetak Kertas Kerja',
  description: 'Halaman Cetak Website Kertas Kerja',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
