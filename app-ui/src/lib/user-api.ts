import { apiRequest } from "./api-client";
import { UserEntity } from "./types";

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<UserEntity> {
  const response = await apiRequest<UserEntity>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return response;
}
