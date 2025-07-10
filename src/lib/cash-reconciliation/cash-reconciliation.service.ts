import { CashReconciliationPreviewResponse, CashReconciliationRequest, CashReconciliationResponse } from "@/types/cash-reconciliation";
import httpExternalApi from "../common/http.external.service";

class ConcilationAPI {
  previewConciliation = async (params: URLSearchParams, token: string): Promise<CashReconciliationPreviewResponse> => httpExternalApi.httpGet(`/cash_reconciliations/preview`, params, token);
  createConciliation = async (body: CashReconciliationRequest, token: string): Promise<CashReconciliationResponse> => httpExternalApi.httpPost(`/cash_reconciliations`, 'POST', body, token);
  approveConciliation = async (params: URLSearchParams, token: string): Promise<CashReconciliationResponse> => httpExternalApi.httpPost(`/cash_reconciliations/${params.get('id')}/approve`, 'PATCH', undefined, token);
}

const conciliationAPI = new ConcilationAPI();
export default conciliationAPI;
