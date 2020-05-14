<script>
import moment from "moment"
const calculateAge = birthday => {
  const ageDifMs = Date.now() - new Date(birthday).getTime()
  return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970)
}
export default {
  asyncData({ app }) {
    const employees = app.db
      .get("employees")
      .sortBy(obj => new moment(obj.birthDate.date))
      .reverse()
      .value()
    const trainings = app.db
      .get("trainings")
      .sortBy(obj => new moment(obj.from.date))
      .reverse()
      .value()
    const applicants = app.db.get("applicants").value()
    return { employees, trainings, applicants }
  },
  data() {
    return {
      data: calculateAge("12/12/1996"),
      series: [
        {
          data: [
            {
              x: "Code",
              y: [new Date("2019-03-02").getTime(), new Date("2019-03-04").getTime()],
            },
            {
              x: "Test",
              y: [new Date("2019-03-04").getTime(), new Date("2019-03-08").getTime()],
            },
            {
              x: "Validation",
              y: [new Date("2019-03-08").getTime(), new Date("2019-03-12").getTime()],
            },
            {
              x: "Deployment",
              y: [new Date("2019-03-12").getTime(), new Date("2019-03-18").getTime()],
            },
          ],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "rangeBar",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        xaxis: {
          type: "datetime",
        },
      },
      pieOptions: {
        labels: ["Math", "English", "Science", "Filipino", "TLE", "AP", "MAPEH", "ESP"],
      },
    }
  },
  computed: {
    pie() {
      const deparments = ["Math", "English", "Science", "Filipino", "TLE", "AP", "MAPEH", "ESP"]
      const pie = []
      deparments.forEach(deparment => {
        let count = 0
        this.employees.forEach(emp => {
          if (emp.department === deparment) count++
        })
        pie.push(count)
      })
      return pie
    },
    birthdays() {
      const employees = this.employees.filter(
        ({ birthDate }) => moment(birthDate).month() === moment().month()
      )

      return employees.map(({ name, birthDate }) => {
        return {
          name: `${name.last}, ${name.first} ${name.middle} ${name.suffix || null}`,
          birthDate,
        }
      })
    },
    trainingChart() {
      let trainings = this.trainings.slice(0, 10)
      trainings = trainings.map(data => ({
        x: data.title,
        y: [new Date(data.from).getTime(), new Date(data.to).getTime()],
      }))
      return [{ data: trainings }]
    },
  },
  methods: {},
}
</script>
<template>
  <div class="container">
    <p class="text-light header">Dashboard</p>
    <el-divider></el-divider>
    <el-row :gutter="5">
      <el-col :sm="8" :md="6">
        <div class="card-dashboard">
          <div class="background-primary">
            <div class="count">{{ employees.length }}</div>
          </div>
          <div class="content">
            Employees
          </div>
        </div>
      </el-col>
      <el-col :sm="8" :md="6">
        <div class="card-dashboard">
          <div class="background-primary">
            <div class="count">{{ applicants.length }}</div>
          </div>
          <div class="content">
            Applicants
          </div>
        </div>
      </el-col>
      <el-col :sm="8" :md="6">
        <div class="card-dashboard">
          <div class="background-primary">
            <div class="count">{{ trainings.length }}</div>
          </div>
          <div class="content">
            Trainings
          </div>
        </div>
      </el-col>
      <el-col :sm="8" :md="6">
        <div class="card-dashboard">
          <div class="background-primary">
            <div class="count">1</div>
          </div>
          <div class="content">
            Account
          </div>
        </div>
      </el-col>
    </el-row>
    <br />
    <el-card>
      <el-row>
        <el-col :md="12">
          Employees training timeline
          <apexchart
            type="rangeBar"
            height="350"
            :options="chartOptions"
            :series="trainingChart"
          ></apexchart>
        </el-col>
        <el-col :md="12">
          Employees per Department
          <apexchart type="pie" :width="500" :options="pieOptions" :series="pie"></apexchart>
        </el-col>
        <el-col :md="12">
          <p>
            Birthdays this month
          </p>
          <br />
          <p v-if="!birthdays.length">No birthday for this month </p>
          <el-timeline>
            <el-timeline-item
              v-for="({ name, birthDate }, index) in birthdays"
              :key="index"
              type="primary"
              :timestamp="birthDate"
            >
              {{ name }}
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.card-dashboard {
  display: grid;
  grid-template-columns: 1fr 3fr;
  background: #fff;
  margin-bottom: 0.3em;
  .count,
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .count {
    padding: 1em;
    font-size: 1.5em;
    color: #fff;
    background: $primary;
  }
  .content {
    font-size: 1.2em;
    color: #555;
  }
}
</style>
