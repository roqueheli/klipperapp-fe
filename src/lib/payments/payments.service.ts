import { CalculatePaymentResponse } from "@/types/calculate";
import { Payment } from "@/types/payments";
import httpExternalApi from "../common/http.external.service";

class PaymentsAPI {
    createPayment = async (body: Payment, token: string): Promise<Payment[]> => httpExternalApi.httpPost(`/payments`, 'POST', body, token);
    resendPayment = async (body: Payment, token: string): Promise<Payment[]> => httpExternalApi.httpPost(`/payments/${body.id}/resend`, 'PATCH', undefined, token);
    approvePayment = async (body: Payment, token: string): Promise<Payment[]> => httpExternalApi.httpPost(`/payments/${body.id}/approve`, 'PATCH', undefined, token);
    rejectPayment = async (body: Payment, token: string): Promise<Payment[]> => httpExternalApi.httpPost(`/payments/${body.id}/reject`, 'PATCH', undefined, token);
    geyPayments = async (params: URLSearchParams, token: string): Promise<Payment[]> => httpExternalApi.httpGet(`/payments`, params, token);
    calculatePayments = async (params: URLSearchParams, token: string): Promise<CalculatePaymentResponse> => httpExternalApi.httpGet(`/users/calculate_payment`, params, token);
}

const paymentsAPI = new PaymentsAPI();
export default paymentsAPI;