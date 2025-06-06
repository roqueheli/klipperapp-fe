import { HttpBaseAPI } from "./http.service";

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100/api/v1";
class HttpExternalAPI extends HttpBaseAPI {
    constructor() {
        super(API_URL)
    }
}

const httpExternalApi = new HttpExternalAPI();
export default httpExternalApi;