<script>
import XlsxTemplate from "xlsx-template"
import { Workbook } from "exceljs"
import moment from "moment/moment"
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join, extname } from "path"
const { showSaveDialogSync } = require("electron").remote.dialog
const xlsx = readFileSync(join(process.cwd(), "templates", "pds-template.xlsx"))
export default {
  asyncData({ app, query }) {
    const id = query.id
    const data = app.db.get("applicants").find({ id }).value()
    return { data }
  },
  data: () => ({
    fields: [
      {
        label: "Complete name",
        serialize: ({ last, first, middle, suffix }) =>
          `${last}, ${first} ${middle} ${suffix || ""}`,
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
    family: [
      {
        label: "Father's Complete Name",
        col: "father",
        serialize: ({ name }) => {
          const { last, first, middle, suffix } = name
          return last ? `${last || ""}, ${first || ""} ${middle || ""} ${suffix || ""}` : null
        },
      },
      {
        label: "Mother's Complete Name",
        col: "mother",
        serialize: ({ name }) => {
          const { last, first, middle } = name
          return last ? `${last || ""}, ${first || ""} ${middle || ""}` : null
        },
      },
      {
        label: "Spouse's Complete Name",
        col: "spouse",
        serialize: ({ name }) => {
          const { last, first, middle, suffix } = name
          return last ? `${last || ""}, ${first || ""} ${middle || ""} ${suffix || ""}` : null
        },
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
    async exportToPDS() {
      this.data.dateNow = moment().format("dddd, MMM Do, YYYY")
      const template = new XlsxTemplate(xlsx)
      template.substitute(1, this.data)
      template.substitute(2, this.data)
      template.substitute(3, this.data)
      template.substitute(4, this.data)
      let data = template.generate({ type: "nodebuffer" })
      // Add image to worksheet
      const imgPath = this.data.image ? join(process.cwd(), this.data.image) : 0
      if (imgPath && existsSync(imgPath)) {
        const workbook = new Workbook()
        await workbook.xlsx.load(data.buffer)
        const image = workbook.addImage({
          buffer: readFileSync(imgPath),
          extension: extname(imgPath).replace(".", ""),
        })
        workbook.getWorksheet(4).addImage(image, "J50:M55")
        data = await workbook.xlsx.writeBuffer()
      }
      const defaultPath = `Personal Data Sheet - ${this.data.name.last} ${this.data.name.first}`
      const path = showSaveDialogSync({
        defaultPath,
        filters: [
          {
            name: "Microsoft Office Excel",
            extensions: ["xlsx"],
          },
        ],
      })
      if (path) {
        writeFileSync(path, data)
        this.$alert(`Document is saved on ${path}`, "Succesffully saved", {
          confirmButtonText: "OK",
        })
      }
    },
  },
}
</script>
<template>
  <div class="container">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col :md="19" :lg="21" :xl="22">
        <p class="text-primary header">
          {{`${data.name.last}, ${data.name.first} ${data.name.middle} ${data.name.suffix || ''}`,}}
        </p>
      </el-col>
      <el-col :md="5" :lg="3" :xl="2">
        <el-button plain type="primary" @click="exportToPDS()"
          ><i class="el-icon-document-copy"></i> Generate PDS
        </el-button>
      </el-col>
    </el-row>
    <br />
    <el-card>
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
      <el-divider></el-divider>
      <h3>Family Background</h3>
      <el-divider></el-divider>
      <el-row>
        <el-col v-for="({ span, label, col, serialize }, i) in family" :key="i" :span="span || 12">
          <div class="grid-content">
            <strong v-text="label"></strong>:
            <p
              v-text="serialize ? (data[col] ? serialize(data[col]) : 'none') : data[col] || 'none'"
            ></p>
          </div>
        </el-col>
      </el-row>
      <br />
      <h4>Childrens</h4>
      <br />
      <el-table size="small" :data="data.children">
        <el-table-column fixed label="Name" width="150">
          <template slot-scope="scope">
            <strong>{{ scope.row.name }}</strong>
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" label="Date of birth"> </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <h3>Trainings</h3>
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
      <el-divider></el-divider>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.grid-content {
  margin: 0.5em 0;
}
strong {
  color: #555;
}
h3 {
  letter-spacing: 0.2em;
}
</style>
