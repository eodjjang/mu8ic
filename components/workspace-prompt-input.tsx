"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUp,
  BrainCog,
  FolderCode,
  Globe,
  Mic,
  Paperclip,
  Square,
  StopCircle,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* —— Textarea —— */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={1}
    className={cn(
      "workspace-prompt-textarea flex min-h-[44px] w-full resize-none rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"

/* —— Tooltip —— */
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[60] overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-sm text-white shadow-md",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

/* —— Dialog —— */
const Dialog = DialogPrimitive.Root
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border border-[#333333] bg-[#1F2023] p-0 shadow-xl duration-300 md:max-w-[800px]",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-[#2E3033]/80 p-2 transition-all hover:bg-[#2E3033]">
        <X className="h-5 w-5 text-gray-200 hover:text-white" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-gray-100", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/* —— Button —— */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-white text-black hover:bg-white/80",
      outline: "border border-[#444444] bg-transparent hover:bg-[#3A3A40]",
      ghost: "bg-transparent hover:bg-[#3A3A40]",
    }
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6",
      icon: "aspect-[1/1] h-8 w-8 rounded-full",
    }
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

/* —— Voice visualizer —— */
function VoiceRecorderPanel({
  seconds,
  visualizerBars = 32,
}: {
  seconds: number
  visualizerBars?: number
}) {
  const heights = React.useMemo(
    () => Array.from({ length: visualizerBars }, (_, i) => 15 + ((i * 17) % 85)),
    [visualizerBars]
  )
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex w-full flex-col items-center justify-center py-3 opacity-100 transition-all duration-300">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="font-mono text-sm text-white/80">{formatTime(seconds)}</span>
      </div>
      <div className="flex h-10 w-full items-center justify-center gap-0.5 px-4">
        {heights.map((h, i) => (
          <div
            key={i}
            className="w-0.5 animate-pulse rounded-full bg-white/50"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + (i % 5) * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* —— Image dialog —— */
function ImageViewDialog({ imageUrl, onClose }: { imageUrl: string | null; onClose: () => void }) {
  return (
    <Dialog open={imageUrl !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] border-none bg-transparent p-0 shadow-none md:max-w-[800px]">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl bg-[#1F2023] shadow-2xl"
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Full preview"
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          ) : null}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

/* —— Prompt context —— */
type PromptInputContextType = {
  isLoading: boolean
  value: string
  setValue: (value: string) => void
  maxHeight: number | string
  onSubmit?: () => void
  disabled?: boolean
}

const PromptInputContext = React.createContext<PromptInputContextType | null>(null)

function usePromptInput() {
  const context = React.useContext(PromptInputContext)
  if (!context) throw new Error("usePromptInput must be used within PromptInput")
  return context
}

type PromptInputProps = {
  isLoading?: boolean
  value?: string
  onValueChange?: (value: string) => void
  maxHeight?: number | string
  onSubmit?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      isLoading = false,
      maxHeight = 240,
      value: valueProp,
      onValueChange,
      onSubmit,
      children,
      disabled = false,
      onDragOver,
      onDragLeave,
      onDrop,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState("")
    const isControlled = valueProp !== undefined
    const value = isControlled ? valueProp! : internalValue
    const setValue = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange]
    )

    return (
      <TooltipProvider delayDuration={300}>
        <PromptInputContext.Provider
          value={{
            isLoading,
            value,
            setValue,
            maxHeight,
            onSubmit,
            disabled,
          }}
        >
          <div
            ref={ref}
            className={cn(
              "rounded-3xl border-none bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300",
              className
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    )
  }
)
PromptInput.displayName = "PromptInput"

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  placeholder,
  ...props
}: React.ComponentProps<typeof Textarea> & {
  disableAutosize?: boolean
  placeholder?: string
}) {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return
    textareaRef.current.style.height = "auto"
    const el = textareaRef.current
    const cap =
      typeof maxHeight === "number"
        ? `${Math.min(el.scrollHeight, maxHeight)}px`
        : `min(${el.scrollHeight}px, ${maxHeight})`
    el.style.height = cap
  }, [value, maxHeight, disableAutosize])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
    onKeyDown?.(e)
  }

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("text-base", className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  )
}

