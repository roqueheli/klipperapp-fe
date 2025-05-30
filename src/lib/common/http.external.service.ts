import { HttpBaseAPI } from "./http.service";

export const API_URL = "http://localhost:3100/api";

class HttpExternalAPI extends HttpBaseAPI {
    constructor() {
        super(API_URL)
    }
}

const httpExternalApi = new HttpExternalAPI();
export default httpExternalApi;