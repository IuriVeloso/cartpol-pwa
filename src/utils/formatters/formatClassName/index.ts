type Classes = string | null | undefined | boolean

/**
 *
 * @returns A string with all the classes separated by a space
 * @example formatClassName(['hello', 'world']) // 'hello world'
 */
export function formatClassName(classes: Classes[]) {
  return classes.filter(Boolean).join(' ')
}
