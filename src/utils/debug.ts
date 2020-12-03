const LOG = false // TODO Create a mechanism to only log on develop

export const log = (...args: any) => {
  if (LOG) console.log(args)
}
