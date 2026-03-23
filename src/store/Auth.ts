import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
    reputation: number;
}

interface IAuthStore {
    session: Models.Session | null;
    jwt: string | null;
    user: Models.User<UserPrefs> | null;
    hydrated: boolean;

    sethydrated(): void;
    verifySession(): Promise<void>;
    login(email: string, password: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
    createAccount(name: string, email: string, password: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
    logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            sethydrated() {
                set({ hydrated: true });
            },

            async verifySession() {
                try {
                    const session = await account.getSession("current");
                    set({ session });
                } catch (error) {
                    console.log(error);
                }
            },

            async login(email: string, password: string) {
                try {
                    try {
                        const currentSession = await account.getSession("current");
                        try {
                            const [user, { jwt }] = await Promise.all([
                                account.get<UserPrefs>(),
                                account.createJWT(),
                            ]);
                            set({ session: currentSession, user, jwt });
                            return { success: true };
                        } catch (_userError) {
                            await account.deleteSession("current");
                        }
                    } catch (_sessionError) {
                        // No active session, continue with login
                    }

                    const session = await account.createEmailPasswordSession(email, password);
                    const [user, { jwt }] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT(),
                    ]);

                    if (!user.prefs?.reputation) {
                        await account.updatePrefs<UserPrefs>({ reputation: 0 });
                    }

                    set({ session, user, jwt });
                    return { success: true };
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null,
                    };
                }
            },

            async createAccount(name: string, email: string, password: string) {
                try {
                    await account.create(ID.unique(), email, password, name);
                    return { success: true };
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null,
                    };
                }
            },

            async logout() {
                try {
                    await account.deleteSessions();
                } catch (error) {
                    // Session may already be expired — non-fatal
                    console.error("Logout error (non-fatal):", error);
                } finally {
                    // Always clear local state no matter what
                    set({ session: null, jwt: null, user: null });
                }
            },
        })),
        {
            name: "auth",
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error && state) state.sethydrated();
                };
            },
        }
    )
);