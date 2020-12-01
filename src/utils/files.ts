export const hasSolidityExtension = (fileName: string) => {
  const extension = fileName.substr(fileName.length - 3, fileName.length)
  return extension.toLowerCase() === "sol" // || extension.toLowerCase() === 'yul'
}

export const getCleanedFileName = (filename: string) => {
  return filename.split("/").pop()
}
