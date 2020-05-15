'use strict'
const OrbitDB = require('orbit-db')
const { AccessControllers } = require('orbit-db')
const AccessVerifier = require('./AccessVerifier')

AccessControllers.addAccessController({ AccessController: AccessVerifier })

class Pinner {
  constructor (address) {
    require('./ipfsInstance').then(async (ipfs) => {
      this.orbitdb = await OrbitDB.createInstance(ipfs, {
        AccessControllers: AccessControllers
      })
      Pinner.openDatabase(this.orbitdb, address)
    }).catch(console.error)
  }

  drop () {
    // console.log(this.orbitdb)
    // this.orbitdb.disconnect()
  }

  static async openDatabase (orbitdb, address) {
    try {
      if (!OrbitDB.isValidAddress(address)) {
        console.log(`Failed to add ${address}. This is not a valid address`)
        return
      }

      console.log(`opening database from ${address}`)
      const db = await orbitdb.open(address, { sync: true })

      console.log('Listening for updates to the database...')
      await db.load()

      return db
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = Pinner
