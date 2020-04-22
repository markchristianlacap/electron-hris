<script>
export default {
  data: () => ({
    form: {},
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
}
</script>
<template>
  <div class="container">
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="Activity name" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Activity zone" prop="region">
          <el-select v-model="form.region" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai"></el-option>
            <el-option label="Zone two" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Activity time" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="Pick a date"
                v-model="form.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                placeholder="Pick a time"
                v-model="form.date2"
                style="width: 100%;"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="Instant delivery" prop="delivery">
          <el-switch v-model="form.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="Resources" prop="resource">
          <el-radio-group v-model="form.resource">
            <el-radio label="Sponsorship"></el-radio>
            <el-radio label="Venue"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Activity form" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
