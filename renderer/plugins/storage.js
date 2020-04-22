import { existsSync, mkdirSync } from "fs"
import { join } from "path"
const storage = join(process.cwd(), "storage")
const images = join(storage, "images")
if (!existsSync(storage)) {
  mkdirSync(storage)
}
if (!existsSync(images)) {
  mkdirSync(images)
}
