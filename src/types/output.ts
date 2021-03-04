/////////
// ABI //
/////////
export type ABIDescription = FunctionDescription | EventDescription

export interface FunctionDescription {
  /** Type of the method. default is 'function' */
  type?: "function" | "constructor" | "fallback"
  /** The name of the function. Constructor and fallback function never have name */
  name?: string
  /** List of parameters of the method. Fallback function doesn’t have inputs. */
  inputs?: ABIParameter[]
  /** List of the outputs parameters for the method, if any */
  outputs?: ABIParameter[]
  /** State mutability of the method */
  stateMutability: "pure" | "view" | "nonpayable" | "payable"
  /** true if function accepts Ether, false otherwise. Default is false */
  payable?: boolean
  /** true if function is either pure or view, false otherwise. Default is false  */
  constant?: boolean
}

export interface EventDescription {
  type: "event"
  name: string
  inputs: ABIParameter &
    {
      /** true if the field is part of the log’s topics, false if it one of the log’s data segment. */
      indexed: boolean
    }[]
  /** true if the event was declared as anonymous. */
  anonymous: boolean
}

export interface ABIParameter {
  /** The name of the parameter */
  name: string
  /** The canonical type of the parameter */
  type: ABITypeParameter
  /** Used for tuple types */
  components?: ABIParameter[]
}

export type ABITypeParameter =
  | "uint"
  | "uint[]" // TODO : add <M>
  | "int"
  | "int[]" // TODO : add <M>
  | "address"
  | "address[]"
  | "bool"
  | "bool[]"
  | "fixed"
  | "fixed[]" // TODO : add <M>
  | "ufixed"
  | "ufixed[]" // TODO : add <M>
  | "bytes"
  | "bytes[]" // TODO : add <M>
  | "function"
  | "function[]"
  | "tuple"
  | "tuple[]"
  | string // Fallback

///////////////////////////
// NATURAL SPECIFICATION //
///////////////////////////

// Userdoc
export interface UserDocumentation {
  methods: UserMethodList
  notice: string
}

export type UserMethodList = {
  [functionIdentifier: string]: UserMethodDoc
} & {
  constructor?: string
}
export interface UserMethodDoc {
  notice: string
}

// Devdoc
export interface DeveloperDocumentation {
  author: string
  title: string
  details: string
  methods: DevMethodList
}

export interface DevMethodList {
  [functionIdentifier: string]: DevMethodDoc
}

export interface DevMethodDoc {
  author: string
  details: string
  return: string
  params: {
    [param: string]: string
  }
}

//////////////
// BYTECODE //
//////////////
export interface BytecodeObject {
  /** The bytecode as a hex string. */
  object: string
  /** Opcodes list */
  opcodes: string
  /** The source mapping as a string. See the source mapping definition. */
  sourceMap: string
  /** If given, this is an unlinked object. */
  linkReferences?: {
    [contractName: string]: {
      /** Byte offsets into the bytecode. */
      [library: string]: { start: number; length: number }[]
    }
  }
}
