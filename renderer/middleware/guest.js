export default function ({ store, redirect, app }) {
  if (store.state.user.username) return redirect("/administrator")
  let user = localStorage.getItem("user")
  if (!user) return
  const { username, expiration } = JSON.parse(atob(user))
  if (expiration < Date.now()) return localStorage.removeItem("users")
  const res = app.db.get("users").find({ username }).value()
  if (!res) return localStorage.removeItem("users")
  redirect("/administrator")
}
