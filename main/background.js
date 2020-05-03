import { app, dialog } from "electron"
import serve from "electron-serve"
const isProd = process.env.NODE_ENV === "production"
import { createWindow, exitOnChange } from "./helpers"
app.allowRendererProcessReuse = true

if (isProd) {
  serve({ directory: "app" })
} else {
  exitOnChange()
  app.setPath("userData", `${app.getPath("userData")} (development)`)
}

;(async () => {
  await app.whenReady()
  const mainWindow = createWindow("main", {
    frame: false,
    backgroundColor: "#282C34",
    minWidth: 1200,
  })
  if (isProd) {
    await mainWindow.loadURL("app://./")
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}`)
    mainWindow.webContents.openDevTools()
  }
  /* Show confirmation exit */
  mainWindow.on("close", e => {
    const question = dialog.showMessageBoxSync({
      type: "question",
      title: "Confirmation",
      buttons: ["No", "Yes"],
      message: "Do you really want to exit?",
    })
    if (!question) e.preventDefault()
  })
})()

app.on("window-all-closed", () => {
  app.quit()
})
