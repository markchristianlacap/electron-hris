<script>
export default {
  asyncData({ app }) {
    const participants = app.db
      .get("employees")
      .map(({ name, id }) => ({
        name: `${name.last}, ${name.first} ${name.middle} ${name.suffix || ""}`,
        id: id,
      }))
      .value()
    return { participants }
  },
  data: () => ({
    form: {},
    filterMethod(query, { name }) {
      return name.toLowerCase().indexOf(query.toLowerCase()) > -1
    },
    rules: {
      name: [
        { required: true, message: "Please input Activity name", trigger: "blur" },
        { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
      ],
      region: [{ required: true, message: "Please select Activity zone", trigger: "change" }],
      date1: [{ type: "date", required: true, message: "Please pick a date", trigger: "change" }],
      date2: [{ type: "date", required: true, message: "Please pick a time", trigger: "change" }],
      type: [
        {
          type: "array",
          required: true,
          message: "Please select at least one activity type",
          trigger: "change",
        },
      ],
      resource: [{ required: true, message: "Please select activity resource", trigger: "change" }],
      desc: [{ required: true, message: "Please input activity form", trigger: "blur" }],
    },
  }),
  computed: {},
}
</script>
<template>
  <div class="container">
    <el-card>
      <el-form :model="form" ref="form" label-width="120px">
        <el-form-item label="Program" prop="title" required>
          <el-input
            v-model="form.title"
            placeholder="TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="from" required label="From">
              <el-date-picker
                type="date"
                placeholder="Inclusive date from"
                v-model="form.from"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="to" label="To" required>
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
            <el-form-item label="Hours">
              <el-input-number v-model="form.hours"> </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Type">
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
        <el-form-item label="Conducted by" prop="desc">
          <el-input
            type="textarea"
            v-model="form.desc"
            placeholder="CONDUCTED/ SPONSORED BY"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
        <el-transfer
          :titles="['Employees', 'Participants']"
          v-model="form.participants"
          :props="{
            key: 'id',
            label: 'name',
          }"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="Search for employees"
          :data="participants"
        >
        </el-transfer>
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
