import { HttpBaseAPI } from "./http.service";

export const API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_BASE_URL : "http://localhost:3000/api";
class HttpExternalAPI extends HttpBaseAPI {
    constructor() {
        super(API_URL || "http://localhost:3000/api")
    }
}

const httpExternalApi = new HttpExternalAPI();
export default httpExternalApi;