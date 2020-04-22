<script>
import nationalities from "@/assets/json/nationalities.json"
import uuid from "~/assets/js/uuid"
import { readFileSync, copyFileSync } from "fs"
import { join, extname } from "path"
const { showOpenDialogSync } = require("electron").remote.dialog
export default {
  asyncData({ app, query }) {
    const id = query.id
    let form = {
      name: {},
      residential: {},
      permanent: {},
      elementary: {},
      secondary: {},
      vocational: {},
      college: {},
      graduate: {},
      spouse: { name: {}, business: {} },
      father: { name: {} },
      mother: { name: {} },
      children: [],
      eligibilities: [],
      experiences: [],
    }
    const name = app.db.get("employees").map("eligibilities.eligibility").sortedUniq().value()
    console.log(name)
    if (!id) return { form }
    form = app.db.get("employees").find({ id }).value() || form
    return { form, currentID: form.employeeNo, oldData: JSON.stringify(form) }
  },
  // beforeRouteLeave(to, from, next) {
  //   console.log(this.oldData)
  //   if (!this.oldData) return next()
  //   if (this.oldData === JSON.stringify(this.form)) return next()
  //   const answer = window.confirm("Do you really want to leave? you have unsaved changes!")
  //   answer ? next() : next(false)
  // },
  data() {
    const checkUniqueId = (rule, employeeNo, callback) => {
      if (employeeNo === this.currentID) return callback()
      const user = this.$db.get("employees").find({ employeeNo }).value()
      console.log(user)
      if (user) callback(new Error("ID number is already exist."))
      callback()
    }
    return {
      nationalities,
      rules: {
        employeeNo: [
          { required: true, message: "Employee number is required." },
          { validator: checkUniqueId, trigger: "blur" },
        ],
        name: {
          last: { required: true, message: "Last name is required." },
          first: { required: true, message: "First name is required." },
          middle: { required: true, message: "Middle name is required." },
        },
        birthDate: { required: true, message: "Date of birth is required." },
        birthPlace: { required: true, message: "Place of Birth is required." },
        sex: { required: true, message: "Gender is required." },
        civilStatus: { required: true, message: "Civil Status is required." },
        citizenship: { required: true, message: "Citizenship is required." },
        email: { type: "email", message: "Please input valid email address" },
      },
      addressFields: [
        { model: "block", placeholder: "House/Block/Lot No.", span: 8 },
        { model: "street", placeholder: "Street", span: 7 },
        { model: "village", placeholder: "Village", span: 8 },
        { model: "barangay", placeholder: "Barangay", span: 6 },
        { model: "city", placeholder: "City/Municipality", span: 7 },
        { model: "province", placeholder: "Province", span: 7 },
        { model: "zipCode", placeholder: "Zip Code", span: 3 },
      ],
      schoolFields: [
        { model: "name", placeholder: "Name of School", span: 8 },
        { model: "degree", placeholder: "BASIC EDUCATION/DEGREE/COURSE ", span: 8 },
        { model: "earned", placeholder: "Highest Level/Units Earned", span: 7 },
        { model: "from", placeholder: "from", type: "date", span: 5 },
        { model: "to", placeholder: "to", type: "date", span: 5 },
        { model: "graduated", placeholder: "Year Graduated", span: 5, type: "year" },
        { model: "scholarship", placeholder: "Scholarship/Academic Honors Received", span: 8 },
      ],
      levels: [
        { level: "elementary", label: "Elementary" },
        { level: "secondary", label: "Secondary" },
        { level: "vocational", label: "Vocational" },
        { level: "college", label: "College" },
        { level: "graduate", label: "Graduate" },
      ],
      eligibilitiesField: [
        { model: "eligibility", label: "Eligibility", span: 8 },
        { model: "eligibility", label: "Eligibility", span: 8 },
      ],
      dialogs: {
        child: false,
        eligibility: false,
        experience: false,
      },
      image: "",
      eligibility: {},
      experience: {},
      child: {},
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    imageUrl() {
      if (!this.image && !this.form.image) return require("~/assets/img/user.svg")
      const path = this.image || !this.form.image || join(process.cwd(), this.form.image)
      return "data:image/png;base64," + readFileSync(path).toString("base64")
    },
  },
  methods: {
    deleteRow(array, index) {
      array.splice(index, 1)
    },
    addRow(array, child) {
      array.push(child)
    },
    imageUploader() {
      const dir = showOpenDialogSync({
        filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
      })
      if (!dir) return
      this.image = dir[0]
    },
    clearImage() {
      this.image = ""
    },
    onSubmit(data) {
      try {
        const { form } = this.$refs
        form.validate((valid, rules) => {
          if (!valid) {
            let message = "<ul style='color:red'>"
            const keys = Object.keys(rules)
            keys.forEach(key => {
              message += `<li>* ${rules[key][0].message}</li>`
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
          let db = this.$db.get("employees")
          const update = data.updated_at ? 1 : 0
          data.updated_at = Date.now()
          data.id = data.id || uuid()
          if (this.image) {
            data.image = join("storage", "images", data.id + extname(this.image))
            copyFileSync(this.image, join(process.cwd(), data.image))
          }
          if (update) {
            db = db.find({ id: this.id }).assign(data)
          } else {
            db = db.push(data)
          }
          db.write()
          this.$message({ type: "success", message: "Successfully save" })
          delete this.oldData
          this.$router.push("/employees")
        })
      } catch (error) {
        this.$message({ type: "danger", message: error })
      }
    },
  },
}
</script>
<template>
  <div class="container">
    <el-card>
      <el-form
        @submit.native.prevent="onSubmit(form)"
        on
        ref="form"
        :model="form"
        label-width="120px"
        status-icon
        :rules="rules"
      >
        <el-button
          size="small"
          icon="el-icon-document-add"
          plain
          native-type="submit"
          type="primary"
        >
          Save
        </el-button>
        <el-button size="small" @click="$router.push('/employees')">Cancel</el-button>
        <el-tabs>
          <el-tab-pane label="Personal Information">
            <h3>Personal Information</h3>
            <el-divider></el-divider>
            <el-row :gutter="20">
              <el-col :span="18">
                <el-form-item label="Last Name" prop="name.last">
                  <el-input v-model="form.name.last" placeholder="Input Last Name (Dela Cruz)" />
                </el-form-item>
                <el-form-item label="First Name" prop="name.first">
                  <el-input v-model="form.name.first" placeholder="Input First Name (Juan)" />
                </el-form-item>
                <el-row>
                  <el-col :span="16">
                    <el-form-item label="Middle Name" prop="name.middle">
                      <el-input
                        v-model="form.name.middle"
                        placeholder="Input Middle Name (Ponce)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Extension" prop="name.suffix">
                      <el-input v-model="form.name.suffix" placeholder="E.g. (Jr, Sr.)" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <div class="avatar-uploader">
                  <el-image :src="imageUrl" fit="cover"></el-image>
                  <div class="avatar-uploader-icon">
                    <i @click="imageUploader()" class="el-icon-paperclip fa-fw"></i>
                    <i v-if="this.image" @click="clearImage()" class="el-icon-delete fa-fw"></i>
                  </div>
                </div>
                <br />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="Employee No." prop="employeeNo">
                  <el-input type="text" v-model="form.employeeNo" placeholder="XXX-XXX-XX " />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Sex" prop="sex">
                  <el-radio label="Male" v-model="form.sex"></el-radio>
                  <el-radio label="Female" v-model="form.sex"></el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Date of Birth" prop="birthDate">
                  <el-date-picker
                    v-model="form.birthDate"
                    type="date"
                    format="MM/dd/yyyy"
                    value-format="MM/dd/yyyy"
                    placeholder="MM/dd/yyyy"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item prop="birthPlace" label="Place of Birth">
                  <el-input v-model="form.birthPlace" placeholder="Input Place of Birth" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Citizenship" prop="citizenship">
                  <el-select
                    v-model="form.citizenship"
                    filterable
                    default-first-option
                    placeholder="Choose Citizenship"
                  >
                    <el-option
                      v-for="item in nationalities"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="Civil Status" prop="civilStatus">
                  <el-select
                    v-model="form.civilStatus"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="Choose status"
                  >
                    <el-option
                      v-for="item in ['Single', 'Married', 'Widowed', 'Separated']"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Height(m)" prop="height">
                  <el-input-number
                    :min="1"
                    size="small"
                    type="text"
                    controls-position="right"
                    v-model="form.height"
                    placeholder="Millimetre"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Weight(kg)" prop="weight">
                  <el-input-number
                    :min="1"
                    size="small"
                    controls-position="right"
                    type="text"
                    v-model="form.weight"
                    placeholder="Kilogram"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="Blood Type" prop="bloodType">
                  <el-select v-model="form.bloodType" placeholder="Select Blood Type">
                    <el-option
                      v-for="item in ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="Email" prop="email">
                  <el-input v-model="form.email" type="email" placeholder="@email.com" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Telephone">
                  <el-input
                    v-model="form.telNo"
                    type="text"
                    placeholder="Telephone number"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Mobile no.">
                  <el-input
                    v-model="form.mobileNo"
                    type="text"
                    placeholder="Mobile number"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="GSIS">
                  <el-input type="text" v-model="form.gsis" placeholder="XXX-XXX-XX " />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="PAG-IBIG">
                  <el-input type="text" v-model="form.pagIbig" placeholder="XXX-XXX-XX " />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="PHILHEALTH">
                  <el-input type="text" v-model="form.philHealth" placeholder="XXX-XXX-XX " />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="SSS No.">
                  <el-input type="text" v-model="form.sss" placeholder="XXX-XXX-XX " />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Tin No.">
                  <el-input type="text" v-model="form.tin" placeholder="XXX-XXX-XX " />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="Residential Address">
                  <el-row class="grid">
                    <el-col
                      v-for="{ model, placeholder, span } in addressFields"
                      :key="model"
                      :span="span"
                    >
                      <el-form-item>
                        <el-input :placeholder="placeholder" v-model="form.residential[model]">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Permanent Address">
                  <el-row class="grid">
                    <el-col
                      v-for="{ placeholder, model, span } in addressFields"
                      :key="model"
                      :span="span"
                    >
                      <el-form-item>
                        <el-input :placeholder="placeholder" v-model="form.permanent[model]">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Educational Background">
            <h3>Educational Background</h3>
            <el-divider></el-divider>
            <el-row>
              <el-col :span="24" v-for="{ level, label } in levels" :key="level">
                <el-form-item :label="label">
                  <el-row class="grid">
                    <el-col
                      v-for="{ span, type, model, placeholder } in schoolFields"
                      :key="model"
                      :span="span"
                    >
                      <el-form-item>
                        <el-date-picker
                          v-if="type"
                          v-model="form[level][model]"
                          :type="type"
                          size="small"
                          format="MM/dd/yyyy"
                          value-format="MM/dd/yyyy"
                          :placeholder="placeholder"
                        />
                        <el-input
                          v-else
                          size="small"
                          :placeholder="placeholder"
                          v-model="form.elementary[model]"
                        >
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Family Background">
            <h3>Family Background</h3>
            <el-divider></el-divider>
            <el-form-item label="Father's name">
              <el-row :gutter="4">
                <el-col :span="7">
                  <el-input v-model="form.father.name.last" placeholder="Last name"></el-input>
                </el-col>
                <el-col :span="7">
                  <el-input v-model="form.father.name.first" placeholder="First name"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="form.father.name.middle" placeholder="First name"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="form.father.name.suffix" placeholder="Suffix"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="Mother's name">
              <el-row :gutter="4">
                <el-col :span="7">
                  <el-input v-model="form.mother.name.last" placeholder="Last name"></el-input>
                </el-col>
                <el-col :span="7">
                  <el-input v-model="form.mother.name.first" placeholder="First name"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="form.mother.name.middle" placeholder="First name"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="form.mother.name.suffix" placeholder="Suffix"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <h4>Spouse's Information</h4>
            <br />
            <el-form-item label="Full name">
              <el-row :gutter="4">
                <el-col :span="7">
                  <el-input v-model="form.spouse.name.last" placeholder="Last name"></el-input>
                </el-col>
                <el-col :span="7">
                  <el-input v-model="form.spouse.name.first" placeholder="First name"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="form.spouse.name.middle" placeholder="First name"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="form.spouse.name.suffix" placeholder="Suffix"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="Work Info">
              <el-row :gutter="5">
                <el-col :span="11">
                  <el-input
                    placeholder="Business/Employeer Name"
                    v-model="form.spouse.business.name"
                  ></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input
                    placeholder="Business/Employeer Address"
                    v-model="form.spouse.business.address"
                  ></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-row>
              <el-col :span="15">
                <el-form-item label="Contact">
                  <el-input
                    v-model="form.spouse.telNo"
                    placeholder="Telephone number/ Mobile number"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <h4>Childrens</h4>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" @click="dialogs.child = true">Add</el-button>
              </el-col>
            </el-row>
            <el-table size="small" :data="form.children" style="width: 100%;">
              <el-table-column prop="name" label="Name"> </el-table-column>
              <el-table-column prop="birthDate" label="Birth Day"> </el-table-column>
              <el-table-column label="Remove" width="120">
                <template slot-scope="scope">
                  <el-popconfirm
                    confirm-button-type="danger"
                    title="Are you sure to delete this?"
                    confirm-button-text="OK"
                    cancel-button-text="Cancel"
                    @onConfirm="deleteRow(form.children, scope.$index)"
                  >
                    <el-button slot="reference" type="danger" size="small">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog title="Children's Information" :visible.sync="dialogs.child">
              <el-form :model="child">
                <el-form-item label="Full name">
                  <el-input
                    v-model="child.name"
                    placeholder="Input child's complete name"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Date of Birth">
                  <el-date-picker
                    v-model="child.birthDate"
                    type="date"
                    format="MM/dd/yyyy"
                    value-format="MM/dd/yyyy"
                    placeholder="MM/dd/yyyy"
                  />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogs.child = false">Cancel</el-button>
                <el-button
                  type="primary"
                  @click="addRow(form.children, child), (dialogs.child = false), (child = {})"
                  >Confirm</el-button
                >
              </span>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="Eligibilities & Work Experience">
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <h4>Eligibility</h4>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" @click="dialogs.eligibility = true">
                  Add
                </el-button>
              </el-col>
            </el-row>
            <el-table size="small" :data="form.eligibilities" style="width: 100%;">
              <el-table-column prop="name" label="Eligibility"> </el-table-column>
              <el-table-column prop="rating" label="Rating"> </el-table-column>
              <el-table-column prop="date" label="Date"> </el-table-column>
              <el-table-column prop="place" label="Place"> </el-table-column>
              <el-table-column prop="license" label="License"> </el-table-column>
              <el-table-column prop="validity" label="Validity"> </el-table-column>
              <el-table-column label="Remove" width="120">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(form.eligibilities, scope.$index)"
                    type="danger"
                    size="small"
                  >
                    <i class="el-icon-delete"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog title="Eligibility Information" :visible.sync="dialogs.eligibility">
              <el-form :model="eligibility" label-width="80px">
                <el-form-item label="Eligibility">
                  <el-select
                    v-model="eligibility.name"
                    filterable
                    allow-create
                    default-first-option
                  >
                    <el-option v-for="item in []" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="Rating">
                      <el-input v-model="eligibility.rating" placeholder="Percentage"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="Date">
                      <el-date-picker
                        v-model="eligibility.date"
                        type="date"
                        format="MM/dd/yyyy"
                        value-format="MM/dd/yyyy"
                        placeholder="MM/dd/yyyy"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="License">
                      <el-input v-model="eligibility.license" placeholder="License No."></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="Validity">
                      <el-date-picker
                        v-model="eligibility.validity"
                        type="date"
                        format="MM/dd/yyyy"
                        value-format="MM/dd/yyyy"
                        placeholder="MM/dd/yyyy"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="Place">
                  <el-input
                    v-model="eligibility.place"
                    type="textarea"
                    :rows="2"
                    placeholder="Input place of examination"
                  ></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogs.eligibility = false">Cancel</el-button>
                <el-button
                  type="primary"
                  @click="
                    addRow(form.eligibilities, eligibility),
                      (dialogs.eligibility = false),
                      (eligibility = {})
                  "
                  >Confirm</el-button
                >
              </span>
            </el-dialog>
            <br />
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <h4>Work Experience</h4>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" @click="dialogs.experience = true">
                  Add
                </el-button>
              </el-col>
            </el-row>
            <el-table size="small" :data="form.experiences" style="width: 100%;">
              <el-table-column prop="position" label="Position"> </el-table-column>
              <el-table-column prop="department" label="Department"> </el-table-column>
              <el-table-column prop="status" label="Status"> </el-table-column>
              <el-table-column prop="from" label="From"> </el-table-column>
              <el-table-column prop="to" label="To"> </el-table-column>
              <el-table-column prop="salary" label="Salary"> </el-table-column>
              <el-table-column prop="grade" label="Grade/Step"> </el-table-column>
              <el-table-column label="Remove" width="120">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(form.experiences, scope.$index)"
                    type="danger"
                    size="small"
                  >
                    <i class="el-icon-delete"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog title="Work Information" :visible.sync="dialogs.experience">
              <el-form :model="experience" label-width="80px">
                <el-form-item label="Position">
                  <el-select
                    v-model="experience.position"
                    filterable
                    allow-create
                    default-first-option
                  >
                    <el-option v-for="item in []" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Agency">
                  <el-input
                    v-model="experience.department"
                    placeholder="DEPARTMENT / AGENCY / OFFICE / COMPANY"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Status">
                  <el-select
                    v-model="experience.status"
                    filterable
                    allow-create
                    default-first-option
                  >
                    <el-option
                      v-for="item in ['Regular', 'Job Order', 'Permanent']"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="From">
                  <el-date-picker
                    v-model="experience.from"
                    type="date"
                    format="MM/dd/yyyy"
                    value-format="MM/dd/yyyy"
                    placeholder="MM/dd/yyyy"
                  />
                </el-form-item>
                <el-form-item label="To">
                  <el-date-picker
                    v-model="experience.to"
                    type="date"
                    format="MM/dd/yyyy"
                    value-format="MM/dd/yyyy"
                    placeholder="MM/dd/yyyy"
                  />
                </el-form-item>
                <el-form-item label="Salary">
                  <el-input v-model="experience.salary" placeholder="MONTHLY SALARY"></el-input>
                </el-form-item>
                <el-form-item label="Step">
                  <el-input
                    v-model="experience.grade"
                    placeholder="SALARY GRADE (if applicable)& STEP  (Format '00-0')/ INCREMENT"
                  ></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogs.experience = false">Cancel</el-button>
                <el-button
                  type="primary"
                  @click="
                    addRow(form.experiences, experience),
                      (dialogs.experience = false),
                      (experience = {})
                  "
                  >Confirm</el-button
                >
              </span>
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.container {
  max-width: 1200px;
}
.grid > * {
  margin-bottom: 0.5em;
  margin-right: 0.5em;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  width: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 178px;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  position: absolute;
  text-shadow: 1px 1px 2px #fefefe;
  i {
    cursor: pointer;
  }
}
</style>