function PromptInputActions({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: Omit<React.ComponentProps<typeof Tooltip>, "children"> & {
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}) {
  const { disabled } = usePromptInput()
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

function CustomDivider() {
  return (
    <div className="relative mx-1 h-6 w-[1.5px]">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-[#9b87f5]/70 to-transparent"
        style={{
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)",
        }}
      />
    </div>
  )
}

/* —— Main box —— */
export type PromptInputBoxProps = {
  onSend?: (message: string, files?: File[]) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>(
  function PromptInputBox(
    { onSend = () => {}, isLoading = false, placeholder = "Type your message here...", className },
    ref
  ) {
    const [input, setInput] = React.useState("")
    const [files, setFiles] = React.useState<File[]>([])
    const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({})
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
    const [isRecording, setIsRecording] = React.useState(false)
    const [recordSeconds, setRecordSeconds] = React.useState(0)
    const [showSearch, setShowSearch] = React.useState(false)
    const [showThink, setShowThink] = React.useState(false)
    const [showCanvas, setShowCanvas] = React.useState(false)
    const uploadInputRef = React.useRef<HTMLInputElement>(null)
    const promptBoxRef = React.useRef<HTMLDivElement>(null)
    const mergedRef = ref ?? promptBoxRef

    React.useEffect(() => {
      if (!isRecording) {
        setRecordSeconds(0)
        return
      }
      const id = window.setInterval(() => setRecordSeconds((s) => s + 1), 1000)
      return () => window.clearInterval(id)
    }, [isRecording])

    const handleToggleChange = (value: string) => {
      if (value === "search") {
        setShowSearch((prev) => !prev)
        setShowThink(false)
      } else if (value === "think") {
        setShowThink((prev) => !prev)
        setShowSearch(false)
      }
    }

    const handleCanvasToggle = () => setShowCanvas((prev) => !prev)

    const isImageFile = (file: File) => file.type.startsWith("image/")

    const processFile = React.useCallback((file: File) => {
      if (!isImageFile(file)) return
      if (file.size > 10 * 1024 * 1024) return
      setFiles([file])
      const reader = new FileReader()
      reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string })
      reader.readAsDataURL(file)
    }, [])

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const dropped = Array.from(e.dataTransfer.files)
        const imageFiles = dropped.filter((f) => isImageFile(f))
        if (imageFiles.length > 0) processFile(imageFiles[0])
      },
      [processFile]
    )

    const handleRemoveFile = (index: number) => {
      const fileToRemove = files[index]
      if (fileToRemove && filePreviews[fileToRemove.name]) setFilePreviews({})
      setFiles([])
    }

    const handlePaste = React.useCallback(
      (e: ClipboardEvent) => {
        const items = e.clipboardData?.items
        if (!items) return
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile()
            if (file) {
              e.preventDefault()
              processFile(file)
              break
            }
          }
        }
      },
      [processFile]
    )

    React.useEffect(() => {
      document.addEventListener("paste", handlePaste)
      return () => document.removeEventListener("paste", handlePaste)
    }, [handlePaste])

    const handleSubmit = () => {
      if (!input.trim() && files.length === 0) return
      let messagePrefix = ""
      if (showSearch) messagePrefix = "[Search: "
      else if (showThink) messagePrefix = "[Think: "
      else if (showCanvas) messagePrefix = "[Canvas: "
      const formattedInput = messagePrefix ? `${messagePrefix}${input}]` : input
      onSend(formattedInput, files)
      setInput("")
      setFiles([])
      setFilePreviews({})
    }

    const handleStopRecording = () => {
      const duration = recordSeconds
      setIsRecording(false)
      onSend(`[Voice message - ${duration} seconds]`, [])
    }

    const hasContent = input.trim() !== "" || files.length > 0

    const primaryAction = () => {
      if (isRecording) handleStopRecording()
      else if (hasContent) handleSubmit()
      else setIsRecording(true)
    }

    return (
      <>
        <PromptInput
          ref={mergedRef}
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className={cn(
            "w-full border-none bg-[#1F2023] shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300 ease-in-out",
            className
          )}
          disabled={isLoading || isRecording}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {files.length > 0 && !isRecording ? (
            <div className="flex flex-wrap gap-2 pb-1 transition-all duration-300">
              {files.map((file, index) => (
                <div key={index} className="group relative">
                  {file.type.startsWith("image/") && filePreviews[file.name] ? (
                    <div
                      className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl transition-all duration-300"
                      onClick={() => setSelectedImage(filePreviews[file.name])}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setSelectedImage(filePreviews[file.name])
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={filePreviews[file.name]}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile(index)
                        }}
                        className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <div
            className={cn(
              "transition-all duration-300",
              isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100"
            )}
          >
            <PromptInputTextarea
              placeholder={
                showSearch
                  ? "Search the web..."
                  : showThink
                    ? "Think deeply..."
                    : showCanvas
                      ? "Create on canvas..."
                      : placeholder
              }
              className="text-base"
            />
          </div>

          {isRecording ? <VoiceRecorderPanel seconds={recordSeconds} /> : null}

          <PromptInputActions className="flex items-center justify-between gap-2 p-0 pt-2">
            <div
              className={cn(
                "flex items-center gap-1 transition-opacity duration-300",
                isRecording ? "invisible h-0 opacity-0" : "visible opacity-100"
              )}
            >
              <PromptInputAction tooltip="Upload image">
                <button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-gray-600/30 hover:text-[#D1D5DB]"
                  disabled={isRecording}
                >
                  <Paperclip className="h-5 w-5 transition-colors" />
                  <input
                    ref={uploadInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) processFile(e.target.files[0])
                      e.target.value = ""
                    }}
                  />
                </button>
              </PromptInputAction>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleToggleChange("search")}
                  className={cn(
                    "flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all",
                    showSearch
                      ? "border-[#1EAEDB] bg-[#1EAEDB]/15 text-[#1EAEDB]"
                      : "border-transparent bg-transparent text-[#9CA3AF] hover:text-[#D1D5DB]"
                  )}
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <motion.div
                      animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }}
                      whileHover={{
                        rotate: showSearch ? 360 : 15,
                        scale: 1.1,
                        transition: { type: "spring", stiffness: 300, damping: 10 },
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    >
                      <Globe className={cn("h-4 w-4", showSearch ? "text-[#1EAEDB]" : "text-inherit")} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {showSearch ? (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 overflow-hidden whitespace-nowrap text-xs text-[#1EAEDB]"
                      >
                        Search
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>

                <CustomDivider />

                <button
                  type="button"
                  onClick={() => handleToggleChange("think")}
                  className={cn(
                    "flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all",
                    showThink
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#8B5CF6]"
                      : "border-transparent bg-transparent text-[#9CA3AF] hover:text-[#D1D5DB]"
                  )}
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <motion.div
                      animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }}
                      whileHover={{
                        rotate: showThink ? 360 : 15,
                        scale: 1.1,
                        transition: { type: "spring", stiffness: 300, damping: 10 },
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    >
                      <BrainCog className={cn("h-4 w-4", showThink ? "text-[#8B5CF6]" : "text-inherit")} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {showThink ? (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 overflow-hidden whitespace-nowrap text-xs text-[#8B5CF6]"
                      >
                        Think
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>

                <CustomDivider />

                <button
                  type="button"
                  onClick={handleCanvasToggle}
                  className={cn(
                    "flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all",
                    showCanvas
                      ? "border-[#F97316] bg-[#F97316]/15 text-[#F97316]"
                      : "border-transparent bg-transparent text-[#9CA3AF] hover:text-[#D1D5DB]"
                  )}
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <motion.div
                      animate={{ rotate: showCanvas ? 360 : 0, scale: showCanvas ? 1.1 : 1 }}
                      whileHover={{
                        rotate: showCanvas ? 360 : 15,
                        scale: 1.1,
                        transition: { type: "spring", stiffness: 300, damping: 10 },
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    >
                      <FolderCode className={cn("h-4 w-4", showCanvas ? "text-[#F97316]" : "text-inherit")} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {showCanvas ? (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 overflow-hidden whitespace-nowrap text-xs text-[#F97316]"
                      >
                        Canvas
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            <PromptInputAction
              tooltip={
                isLoading
                  ? "Stop generation"
                  : isRecording
                    ? "Stop recording"
                    : hasContent
                      ? "Send message"
                      : "Voice message"
              }
            >
              <Button
                variant="default"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-200",
                  isRecording
                    ? "bg-transparent text-red-500 hover:bg-gray-600/30 hover:text-red-400"
                    : hasContent
                      ? "bg-white text-[#1F2023] hover:bg-white/80"
                      : "bg-transparent text-[#9CA3AF] hover:bg-gray-600/30 hover:text-[#D1D5DB]"
                )}
                onClick={primaryAction}
                disabled={isLoading && !hasContent}
              >
                {isLoading ? (
                  <Square className="h-4 w-4 animate-pulse fill-[#1F2023] text-[#1F2023]" />
                ) : isRecording ? (
                  <StopCircle className="h-5 w-5 text-red-500" />
                ) : hasContent ? (
                  <ArrowUp className="h-4 w-4 text-[#1F2023]" />
                ) : (
                  <Mic className="h-5 w-5 text-[#9CA3AF] transition-colors" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>

        <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      </>
    )
  }
)
PromptInputBox.displayName = "PromptInputBox"

/** Fixed dock for workspace page — prompt bar pinned to bottom */
export function WorkspacePromptDock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 md:px-8",
        className
      )}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-3xl">
        <PromptInputBox />
      </div>
    </div>
  )
}
