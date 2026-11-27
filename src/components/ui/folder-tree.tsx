import { FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

export type TreeNode = {
  name: string;
  /** Short explanation shown after the name */
  note?: string;
  /** Present (even empty) means it is a folder */
  children?: TreeNode[];
  highlight?: boolean;
};

function TreeItem({ node }: { node: TreeNode }) {
  const isFolder = node.children !== undefined;
  const Icon = isFolder ? Folder : FileText;

  return (
    <li>
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-2 py-0.5 text-sm",
          node.highlight && "font-semibold",
        )}
      >
        <Icon
          className={cn(
            "size-4 shrink-0",
            node.highlight ? "text-primary" : "text-muted-foreground",
          )}
        />
        <span className="font-mono">{node.name}</span>
        {node.note && (
          <span className="text-muted-foreground">← {node.note}</span>
        )}
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="ml-2 border-l pl-4">
          {node.children.map((child) => (
            <TreeItem key={child.name} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** A folder layout drawn from data. */
export function FolderTree({ root }: { root: TreeNode }) {
  return (
    <ul className="p-4">
      <TreeItem node={root} />
    </ul>
  );
}
