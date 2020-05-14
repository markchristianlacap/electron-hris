<script>
import { genSaltSync, hashSync, compareSync } from "bcryptjs"
const { parse, stringify } = JSON
export default {
  asyncData({ store }) {
    const user = parse(stringify(store.state.user))
    return { user }
  },
  data: () => ({
    rules: {
      username: [{ required: true, message: "Username is required" }],
      old_password: [{ required: true, message: "Old Password is required" }],
      new_password: [{ required: true, message: "New Password is required" }],
      confirm_password: [{ required: true, message: "Password Confirmation is required" }],
    },
  }),
  methods: {
    onSubmit({ username, old_password, new_password, confirm_password, password }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        if (!compareSync(old_password, password))
          return this.$message.error("Old password is incorrect.")
        if (new_password !== confirm_password)
          return this.$message.error("Password does not match.")
        const salt = genSaltSync(10)
        const data = { password: hashSync(new_password, salt) }
        const user = this.$db.get("user").find({ username }).assign(data).write()
        this.$message.success("Successfully updated")
        this.user = parse(stringify(user))
      })
    },
  },
}
</script>
<template>
  <div class="container">
    <p class="text-light header">Account Settings</p>
    <el-divider> </el-divider>
    <el-row type="flex" justify="center" style="margin: 1em 0;">
      <el-col :span="15">
        <el-card style="margin: 0 1em;">
          <p>
            Update your account credentials
          </p>
          <br />
          <el-form ref="form" :model="user" label-width="160px" :rules="rules">
            <el-form-item label="Username" prop="username">
              <el-input v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item label="Old Password" prop="old_password">
              <el-input
                v-model="user.old_password"
                placeholder="Input your old password"
              ></el-input>
            </el-form-item>
            <el-form-item label="New Password" prop="new_password">
              <el-input
                v-model="user.new_password"
                placeholder="Input your New password"
              ></el-input>
            </el-form-item>
            <el-form-item label="Confirm Password" prop="confirm_password">
              <el-input v-model="user.confirm_password" placeholder="Confirm password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit(user)">Save</el-button>
              <el-button @click="user = {}">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
