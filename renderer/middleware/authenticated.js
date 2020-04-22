export default function ({ store, redirect, app }) {
  /* Function to remove user and redirect */
  const unauthenticated = () => {
    localStorage.removeItem("user")
    store.commit("setUser", {})
    redirect("/")
  }
  if (store.state.user.username) return
  let user = localStorage.getItem("user")
  if (!user) return unauthenticated()
  user = JSON.parse(atob(user))
  const { username, expiration } = user
  if (expiration < Date.now()) return unauthenticated()
  const res = app.db.get("users").find({ username }).value()
  if (!res) return unauthenticated()
  store.commit("setUser", res)
}
