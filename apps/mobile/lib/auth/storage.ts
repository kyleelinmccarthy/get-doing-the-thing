import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "api_token";
const USER_KEY = "user_data";

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export interface StoredUser {
  id: string;
  email: string;
}

export async function getUser(): Promise<StoredUser | null> {
  const data = await SecureStore.getItemAsync(USER_KEY);
  if (!data) return null;
  return JSON.parse(data) as StoredUser;
}

export async function setUser(user: StoredUser): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}
