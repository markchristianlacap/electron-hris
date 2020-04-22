<script>
const { maximize } = require("electron").remote.getCurrentWindow()
import { genSaltSync, hashSync, compareSync } from "bcryptjs"
export default {
  layout: "empty",
  data: () => ({
    user: {},
    status: {
      info: "Please input your valid credentials.",
    },
    loading: false,
  }),
  asyncData({ app }) {
    const salt = genSaltSync(10)
    const username = "admin"
    const password = hashSync("admin", salt)
    app.db.set("users[0]", { username, password }).write()
  },
  methods: {
    async login({ username = "", password = "" }) {
      try {
        this.loading = true
        this.status = {}
        const user = this.$db.get("users").find({ username }).value()
        if (!user) {
          this.status.error = "Username not found."
          return
        }
        const checkPassword = compareSync(password, user.password)
        if (!checkPassword) return (this.status.error = "Invalid Credentials.")
        this.status.success = `
        Successfully log in. Redirecting ...
        <i class="fas fa-spinner fa-spin"></i>
        `
        delete user.password
        user.expiration = Date.now() + 86400000
        const encriptedUser = btoa(JSON.stringify(user))
        localStorage.setItem("user", encriptedUser)
        this.$store.commit("setUser", user)
        setTimeout(() => {
          this.$router.push("/administrator")
          maximize()
        }, 2000)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<template>
  <div class="container">
    <el-card shadow="always">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content">
            <img src="~assets/img/authentication.svg" alt="Authentication" />
          </div>
        </el-col>
        <el-col :span="12"
          ><div class="grid-content">
            <form @submit.prevent="login(user)">
              <h3>Login Form</h3>
              <div class="status" :class="status.success ? 'success' : status.error ? 'error' : ''">
                <span v-html="status.error || status.success || status.info" />
              </div>
              <div class="form-field">
                <label for="username">Username:</label>
                <el-input v-model="user.username" placeholder="Enter your username" />
              </div>
              <div class="form-field">
                <label for="password">Password:</label>
                <el-input v-model="user.password" placeholder="Enter your password" show-password />
              </div>
              <div class="form-field">
                <el-button type="primary" :loading="loading" native-type="submit">Submit</el-button>
              </div>
            </form>
          </div></el-col
        >
      </el-row>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
}
.el-card {
  max-width: 650px;
}
img {
  width: 100%;
  max-width: 300px;
  height: 100%;
}
h3 {
  margin: 0;
  color: $dark;
  font-weight: 500;
  padding: 0;
}
.status {
  opacity: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
  transition: all 500ms ease;
  font-size: 0.9em;
  opacity: 1;
  padding: 0.5em;
  margin: 0.5em 0;
}
.error {
  background: lighten($warning, 15%);
  color: $danger;
}
.success {
  background: lighten($secondary, 20%);
  color: darken($secondary, 20%);
}
.form-field {
  margin: 1em 0;
  label {
    display: block;
    margin-bottom: 0.5em;
  }
}
</style>
