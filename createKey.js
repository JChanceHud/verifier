const {Wallet} = require('@ethersproject/wallet')
const fs = require('fs/promises')
const path = require('path')

const KEY = 'L1_WALLET_KEY'
const cfg = path.join(__dirname, 'docker-compose.env')

;(async () => {
  const wallet = Wallet.createRandom()
  const address = await wallet.getAddress()
  const key = wallet.privateKey

  const file = await fs.readFile(cfg, 'utf-8')
  const lines = file.split('\n')

  const out = []
  for (let line of lines) {
    if (line.startsWith(KEY)) {
      const [,key] = line.split('=')
      const w = new Wallet(key)
      const addr = await w.getAddress()
      console.log(`Fund the address ${addr}`)
      process.exit(0)
    }
    if (line.startsWith(`#${KEY}=`))
      line = `${KEY}=${key}`;
    out.push(line)
  }
  await fs.writeFile(cfg, out.join('\n'), 'utf-8')
  console.log(`Fund the address ${address}`)
})().catch(err => {
  console.log(err)
  process.exit(1)
})
