import useAuthStore from "../store/auth-store";
import { API_BASE_URL } from "./constants-types";

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(token: string | null) {
    this.baseUrl = API_BASE_URL;
    this.token = token;
  }

  async register(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    return data;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    this.token = data.token;
    return data;
  }


  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed with status ${response.status}`);
    }
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed with status ${response.status}`);
    }
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed with status ${response.status}`);
    }
    return response.json();
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed with status ${response.status}`);
    }
    return response.json();
  }
}

const apiClient = new ApiClient(useAuthStore.getState().token);
export default apiClient;