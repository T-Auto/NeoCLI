import { existsSync, rmSync } from 'fs'
import { resolve } from 'path'

const root = process.cwd()
const packageJson = await Bun.file(resolve(root, 'package.json')).json() as { version: string }
const outputDir = resolve(root, 'dist', 'windows')
const isccCandidates = [process.env.INNO_SETUP_COMPILER, 'C:/Program Files (x86)/Inno Setup 6/ISCC.exe', 'C:/Program Files/Inno Setup 6/ISCC.exe'].filter((candidate): candidate is string => Boolean(candidate))
const iscc = isccCandidates.find(existsSync)
if (!iscc) throw new Error('Inno Setup 6 is required to build setup.exe. Install it, or set INNO_SETUP_COMPILER to ISCC.exe.')
rmSync(outputDir, { recursive: true, force: true })
const appBuild = Bun.spawnSync({ cmd: ['bun', 'run', './scripts/build.ts', '--compile', '--windows-installer'], cwd: root, stdout: 'inherit', stderr: 'inherit' })
if (appBuild.exitCode !== 0) process.exit(appBuild.exitCode ?? 1)
const installerBuild = Bun.spawnSync({ cmd: [iscc, `/DMyAppVersion=${packageJson.version}`, './installer/NeoCLI.iss'], cwd: root, stdout: 'inherit', stderr: 'inherit' })
process.exit(installerBuild.exitCode ?? 1)
