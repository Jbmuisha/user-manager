import api from "./api";
import { User, UserRole } from "../types/user";


export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}
const isCorsError = (error: any): boolean => {
  const message = error?.message?.toString() || "";
  return (
    message.includes("CORS") ||
    message.includes("Access-Control-Allow-Origin") ||
    error?.response?.headers?.get?.("content-type") === null ||
    (error.code === "ERR_NETWORK" && !error.response)
  );
};

const handleResponse = <T>(res: any): T => {
  if (res.status >= 200 && res.status < 300) {
    return res.data;
  }
  throw new ApiError(res.status, res.data?.message || "Request failed");
};


export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get("/users");
    return handleResponse<User[]>(res);
  } catch (error: any) {
    if (isCorsError(error)) {
      throw new ApiError(0, "Backend CORS not configured. Contact backend developer to add 'Access-Control-Allow-Origin: http://localhost:3000' header.");
    }
    if (error.response) {
      const status = error.response;
      const message = error.response.data?.message || "Failed to fetch users";
      throw new ApiError(status, message);
    }
    if (error.code === "ECONNABORTED") {
      throw new ApiError(0, "Request timeout - server is not responding");
    }
    throw new ApiError(0, "Cannot connect to server. Check if backend is running at http://35.178.111.40:8000");
  }
};


export const getUser = async (id: number): Promise<User> => {
  try {
    const res = await api.get(`/users/${id}`);
    return handleResponse<User>(res);
  } catch (error: any) {
    if (isCorsError(error)) {
      throw new ApiError(0, "Backend CORS not configured. Contact backend developer to add CORS headers.");
    }
    if (error.response) {
      const status = error.response;
      const message = error.response.data?.message || "User not found";
      throw new ApiError(status, message);
    }
    throw new ApiError(0, "Cannot connect to server");
  }
};


export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const res = await api.get(`/users?search=${encodeURIComponent(query)}`);
    return handleResponse<User[]>(res);
  } catch (error: any) {
    if (isCorsError(error)) {
      throw new ApiError(0, "Backend CORS not configured");
    }
    throw new ApiError(0, "Search failed");
  }
};

export const createUser = async (data: {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  is_active?: boolean;
}): Promise<User> => {
  try {
    const res = await api.post("/users", data);
    return handleResponse(res);
  } catch (error: any) {
    if (isCorsError(error)) {
      throw new ApiError(0, "Backend CORS not configured. Contact backend developer to add CORS headers.");
    }
    if (error.response) {
      const status = error.response;
      const message = error.response.data?.message || "Failed to create user";
      throw new ApiError(status, message);
    }
    throw new ApiError(0, "Cannot connect to server");
  }
};


export const updateUser = async (
  id: number,
  data: Partial<User>
): Promise<User> => {
  try {
    const res = await api.patch(`/users/${id}`, data);
    return handleResponse<User>(res);
  } catch (error: any) {
    if (isCorsError(error)) {
      throw new ApiError(0, "Backend CORS not configured. Contact backend developer to add CORS headers.");
    }
    if (error.response) {
      const status = error.response;
      const message = error.response.data?.message || "Failed to update user";
      throw new ApiError(status, message);
    }
    throw new ApiError(0, "Cannot connect to server");
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    const res = await api.delete(`/users/${id}`);
    if (res.status !== 200) {
      throw new ApiError(res.status, "Delete failed");
    }
  } catch (error: any) {
    if (isCorsError(error)) {
      throw new ApiError(0, "Backend CORS not configured. Contact backend developer to add CORS headers.");
    }
    if (error.response) {
      const status = error.response;
      const message = error.response.data?.message || "Failed to delete user";
      throw new ApiError(status, message);
    }
    throw new ApiError(0, "Cannot connect to server");
  }
};
