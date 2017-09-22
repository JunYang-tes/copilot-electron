const { execSync, spawn } = require("child_process")
const { Readable } = require("stream")
const electronVersion = execSync("./node_modules/.bin/electron --version")
  .toString().replace(/\s*$/g, "")
const os = require("os")
const arch = os.arch()
const platform = os.platform()

console.log(`electron version: ${electronVersion}`)
console.log(`platform: ${platform}`)
console.log(`arch: ${arch}`)

const scripts = {
  sqlite3: `./node_modules/.bin/electron-rebuild -m sqlite3`
}

function execScript(script) {
  console.log(script)
  const sh = spawn("sh")
  const input = new Readable()
  input.push(script)
  input.push(null)
  input.pipe(sh.stdin)
  sh.stdout.pipe(process.stdout)
  sh.stderr.pipe(process.stderr)
}

execScript("echo build sqlite3 for electron")
execScript(scripts.sqlite3)