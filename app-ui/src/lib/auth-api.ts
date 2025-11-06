let currentUserStatus: "guest" | "user" = "guest";

const simulateDelay = (ms = 50) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export type AuthStatus = "loading" | "guest" | "user";

export async function signInUser(): Promise<"user"> {
  await simulateDelay();
  currentUserStatus = "user";
  return currentUserStatus;
}

export async function signOutUser(): Promise<"guest"> {
  await simulateDelay();
  currentUserStatus = "guest";
  return currentUserStatus;
}

export async function getCurrentAuthStatus(): Promise<"guest" | "user"> {
  await simulateDelay();
  return currentUserStatus;
}
