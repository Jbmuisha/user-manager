export type UserRole = "intern" | "developer" | "it_system_admin";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};
