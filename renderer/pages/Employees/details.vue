<script>
import pds from "~/assets/templates/pds-template.xlsx"
import XlsxTemplate from "xlsx-template"
import moment from "moment"
import fs from "fs"
const { dialog } = require("electron").remote
export default {
  asyncData({ app, query }) {
    const id = query.id
    const data = app.db.get("employees").find({ id }).value()
    return { data }
  },
  data: () => ({
    fields: [
      {
        label: "Complete name",
        serialize: ({ last, first, middle, suffix }) => `${last}, ${first} ${middle} ${suffix}`,
        col: "name",
      },
      {
        label: "Date of Birth",
        serialize: date => moment(date).format("dddd, MMM Do, YYYY"),
        col: "birthDate",
      },
      {
        label: "Place of Birth",
        col: "birthPlace",
      },
      {
        label: "Sex",
        col: "sex",
      },
      {
        label: "Residential Address",
        col: "residential",
        serialize: data => Object.values(data).toString(),
      },
      {
        label: "Permanent Address",
        col: "permanent",
        serialize: data => Object.values(data).toString(),
      },
      {
        label: "Height",
        serialize: data => `${data} cm`,
        col: "height",
      },
      {
        label: "Weight",
        serialize: data => `${data} kg`,
        col: "weight",
      },
      {
        label: "Blood Type",
        col: "bloodType",
      },
      {
        label: "Civil Status",
        col: "civilStatus",
      },
      {
        label: "Citizenship",
        col: "citizenship",
      },
      {
        label: "Email",
        col: "email",
      },
      {
        label: "Telephone",
        col: "telNo",
      },
      {
        label: "Mobile No.",
        col: "mobileNo",
      },
      {
        label: "GSIS",
        col: "gsis",
      },
      {
        label: "PAG-IBIG",
        col: "pagIbig",
      },
      {
        label: "PHILHEALTH",
        col: "philHealth",
      },
      {
        label: "SSS No.",
        col: "sss",
      },
      {
        label: "Tin No.",
        col: "tin",
      },
      {
        label: "Employee No.",
        col: "employeeNo",
      },
    ],
    schoolFields: [
      { model: "name", placeholder: "Name of School", span: "250" },
      { model: "degree", placeholder: "BASIC EDUCATION/DEGREE/COURSE ", span: "235" },
      { model: "earned", placeholder: "Highest Level/Units Earned", span: "200" },
      { model: "from", placeholder: "from", type: "date", span: "80" },
      { model: "to", placeholder: "to", type: "date", span: "80" },
      { model: "graduated", placeholder: "Graduated", span: "90" },
      { model: "scholarship", placeholder: "Scholarship/Academic Honors Received", span: "300" },
    ],
  }),
  computed: {
    education() {
      const levels = ["elementary", "secondary", "vocational", "college", "graduate"]
      const education = []
      for (const level of levels) {
        const row = this.data[level]
        row.level = level.toUpperCase()
        education.push(row)
      }
      return education
    },
  },
  methods: {
    exportToPDS() {
      this.data.dateNow = moment(Date.now()).format("dddd, MMM Do, YYYY")
      const template = new XlsxTemplate(pds)
      const sheetNumber = 1
      template.substitute(sheetNumber, this.data)
      const data = template.generate({ type: "nodebuffer" })
      const defaultPath = `Personal Data Sheet - ${this.data.name.last} ${this.data.name.first}`
      const path = dialog.showSaveDialogSync({
        defaultPath,
        filters: [
          {
            name: "Microsoft Office Excel",
            extensions: ["xlsx"],
          },
        ],
      })
      if (path) {
        fs.writeFileSync(path, data)
        this.$alert(`Document is saved on ${path}`, "Succesffully saved", {
          confirmButtonText: "OK",
        })
      }
    },
  },
}
</script>
<template>
  <el-card class="container">
    <el-row type="flex" justify="space-between">
      <el-col :span="21">
        <h2>
          {{`${data.name.last}, ${data.name.first} ${data.name.middle} ${data.name.suffix}`,}}
        </h2>
      </el-col>
      <el-col :span="3">
        <el-button plain type="primary" @click="exportToPDS()"
          ><i class="el-icon-document-copy"></i> Save as PDS
        </el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <h3>Personal Information</h3>
    <el-divider></el-divider>
    <el-row>
      <el-col v-for="({ span, label, col, serialize }, i) in fields" :key="i" :span="span || 12">
        <div class="grid-content">
          <strong v-text="label"></strong>:
          <p
            v-text="serialize ? (data[col] ? serialize(data[col]) : 'none') : data[col] || 'none'"
          ></p>
        </div>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <h3>Educational Background</h3>
    <el-divider></el-divider>
    <el-table size="small" :data="education" style="width: 100%;">
      <el-table-column fixed label="Level" width="150">
        <template slot-scope="scope">
          <strong>{{ scope.row.level }}</strong>
        </template>
      </el-table-column>
      <el-table-column
        v-for="({ model, placeholder, span }, i) in schoolFields"
        :key="i"
        :label="placeholder"
        :width="span || 1"
      >
        <template slot-scope="scope">
          {{ scope.row[model] || "N/A" }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<style lang="scss" scoped>
.grid-content {
  margin: 0.5em 0;
}
h2,
h3 {
  color: $primary;
  text-shadow: 1px 1px 1px #555;
}
h3 {
  letter-spacing: 0.2em;
}
</style>
