import {
    CashReconciliationPreviewResponse,
    CashReconciliationRequestPayload,
    CashReconciliationResponse,
} from "@/types/cash-reconciliation";
import { format } from "date-fns";
import httpInternalApi from "../common/http.internal.service";

const BASE_URL = "/till-check"; // Ajusta esto si tu endpoint real es distinto

// 🔍 Obtener datos de cierre de caja por fecha
export async function getTillCheckData(
    date: Date
): Promise<{
    data: {
        total_cash: number;
        total_bank: number;
        total_pos: number;
        notes?: string;
    } | null;
    form: {
        cash: number;
        bank: number;
        pos: number;
        notes?: string;
    };
    id: string | null;
}> {
    const formattedDate = format(date, "yyyy-MM-dd");

    try {
        const response = await httpInternalApi.httpGetPublic<CashReconciliationPreviewResponse>(
            `${BASE_URL}?date=${formattedDate}`
        );
        // Estructura asumida desde el backend
        const entry = response;

        return {
            data: {
                total_cash: Number(entry.expected_cash_from_sales),
                total_bank: entry.expected_transfer_from_sales,
                total_pos: entry.expected_pos_from_sales,
            },
            form: {
                cash: Number(entry.expected_total_cash_on_hand),
                bank: entry.expected_total_transfer_balance,
                pos: entry.expected_total_pos_balance,
            },
            id: entry.opening_reconciliation_id ? String(entry.opening_reconciliation_id) : null,
        };
    } catch (error) {
        // Si no hay registro para esa fecha
        return {
            data: null,
            form: {
                cash: 0,
                bank: 0,
                pos: 0,
                notes: "",
            },
            id: null,
        };
    }
}

// 💾 Guardar nuevo cierre de caja
export async function saveTillCheck(
    date: Date,
    formData: { cash: number; bank: number; pos: number; notes: string }
): Promise<CashReconciliationResponse> {
    const formattedDate = format(date, "yyyy-MM-dd");

    const payload: CashReconciliationRequestPayload = {
        reconciliation_type: "opening", // Assuming save is always opening
        cash_amount: formData.cash,
        bank_balances: [
            { account_name: "pos", balance: formData.pos },
            { account_name: "transfer", balance: formData.bank },
        ],
        notes: formData.notes,
        reconciliation_date: formattedDate,
    };

    const response = await httpInternalApi.httpPostPublic<CashReconciliationResponse>(
        BASE_URL,
        "POST",
        { cash_reconciliation: payload }
    );
    return response;
}

// 🛠️ Actualizar cierre de caja existente
export async function updateTillCheck(
    id: string,
    formData: { cash: number; bank: number; pos: number; notes: string }
): Promise<CashReconciliationResponse> {
    const payload: CashReconciliationRequestPayload = {
        reconciliation_type: "closing", // Assuming update is always closing
        cash_amount: formData.cash,
        bank_balances: [
            { account_name: "pos", balance: formData.pos },
            { account_name: "transfer", balance: formData.bank },
        ],
        notes: formData.notes,
    };

    const response = await httpInternalApi.httpPostPublic<CashReconciliationResponse>(
        `${BASE_URL}/${id}`,
        "PATCH", // Assuming PATCH for update
        { cash_reconciliation: payload }
    );
    return response;
}