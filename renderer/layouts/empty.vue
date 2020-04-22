<script>
import TitleBar from "@/components/TitleBar"
export default {
  middleware: "guest",
  components: { TitleBar },
}
</script>

<template>
  <div>
    <TitleBar />
    <nuxt />
  </div>
</template>
