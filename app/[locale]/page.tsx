import Home from "../page";

type Props = {
  params: Promise<{ locale: string }>;
};

// 🔹 Oper parameter locale ke halaman utama asli
export default async function LocaleHomePage({ params }: Props) {
  return <Home params={params} />;
}