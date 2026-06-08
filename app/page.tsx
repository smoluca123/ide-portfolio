import { Suspense } from "react"
import { IDELayout } from "@/components/portfolio/ide-layout"
import { SeoContent } from "@/components/seo-content"

export default function Home() {
  return (
    <>
      {/* Server-rendered, crawlable content. The interactive IDE below is client-only. */}
      <SeoContent />
      <main>
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-[#1e1e1e]" />}>
          <IDELayout />
        </Suspense>
      </main>
    </>
  )
}
