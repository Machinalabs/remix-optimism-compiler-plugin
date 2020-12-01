// getCompilerVersionFromPragma
// if (!this.data.allversions) return
//     this.compileTabLogic.fileManager.readFile(filename).then(data => {
//       const pragmaArr = data.match(/(pragma solidity (.+?);)/g)
//       if (pragmaArr && pragmaArr.length === 1) {
//         const pragmaStr = pragmaArr[0].replace('pragma solidity', '').trim()
//         const pragma = pragmaStr.substring(0, pragmaStr.length - 1)
//         const releasedVersions = this.data.allversions.filter(obj => !obj.prerelease).map(obj => obj.version)
//         const allVersions = this.data.allversions.map(obj => this._retrieveVersion(obj.version))
//         const currentCompilerName = this._retrieveVersion(this._view.versionSelector.selectedOptions[0].label)
//         // contains only numbers part, for example '0.4.22'
//         const pureVersion = this._retrieveVersion()
//         // is nightly build newer than the last release
//         const isNewestNightly = currentCompilerName.includes('nightly') && semver.gt(pureVersion, releasedVersions[0])
//         // checking if the selected version is in the pragma range
//         const isInRange = semver.satisfies(pureVersion, pragma)
//         // checking if the selected version is from official compilers list(excluding custom versions) and in range or greater
//         const isOfficial = allVersions.includes(currentCompilerName)
//         if (isOfficial && (!isInRange && !isNewestNightly)) {
//           const compilerToLoad = semver.maxSatisfying(releasedVersions, pragma)
//           const compilerPath = this.data.allversions.filter(obj => !obj.prerelease && obj.version === compilerToLoad)[0].path
//           if (this.data.selectedVersion !== compilerPath) {
//             this.data.selectedVersion = compilerPath
//             this._updateVersionSelector()
//           }
//         }
//       }
//     })

export const getCompilerVersionFromPragma = () => {
  // TODO
  return ""
}
