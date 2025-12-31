import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = authClient.useSession();

  const redirecting = ref(false);
  const loading = computed(() => session.value.isPending || session.value.isRefetching || redirecting.value);
  const user = computed(() => session.value.data?.user);

  const signInWithGithub = async () => {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    redirecting.value = true;
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
        fetchOptions: {
          headers,
        },
      });
    }
    catch {
      redirecting.value = false;
    }
  };

  const signOut = async () => {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await authClient.signOut({
      fetchOptions: {
        headers,
      },
    });
    navigateTo("/");
  };

  return {
    user,
    loading,
    signInWithGithub,
    signOut,
  };
});
