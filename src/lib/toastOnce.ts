import { toast } from "sonner"

const DURATION = 6000

const activeToasts = new Set<string>()

export function toastOnce(id: string, message: string) {
  if (activeToasts.has(id)) return

  activeToasts.add(id)
  toast.warning(message)
  setTimeout(() => activeToasts.delete(id), DURATION)
}
