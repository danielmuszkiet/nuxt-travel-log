import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const loading = ref(false);
  const redirecting = ref(false);

  const signInWithGithub = async () => {
    loading.value = true;
    redirecting.value = false;

    try {
      // start social login (performs a redirect)
      redirecting.value = true;
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });
    }
    catch (err) {
      console.error("Login fehlgeschlagen", err);
      redirecting.value = false;
    }
    finally {
      // If no redirect occurs, reset
      if (!redirecting.value)
        loading.value = false;
    }
  };

  return {
    loading,
    signInWithGithub,
  };
});
