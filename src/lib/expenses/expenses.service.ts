import { Expenses } from "@/types/expenses";
import httpExternalApi from "../common/http.external.service";

class ExpensesAPI {
    getExpenses = async (params: URLSearchParams, token: string): Promise<Expenses[]> => httpExternalApi.httpGet(`/expenses`, params, token);
    createExpenses = async (body: Expenses, token: string): Promise<Expenses[]> => httpExternalApi.httpPost(`/expenses`, "POST", body, token);
    updateExpenses = async (body: Expenses, token: string): Promise<Expenses[]> => httpExternalApi.httpPost(`/expenses/${body.id}`, "PUT", body, token);
    deleteExpenses = async (body: Expenses, token: string): Promise<Expenses[]> => httpExternalApi.httpPost(`/expenses/${body.id}`, "DELETE", undefined, token);
}

const expensesAPI = new ExpensesAPI();
export default expensesAPI;