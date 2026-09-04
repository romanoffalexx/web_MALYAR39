import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/layout/ChatWidget";
import { CartProvider } from "@/components/cart/CartProvider";
import { getSiteSettings, getTopCategories } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getTopCategories(),
  ]);

  return (
    <CartProvider>
      <Header settings={settings} categories={categories} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} categories={categories} />
      <ChatWidget />
    </CartProvider>
  );
}
