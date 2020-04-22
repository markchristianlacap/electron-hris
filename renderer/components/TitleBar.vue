<script>
const {
  maximize,
  unmaximize,
  minimize,
  close,
  isMaximized,
} = require("electron").remote.getCurrentWindow()
export default {
  data: () => ({
    fullScreen: isMaximized(),
  }),
  methods: {
    minimize: () => minimize(),
    maximize() {
      isMaximized() ? unmaximize() : maximize()
      this.fullScreen = !this.fullScreen
    },
    close: () => close(),
  },
}
</script>

<template>
  <header class="titlebar">
    <div class="window-title">
      <img class="icon-title" src="/icon.svg" alt="icon" />
      <span>Human Resources Information System</span>
    </div>
    <div class="window-controls" :class="fullScreen ? 'maximized' : ''">
      <div class="min-button button" @click="minimize()">
        <img
          class="icon"
          srcset="
            @/assets/icons/min-w-10.png 1x,
            @/assets/icons/min-w-12.png 1.25x,
            @/assets/icons/min-w-15.png 1.5x,
            @/assets/icons/min-w-15.png 1.75x,
            @/assets/icons/min-w-20.png 2x,
            @/assets/icons/min-w-20.png 2.25x,
            @/assets/icons/min-w-24.png 2.5x,
            @/assets/icons/min-w-30.png 3x,
            @/assets/icons/min-w-30.png 3.5x
          "
          draggable="false"
        />
      </div>
      <div class="max-button button" @click="maximize()">
        <img
          class="icon"
          srcset="
            @/assets/icons/max-w-10.png 1x,
            @/assets/icons/max-w-12.png 1.25x,
            @/assets/icons/max-w-15.png 1.5x,
            @/assets/icons/max-w-15.png 1.75x,
            @/assets/icons/max-w-20.png 2x,
            @/assets/icons/max-w-20.png 2.25x,
            @/assets/icons/max-w-24.png 2.5x,
            @/assets/icons/max-w-30.png 3x,
            @/assets/icons/max-w-30.png 3.5x
          "
          draggable="false"
        />
      </div>
      <div class="restore-button button" @click="maximize()">
        <img
          class="icon"
          srcset="
            @/assets/icons/restore-w-10.png 1x,
            @/assets/icons/restore-w-12.png 1.25x,
            @/assets/icons/restore-w-15.png 1.5x,
            @/assets/icons/restore-w-15.png 1.75x,
            @/assets/icons/restore-w-20.png 2x,
            @/assets/icons/restore-w-20.png 2.25x,
            @/assets/icons/restore-w-24.png 2.5x,
            @/assets/icons/restore-w-30.png 3x,
            @/assets/icons/restore-w-30.png 3.5x
          "
          draggable="false"
        />
      </div>
      <div class="close-button button" @click="close()">
        <img
          class="icon"
          srcset="
            @/assets/icons/close-w-10.png 1x,
            @/assets/icons/close-w-12.png 1.25x,
            @/assets/icons/close-w-15.png 1.5x,
            @/assets/icons/close-w-15.png 1.75x,
            @/assets/icons/close-w-20.png 2x,
            @/assets/icons/close-w-20.png 2.25x,
            @/assets/icons/close-w-24.png 2.5x,
            @/assets/icons/close-w-30.png 3x,
            @/assets/icons/close-w-30.png 3.5x
          "
          draggable="false"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.titlebar {
  display: flex;
  justify-content: space-between;
  height: 35px;
  background: darken($dark, 5%);
  color: #fefefe;
  -webkit-app-region: drag;
}

.window-title {
  display: flex;
  align-items: center;
  font-size: 12px;
  text-shadow: 0 0 2px #333;
}
.icon-title {
  height: 22px;
  padding: 5px;
}
.window-controls {
  display: grid;
  grid-template-columns: repeat(3, 46px);
  height: 100%;
  -webkit-app-region: no-drag;
  .button {
    grid-row: 1 / span 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    user-select: none;
  }
  .button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .button:active {
    background: rgba(255, 255, 255, 0.2);
  }
}
@media (-webkit-device-pixel-ratio: 1.5),
  (device-pixel-ratio: 1.5),
  (-webkit-device-pixel-ratio: 2),
  (device-pixel-ratio: 2),
  (-webkit-device-pixel-ratio: 3),
  (device-pixel-ratio: 3) {
  .window-controls .icon {
    width: 10px;
    height: 10px;
  }
}
.close-button:hover {
  background: $danger !important;
}
.close-button:active {
  background: $warning !important;
}
.close-button:active .icon {
  filter: invert(1);
}
.min-button {
  grid-column: 1;
}
.max-button,
.restore-button {
  grid-column: 2;
}
.close-button {
  grid-column: 3;
}
.restore-button {
  display: none !important;
}
.maximized .restore-button {
  display: flex !important;
}
.maximized .max-button {
  display: none;
}
</style>
