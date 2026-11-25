import { Suspense } from "react";
import { BlogReaderSkeleton } from "@/components/BlogReaderSkeleton";

async function BlogContent({ params }: { params: Promise<{ blog: string }> }) {
  const { blog } = await params;
  return <BlogReaderSkeleton blogSlug={blog} />;
}

export default function BlogPage({
  params,
}: {
  params: Promise<{ blog: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Loading Reader...
        </div>
      }
    >
      <BlogContent params={params} />
    </Suspense>
  );
}
