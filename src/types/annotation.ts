export interface Annotation extends Error {
  row: number
  column: number
  text: string
  type: "error" | "warning" | "information"
}
