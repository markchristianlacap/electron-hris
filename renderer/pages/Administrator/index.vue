<script>
export default {
  asyncData({ app }) {
    const employees = app.db.get("employees").value()
    const bday = employees.filter(row => row.birthDate)
    console.log(bday)
    return { employees }
  },
  data() {
    return {
      activities: [
        {
          content: "Custom icon",
          timestamp: "2018-04-12 20:46",
          size: "large",
          type: "primary",
          icon: "el-icon-more",
        },
        {
          content: "Custom color",
          timestamp: "2018-04-03 20:46",
          color: "#0bbd87",
        },
        {
          content: "Custom size",
          timestamp: "2018-04-03 20:46",
          size: "large",
        },
        {
          content: "Default node",
          timestamp: "2018-04-03 20:46",
        },
      ],
    }
  },
}
</script>
<template>
  <div class="container">
    <h2 class="text-primary">
      Dashboard
    </h2>
    <el-divider></el-divider>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card>
          <h2 class="text-primary">
            Employees
          </h2>
          <h3>{{ employees.length }}</h3>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <h2 class="text-primary">
            Applicants
          </h2>
          <h3>150</h3>
        </el-card>
      </el-col>
    </el-row>
    <br />
    <el-row type="flex">
      <el-col :span="11">
        <el-card>
          <h2> Upcoming Birthdays 🎈🎈</h2>
          <br />
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
