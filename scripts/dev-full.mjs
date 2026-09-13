import { spawn } from 'node:child_process'
import process from 'node:process'

const isWindows = process.platform === 'win32'
const npmCommand = isWindows ? 'npm.cmd' : 'npm'

const children = [
  spawn(npmCommand, ['run', 'server:dev'], { stdio: 'inherit', shell: false }),
  spawn(npmCommand, ['run', 'dev'], { stdio: 'inherit', shell: false }),
]

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill()
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('exit', shutdown)

for (const child of children) {
  child.on('error', (error) => {
    console.error(`Could not start development process: ${error.message}`)
    console.error('You can always run "npm run server:dev" and "npm run dev" in two terminals.')
  })
}
