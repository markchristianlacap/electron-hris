<script>
import { generate } from "shortid"
export default {
  asyncData({ app }) {
    const salaries = app.db.get("salaries").value()

    return { salaries: JSON.parse(JSON.stringify(salaries)) }
  },
  data: () => ({
    form: {},
    rules: {
      salary_grade: [{ required: true, message: "Please input Salary Grade", trigger: "blur" }],
      step_increment: [{ required: true, message: "Please input Step Increment", trigger: "blur" }],
      amount: [{ required: true, message: "Please input Amount", trigger: "blur" }],
    },
  }),
  methods: {
    onSubmit(array, data) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        array.push(data)
        data.id = generate()
        this.$db.get("salaries").push(data).write()
        this.form = {}
      })
    },
    remove(array, { $index, row }) {
      array.splice($index, 1)
      this.$db.get("salaries").remove(row).write()
    },
  },
}
</script>
<template>
  <div class="container">
    <p class="text-light header">Salary Table</p>
    <el-divider> </el-divider>
    <el-row type="flex" justify="center" style="margin: 1em 0;">
      <el-col :span="12">
        <el-card style="margin: 0 1em;">
          <p>
            Salary Table
          </p>
          <el-table size="mini" :data="salaries" stripe style="width: 100%;">
            <el-table-column prop="salary_grade" label="Salary Grade" width="120">
            </el-table-column>
            <el-table-column prop="step_increment" label="Step Increment" width="120">
            </el-table-column>
            <el-table-column prop="amount" label="Amount"> </el-table-column>
            <el-table-column label="Operations">
              <template slot-scope="scope">
                <el-popconfirm
                  confirm-button-text="OK"
                  cancel-button-text="No"
                  icon="el-icon-info"
                  icon-color="red"
                  @onConfirm="remove(salaries, scope)"
                  title="Are you sure to delete this?"
                >
                  <el-button size="mini" type="danger" slot="reference">Delete</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin: 0 1em;">
          <p>
            Input salary
          </p>
          <el-form ref="form" :model="form" label-width="150px" :rules="rules">
            <el-form-item label="Salary Grade" prop="salary_grade">
              <el-input-number
                v-model="form.salary_grade"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="Step Increment" prop="step_increment">
              <el-input-number
                v-model="form.step_increment"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="Amount" prop="amount">
              <el-input-number v-model="form.amount" controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit(salaries, form)">Save</el-button>
              <el-button @click="form = {}">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
