import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
export default ({ app }, inject) => {
  const adapter = new FileSync("database.json")
  const db = low(adapter)
  const defaults = { users: [], employees: [], trainings: [] }
  db.defaults(defaults).write()
  db._.mixin({
    elegibilities: array => {
      return array[1]
    },
  })
  app.db = db
  inject("db", db)
}
