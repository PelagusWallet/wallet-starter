export function wait(duration: number) {
  return new Promise<void>((res) =>
    setTimeout(() => {
      res()
    }, duration)
  )
}
