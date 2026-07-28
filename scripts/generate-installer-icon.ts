import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import sharp from 'sharp'

const root = process.cwd()
const source = resolve(root, 'assets', 'neocli-icon.svg')
const output = resolve(root, 'dist', 'windows', 'NeoCLI.ico')

mkdirSync(dirname(output), { recursive: true })
const png = await sharp(readFileSync(source)).resize(256, 256).png().toBuffer()

// ICO files may store a PNG image directly.
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)
header.writeUInt16LE(1, 10)
header.writeUInt16LE(32, 12)
header.writeUInt32LE(png.length, 14)
header.writeUInt32LE(22, 18)

writeFileSync(output, Buffer.concat([header, png]))
