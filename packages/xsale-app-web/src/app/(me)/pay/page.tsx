import { WechatPay } from "./_components/wechat-pay";

export async function generateMetadata() {
  return {
    title: `微信支付`
  };
}

export default async function Page({ searchParams }: { searchParams: { orderId: string; title: string; amount: string } }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="container my-4 lg:my-20">
        <WechatPay orderId={searchParams.orderId} title={searchParams.title} amount={searchParams.amount} />
      </main>
    </div>
  );
}
