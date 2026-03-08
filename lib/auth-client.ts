import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	// baseURL: "/api/auth", // matches the mounted route
});

// helper exports
export const { signIn, signUp, signOut, getSession, useSession } = authClient;
