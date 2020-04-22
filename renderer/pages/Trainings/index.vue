<script>
export default {
  asyncData({ app }) {
    const data = app.db.get("trainings").value()
    return { data }
  },
  data: () => ({}),
}
</script>
<template>
  <div class="container">
    <h2>Trainings</h2>
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
    <el-card> </el-card>
  </div>
</template>
