import { HttpBaseAPI } from "./http.service";

export const API_URL = process.env.NODE_ENV === 'production' ? "https://klipperapp-be-6fbfe24ddcb3.herokuapp.com/api/v1" : (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api");
class HttpExternalAPI extends HttpBaseAPI {
    constructor() {
        super(API_URL)
    }
}

const httpExternalApi = new HttpExternalAPI();
export default httpExternalApi;