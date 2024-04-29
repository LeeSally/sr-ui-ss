const { exeSync, execSync } = require('child_process')
const fs = require('fs')
const { extname } = require('path')
const path = require('path')

const exportFrom = function (fromPath) {
  const packagesDir = path.resolve(fromPath, 'packages')

  if (!fs.statSync(packagesDir).isDirectory()) {
    // not directory
    return
  }

  const pkgNames = fs.readdirSync(packagesDir)
  pkgNames.map(pkg => {
    const esDir = `${packagesDir}/${pkg}/es`
    const esDest = path.resolve(`../packages/${pkg}/es/`)
    if (!fs.existsSync(esDest)) {
      execSync(`mkdir ${esDest}`)
      console.log(`mkdir ... ${esDest}`)
    }

    fs.copyFileSync(esDir, esDest)
    console.log(esDir, esDest)

    const pkgJsonFileSrc = `${packagesDir}/`
    const pkgJsonDest = path.resolve(`../packages/${pkg}`)
    fs.copyFileSync(pkgJsonFileSrc, pkgJsonDest)
    console.log(pkgJsonFileSrc, pkgJsonDest)
  })
}

exportFrom("D:/proj/react/sr-ui/")