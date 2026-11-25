import React from "react";

export function ObjectsAndHashes() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">
        1.1 Blobs, Trees &amp; SHA-1 Hashes
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        At its core, Git is a content-addressable filesystem. Instead of storing
        file diffs, Git snapshots file contents as{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          blob
        </code>{" "}
        objects and directory structures as{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          tree
        </code>{" "}
        objects, indexing each by a 40-character SHA-1 hash inside{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          .git/objects
        </code>
        .
      </p>
      <pre className="p-4 rounded-lg border border-border bg-card overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{`# Inspect any raw Git object by its hash
git cat-file -t 8ab686e   # Outputs: blob | tree | commit
git cat-file -p 8ab686e   # Prints the actual stored content`}</code>
      </pre>
    </div>
  );
}

export function StagingIndex() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">1.2 The Three-Tree Architecture</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Every Git workflow moves changes across three distinct trees: your{" "}
        <strong>Working Directory</strong> (local files on disk), the{" "}
        <strong>Staging Index</strong> (
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          .git/index
        </code>
        ), and <strong>HEAD</strong> (the last commit snapshot). Understanding
        this boundary makes{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          git reset
        </code>{" "}
        predictable.
      </p>
      <pre className="p-4 rounded-lg border border-border bg-card overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{`git reset --soft HEAD~1   # Moves HEAD only (keeps Index & Working Dir)
git reset --mixed HEAD~1  # Resets HEAD + Index (keeps Working Dir)
git reset --hard HEAD~1   # Resets all three trees`}</code>
      </pre>
    </div>
  );
}

export function BranchesAsPointers() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">
        2.1 Branches as Lightweight Pointers
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Creating a branch in Git does not copy files—it simply writes a 41-byte
        text file inside{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          .git/refs/heads/
        </code>{" "}
        containing the commit hash it points to. Meanwhile,{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          HEAD
        </code>{" "}
        is a symbolic reference pointing to your active branch.
      </p>
      <pre className="p-4 rounded-lg border border-border bg-card overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{`cat .git/HEAD
# ref: refs/heads/main

cat .git/refs/heads/main
# 9f3c21a8b4d0e71c5a2f98d12b4c6e8f0a1b2c3d`}</code>
      </pre>
    </div>
  );
}

export function RebaseVsMerge() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">
        2.2 Interactive Rebase vs. Merge
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        A three-way{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          git merge
        </code>{" "}
        preserves exact chronological history by creating a merge commit with
        two parents. Conversely,{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
          git rebase
        </code>{" "}
        replays your commits onto a new base commit, creating a clean linear
        history—ideal for local feature branches before opening a pull request.
      </p>
      <pre className="p-4 rounded-lg border border-border bg-card overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{`# Squash or reword the last 3 local commits before pushing
git rebase -i HEAD~3`}</code>
      </pre>
    </div>
  );
}
