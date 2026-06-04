import { Suspense } from "react"
import { IDELayout } from "@/components/portfolio/ide-layout"

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-[#1e1e1e]" />}>
      <IDELayout />
    </Suspense>
  )
}
