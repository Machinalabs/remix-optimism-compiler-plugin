export interface Source {
  [fileName: string]: {
    // Optional: keccak256 hash of the source file
    keccak256?: string
    // Required (unless "urls" is used): literal contents of the source file
    content: string
    urls?: string[]
  }
}

export type Language = "Solidity" | "Yul"

export enum LanguageEnum {
  Solidity = "Solidity"
}

export interface SourceWithTarget {
  sources?: Source
  target?: string | null | undefined
}

export enum EVMVersionEnum {
  default = "default",
  istanbul = "istanbul",
  petersburg = "petersburg",
  constantinople = "constantinople",
  byzantium = "byzantium",
  spuriousDragon = "spuriousDragon",
  tangerineWhistle = "tangerineWhistle",
  homestead = "homestead",
}

export type EVMVersion =
  | "homestead"
  | "tangerineWhistle"
  | "spuriousDragon"
  | "byzantium"
  | "constantinople"
  | "petersburg"
  | "istanbul"
  | "muirGlacier"
  | null

export interface CompilerInputOptions {
  optimize: boolean | number
  runs: number
  libraries?: {
    [fileName: string]: Record<string, string>
  }
  evmVersion?: EVMVersion
  language?: Language
}