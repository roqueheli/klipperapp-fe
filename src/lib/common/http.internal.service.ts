import { HttpBaseAPI } from "./http.service";

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

class HttpInternalAPI extends HttpBaseAPI {
    constructor() {
        super(API_URL)
    }
}

const httpInternalApi = new HttpInternalAPI();
export default httpInternalApi;