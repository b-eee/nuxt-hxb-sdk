import { createClient } from "@hexabase/hexabase-js";
import { useUserStore } from "~/stores/user";
import { useRouter } from "nuxt/app";
import { BehaviorSubject } from "rxjs";
import { useHexabaseClient } from "~/stores/hexabaseToken";

const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user"))
);
export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
  register,
};

async function login(baseUrl, email, password) {
  // const hexabaseStore = useHexabaseClient();
  let user = {};
  const hexabase = await createClient({
    url: baseUrl,
    token: user.token,
    email,
    password,
  });
  const { token, error } = await hexabase.auth.login({ email, password });
  // hexabaseStore.setToken(token)
  if (token && !error) {
    const { userInfo, error } = await hexabase.auth.get(token);
    if (!error) {
      user = userInfo;
    }
    user.token = token;
    userSubject.next(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
}

async function logout() {
  localStorage.removeItem("user");
  userSubject.next(null);
  const user = useUserStore();
  user.removeAuth();
  const router = useRouter();
  await router.push("/auth/login");
}

function register(user) {
  return { user: "nguyen" };
}
