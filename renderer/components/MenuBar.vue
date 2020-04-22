<script>
const { reload, close, toggleDevTools } = require("electron").remote.getCurrentWindow()
export default {
  data: () => ({
    links: [
      {
        label: "Dashboard",
        to: "/administrator",
      },
      { label: "Employees", to: "/employees" },
      { label: "Applicants", to: "/applicants" },
      { label: "Trainings", to: "/trainings" },
      { label: "Reports", to: "/reports" },
    ],
  }),
  created() {},
  methods: {
    close: () => close(),
    reload: () => reload(),
    devTool: () => toggleDevTools(),
    async logout() {
      try {
        await this.$confirm("Are you sure you want to logout?", "Warning", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
        this.$store.commit("setUser", {})
        this.$router.push("/")
        localStorage.removeItem("user")
      } catch (error) {
        this.$message({
          showClose: true,
          message: "Stay in the current route",
          type: "success",
        })
      }
    },
  },
}
</script>
<template>
  <div class="menu-bar">
    <ul class="menu-bar-left">
      <nuxt-link v-for="(link, i) in links" :key="i" :to="link.to" tag="li">{{
        link.label
      }}</nuxt-link>
      <li class="dropdown">
        Help
        <ul class="dropdown-item">
          <nuxt-link to="/about" tag="li">About</nuxt-link>
          <li @click="reload">Reload</li>
          <li @click="devTool">Open Dev Tools</li>
          <li @click="close">Exit</li>
        </ul>
      </li>
    </ul>
    <ul class="menu-bar-right">
      <li class="dropdown">
        {{ $store.state.user.username }}
        <ul class="dropdown-item">
          <nuxt-link to="/user/settings" tag="li">
            <i class="fas fa-cog fa-fw"></i>
            Settings
          </nuxt-link>
          <li @click="logout()">
            <i class="fas fa-power-off fa-fw" />
            Logout
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.menu-bar {
  padding: 0 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: darken($dark, 2%);
  font-size: 12px;
}

.menu-bar-right .dropdown .dropdown-item {
  margin-left: -10em;
}
.menu-bar-left,
.menu-bar-right {
  display: flex;
  li {
    padding: 0.8em;
    color: #fefefe;
    position: relative;
    white-space: nowrap;
  }
  li.dropdown::after {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    margin-left: 0.3em;
    content: "\f0d7";
  }
  li.dropdown .dropdown-item {
    min-width: 200px;
    user-select: none;
    position: absolute;
    margin-top: 10px;
    box-shadow: 0 0 10px #000;
    transition: all 500ms ease-in-out;
    background: darken($dark, 6%);
    overflow: hidden;
    z-index: -1;
    max-height: 0;
    li:first-of-type {
      border-top: none !important;
    }
    li {
      border-top: 1px solid #555;
    }
  }
  li.dropdown:hover .dropdown-item {
    max-height: 1000px;
    z-index: 999;
  }
  li:hover {
    background: $dark;
    cursor: pointer;
  }
}
</style>
