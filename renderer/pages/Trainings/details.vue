<script>
import XlsxTemplate from "xlsx-template"
import moment from "moment"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
const { showSaveDialogSync } = require("electron").remote.dialog
const xlsx = readFileSync(join(process.cwd(), "templates", "training-template.xlsx"))
export default {
  asyncData({ app, query }) {
    const id = query.id
    const data = app.db.get("trainings").find({ id }).value()
    return { data }
  },
  data: () => ({
    fields: [
      {
        label: "Title",
        col: "title",
      },
      {
        label: "Number of participants",
        col: "participants",
        serialize: data => data.length,
      },
      {
        label: "From",
        col: "from",
        serialize: data => moment(data).format("MMM DD, YYYY"),
      },
      {
        label: "To",
        col: "to",
        serialize: data => moment(data).format("MMM DD, YYYY"),
      },
      {
        label: "Number of Hours",
        col: "hours",
        serialize: data => data + "hours",
      },
      {
        label: "Type",
        col: "type",
      },
      {
        label: "Conducted/Sponsored By",
        col: "conducted",
      },
    ],
  }),
  methods: {
    async exportToPDS() {
      this.data.dateNow = moment().format("MMM DD, YYYY")
      const template = new XlsxTemplate(xlsx)
      template.substitute(1, this.data)
      let data = template.generate({ type: "nodebuffer" })
      const defaultPath = `Training - ${this.data.title}`
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
  <el-card class="container">
    <el-row type="flex" justify="space-between">
      <el-col :span="21">
        <h2>
          {{ data.title }}
        </h2>
      </el-col>
      <el-col :span="3">
        <el-button plain type="primary" @click="exportToPDS()"
          ><i class="el-icon-document-copy"></i> Save as PDS
        </el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <h3>Training Details</h3>
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
    <h4>List of participants</h4>
    <ol>
      <li v-for="({ name }, i) in data.participants" :key="i">{{ name }}</li>
    </ol>
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
