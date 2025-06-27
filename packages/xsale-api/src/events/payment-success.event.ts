export class PaymentSuccessEvent {
  constructor(
    public readonly outTradeNo: string,
    public readonly transactionId: string,
    public readonly amount: number,
    public readonly openid: string,
  ) {}
}
