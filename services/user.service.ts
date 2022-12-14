import { createClient } from "@hexabase/hexabase-js";
import { useUser } from "~/store/user";
import { useRuntimeConfig } from "#imports";
import { useRouter } from "#imports";

async function login(email: string, password: string) {
  let user = {} as any;
  const hexabase = await createClient({
    url: useRuntimeConfig().public.baseUrl,
    token: "",
    email,
    password,
  });
  const { token, error } = await hexabase.auth.login({ email, password });
  console.log(token);
  if (token && !error) {
    const { userInfo } = await hexabase.user.get(token);
    if (userInfo && !error) {
      user = userInfo;
      user.token = token;
    }
    localStorage.setItem("user", JSON.stringify(user));
  }
  return token;
}

async function logout() {
  const token = JSON.parse(localStorage.getItem("user")!).token;
  const url = useRuntimeConfig().public.baseUrl;
  const hexabase = await createClient({ url, token });
  await hexabase.auth.logout(token);
  localStorage.removeItem("user");
  useUser().removeAuth();
  const router = useRouter();
  router.push("/auth/login");
}

function register() {
  return { user: "nguyen" };
}

export const userService = {
  login,
  logout,
  register,
};
