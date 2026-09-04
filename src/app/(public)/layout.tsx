import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/layout/ChatWidget";
import { CartProvider } from "@/components/cart/CartProvider";
import { getSiteSettings } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <CartProvider>
      <Header settings={settings} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
      <ChatWidget />
    </CartProvider>
  );
}
