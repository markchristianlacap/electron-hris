<script>
import { generate } from "shortid"
export default {
  asyncData({ app, query }) {
    let employees = app.db.get("employees")
    const id = query.id
    const form = id ? app.db.get("trainings").find({ id: id }).value() : { participants: [] }
    employees = employees.map(({ name, id }) => ({
      name: `${name.last}, ${name.first} ${name.middle} ${name.suffix || ""}`,
      id: id,
    }))
    employees = id
      ? employees.filter(({ id }) => !form.participants.map(({ id }) => id).includes(id)).value()
      : employees.value()
    return { employees, form }
  },
  data: () => ({
    rules: {
      title: [{ required: true, message: "Please input title" }],
      from: [{ required: true, message: "Please pick a date" }],
      to: [{ required: true, message: "Please pick a date" }],
      hours: [{ required: true, message: "Please insert hours" }],
      type: [{ required: true, message: "Please select type" }],
      conducted: [{ required: true, message: "Please input conducted by" }],
    },
    searchEmployee: "",
    searchParticipants: "",
  }),
  computed: {
    id() {
      return this.$route.query.id
    },
  },
  methods: {
    add({ $index, row }, add, remove) {
      add.push(row)
      remove.splice($index, 1)
    },
    filterEmployee({ name }) {
      return !this.searchEmployee || name.toLowerCase().includes(this.searchEmployee.toLowerCase())
    },
    filterParticipants({ name }) {
      return (
        !this.searchParticipants ||
        name.toLowerCase().includes(this.searchParticipants.toLowerCase())
      )
    },
    save(data) {
      this.$refs.form.validate((valid, errors) => {
        if (!valid || !data.participants.length) {
          if (!data.participants.length)
            errors.participants = [{ message: "Please add participants" }]
          let message = "<ul style='color:red'>"
          const keys = Object.keys(errors)
          keys.forEach(key => {
            message += `<li>* ${errors[key][0].message}</li>`
          })
          message += "</ul>"
          this.$notify({
            title: "Error Log",
            type: "error",
            position: "bottom-right",
            dangerouslyUseHTMLString: true,
            message,
            duration: 0,
          })
          return
        }
        const id = this.id
        data.id = id || generate()
        let db = this.$db.get("trainings")
        id ? db.find({ id }).assign(data).write() : db.push(data).write()
        this.$message({ type: "success", message: "Successfully save" })
        this.$router.push("/trainings")
      })
    },
  },
}
</script>
<template>
  <div class="container">
    <el-card>
      <el-form
        @submit.native.prevent="save(form)"
        :model="form"
        ref="form"
        :rules="rules"
        label-width="130px"
      >
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="12">
            <h1>Learning and Development Form </h1>
          </el-col>
          <el-col :span="12">
            <div>
              <el-button type="primary" native-type="submit">Save</el-button>
              <el-button @click="$router.push('/trainings')">Cancel</el-button>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="Program" prop="title">
          <el-input
            v-model="form.title"
            placeholder="TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="from" label="From">
              <el-date-picker
                type="date"
                placeholder="Inclusive date from"
                v-model="form.from"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="to" label="To">
              <el-date-picker
                type="date"
                placeholder="Inclusive date to"
                v-model="form.to"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Hours" prop="hours">
              <el-input-number v-model="form.hours"> </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Type" prop="type">
              <el-select v-model="form.type" filterable allow-create default-first-option>
                <el-option
                  v-for="item in ['Managerial', 'Supervisory', 'Technical']"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Conducted by" prop="conducted">
          <el-input
            type="textarea"
            v-model="form.conducted"
            placeholder="CONDUCTED/ SPONSORED BY"
          ></el-input>
        </el-form-item>
        <el-row :gutter="2" justify="space-between" type="flex">
          <el-col :span="12">
            <p>Select participants</p>
            <el-table height="600" ref="employeeTable" :data="employees.filter(filterEmployee)">
              <el-table-column label="Name" prop="name">
                <template slot="header">
                  <div class="el-input el-input--mini">
                    <input
                      class="el-input__inner"
                      type="text"
                      v-model="searchEmployee"
                      size="mini"
                      placeholder="Type to search"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="right" width="80" label="Action">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-check"
                    size="small"
                    @click="add(scope, form.participants, employees)"
                    circle
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12">
            <p>Selected participants</p>
            <el-table
              height="600"
              ref="employeeTable"
              :data="form.participants.filter(filterParticipants)"
            >
              <el-table-column label="Name" prop="name">
                <template slot="header">
                  <div class="el-input el-input--mini">
                    <input
                      class="el-input__inner"
                      type="text"
                      v-model="searchParticipants"
                      size="mini"
                      placeholder="Type to search"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="right" width="80" label="Action">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="add(scope, employees, form.participants)"
                    circle
                    icon="el-icon-delete"
                  >
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<style>
.el-transfer {
  max-width: 100%;
  width: 50px;
}
</style>
