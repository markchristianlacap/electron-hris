<script>
const { getAppPath } = require("electron").remote.app
export default {
  created() {
    const path = require("path")
    const dir = path.dirname(getAppPath())
    console.log(getAppPath())
    console.log(__dirname)
    console.log(dir)
    const normalize = path.normalize(`${process.cwd()}\\..\\..\\`)
    console.log(normalize)
    console.log(process.cwd())
  },
}
</script>
<template>
  <div class="container">
    this is reports
    <button>Generate</button>
  </div>
</template>
