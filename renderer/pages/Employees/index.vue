<script>
import { unlinkSync } from "fs"
import { join } from "path"
export default {
  asyncData({ app }) {
    const data = app.db.get("employees").value()
    return { data }
  },
  data: function () {
    return {
      disabled: true,
      selections: [],
      search: "",
      rows: [
        {
          groupLlb: "Complete Name",
          items: [
            {
              label: "Last Name",
              prop: "name.last",
            },
            {
              label: "First Name",
              prop: "name.first",
            },
            {
              label: "Middle Name",
              prop: "name.middle",
            },
            {
              label: "Suffix",
              prop: "name.suffix",
              width: 80,
            },
          ],
        },
        {
          label: "Birth Day",
          prop: "birthDate",
        },
        {
          label: "Birth Place",
          prop: "birthPlace",
        },
        {
          label: "Sex",
          prop: "sex",
          width: 80,
        },
        {
          label: "Height",
          prop: "height",
          width: 90,
        },
        {
          label: "Weight",
          prop: "weight",
          width: 90,
        },
      ],
    }
  },
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
    deleteRow({ id, image }, array) {
      if (image) unlinkSync(join(process.cwd(), image))
      const index = array.findIndex(row => row.id === id)
      array.splice(index, 1)
      this.$db.get("employees").remove({ id }).write()
    },
    selectionChanged(val) {
      this.disabled = val.length ? false : true
      this.selections = val
    },
    searchItems(row) {
      return !this.search || JSON.stringify(row).toLowerCase().includes(this.search.toLowerCase())
    },
  },
}
</script>
<template>
  <div class="container">
    <h2>Employees</h2>
    <el-divider> </el-divider>
    <div class="action-header">
      <div class="buttons">
        <el-button
          icon="el-icon-document-add"
          size="small"
          plain
          type="primary"
          @click="$router.push('/employees/create')"
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
        ref="singleTable"
        size="small"
        @selection-change="selectionChanged"
        :data="data.filter(searchItems)"
        :empty-text="search ? `No results found for ${search}` : 'No available records'"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <template v-for="(row, i) in rows">
          <el-table-column v-if="row.groupLlb" :label="row.groupLlb" :key="i">
            <el-table-column
              sortable
              v-for="(item, ii) in row.items"
              :key="ii"
              :width="item.width || 150"
              :label="item.label"
              :prop="item.prop"
            />
          </el-table-column>
          <el-table-column
            sortable
            v-else
            :key="i"
            :width="row.width || 150"
            :label="row.label"
            :prop="row.prop"
          />
        </template>
        <el-table-column width="120" fixed="right" label="Operations">
          <template slot-scope="scope">
            <el-tooltip
              :content="`Preview details of ${scope.row.name.last}, ${scope.row.name.first}`"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-document"
                circle
                plain
                @click="$router.push(`/employees/details?id=${scope.row.id}`)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :content="`Update ${scope.row.name.last}, ${scope.row.name.first}`"
              placement="top"
            >
              <el-button
                circle
                plain
                type="warning"
                icon="el-icon-edit"
                @click="$router.push(`/employees/create?id=${scope.row.id}`)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
