<script>
export default {
  asyncData({ app }) {
    const data = app.db.get("trainings").value()
    return { data }
  },
  data: () => ({
    search: "",
    selections: [],
  }),
  methods: {
    async deleteRows(array) {
      try {
        if (!this.selections.length)
          return this.$message({ type: "info", message: "Please select row you want to delete." })
        await this.$confirm(
          "This will permanently delete the selected rows. Continue?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
        this.selections.forEach(({ id, image }) => {
          this.deleteRow({ id, image }, array)
        })
        this.$message({
          type: "success",
          message: `${this.selections.length} ${
            this.selections.length > 1 ? "rows" : "row"
          } successfully deleted.`,
        })
      } catch (error) {
        this.$message({
          type: "info",
          message: "Delete canceled",
        })
      }
    },
    searchItems(row) {
      return !this.search || JSON.stringify(row).toLowerCase().includes(this.search.toLowerCase())
    },
    deleteRow({ id }, array) {
      const index = array.findIndex(row => row.id === id)
      array.splice(index, 1)
      this.$db.get("trainings").remove({ id }).write()
    },
    selectionChanged(val) {
      this.disabled = val.length ? false : true
      this.selections = val
    },
  },
}
</script>
<template>
  <div class="container">
    <p class="text-light header">Trainings</p>
    <el-divider> </el-divider>
    <div class="action-header">
      <div class="buttons">
        <el-button
          icon="el-icon-document-add"
          size="small"
          plain
          type="primary"
          @click="$router.push('/trainings/create')"
        >
          Create
        </el-button>
        <el-button icon="el-icon-delete" size="small" plain type="danger" @click="deleteRows(data)">
          Delete
        </el-button>
      </div>
      <div class="search">
        <el-input size="small" v-model="search" placeholder="Type to search" />
      </div>
    </div>
    <el-card>
      <el-table
        size="small"
        :data="data.filter(searchItems)"
        @selection-change="selectionChanged"
        :empty-text="search ? `No results found for ${search}` : 'No available records'"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row justify="space-between" align="middle" type="flex">
              <el-col :span="12">
                <p>
                  From: <strong>{{ props.row.from | date }}</strong>
                </p>
                <p>
                  To:
                  <strong>
                    {{ props.row.to | date }}
                  </strong>
                </p>
                <p>
                  Number of Hours:
                  <strong>{{ props.row.hours }}</strong>
                </p>
                <p>
                  Type:
                  <strong>
                    {{ props.row.type }}
                  </strong>
                </p>
              </el-col>
              <el-col :span="12">
                <strong>Participants</strong>
                <ul>
                  <li v-for="({ name }, i) in props.row.participants" :key="i">
                    {{ name }}
                  </li>
                </ul>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column sortable label="Title" prop="title"> </el-table-column>
        <el-table-column sortable label="Conducted by" prop="conducted"> </el-table-column>
        <el-table-column sortable label="No. of participants">
          <template slot-scope="props">
            {{ props.row.participants.length }}
          </template>
        </el-table-column>
        <el-table-column width="120" fixed="right" label="Operations">
          <template slot-scope="scope">
            <el-tooltip :content="`Preview details for ${scope.row.title}`" placement="top">
              <el-button
                type="primary"
                icon="el-icon-document"
                circle
                plain
                @click="$router.push(`/trainings/details?id=${scope.row.id}`)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="`Update ${scope.row.title}`" placement="top">
              <el-button
                circle
                plain
                type="warning"
                icon="el-icon-edit"
                @click="$router.push(`/trainings/create?id=${scope.row.id}`)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
