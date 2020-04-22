<script>
import TitleBar from "@/components/TitleBar"
import MenuBar from "@/components/MenuBar"
export default {
  middleware: "authenticated",
  components: { TitleBar, MenuBar },
}
</script>
<template>
  <div>
    <div class="win-header">
      <TitleBar />
      <MenuBar />
    </div>
    <nuxt />
  </div>
</template>
<style>
.win-header {
  position: sticky;
  top: 0;
  z-index: 9999;
}
</style>
