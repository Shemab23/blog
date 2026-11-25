import { GitInternalsPage } from "@/views/Git_internals";
import {
  BranchesAsPointers,
  ObjectsAndHashes,
  RebaseVsMerge,
  StagingIndex,
} from "@/views/Git_internals/sections";
import { registerBlog } from "../BlogRegistry";

const IDS = {
  blog: "660e8400-e29b-41d4-a716-446655440010",
  topicStorage: "660e8400-e29b-41d4-a716-446655440011",
  subBlobsTrees: "660e8400-e29b-41d4-a716-446655440012",
  subThreeTrees: "660e8400-e29b-41d4-a716-446655440013",
  topicBranching: "660e8400-e29b-41d4-a716-446655440014",
  subPointers: "660e8400-e29b-41d4-a716-446655440015",
  subRebaseMerge: "660e8400-e29b-41d4-a716-446655440016",
};

registerBlog(
  {
    id: IDS.blog,
    slug: "git-internals",
    name: "Git & Version Control Internals",
    version: "v1.1",
    recordedDate: "2026/08",
    tags: ["#Git", "#DevTools", "#Fundamentals"],
    // Links directly to your Python Basics blog in the "Recommended next" sidebar!
    recommendedIds: ["python-basics"],
    media: {
      // Leave coverImage & logoImage omitted to test your initials fallback!
      initials: "GI",
    },
    summary: {
      general:
        "How Git stores snapshots, manages the staging index, and moves branch pointers under the hood.",
      sections: [
        {
          topic: "Blobs, Trees & SHA-1 Hashes",
          scrollToId: IDS.subBlobsTrees,
          summary:
            "Content-addressable filesystem, blob snapshots, tree objects, and SHA-1 hashing.",
        },
        {
          topic: "The Three-Tree Architecture",
          scrollToId: IDS.subThreeTrees,
          summary:
            "Working directory, staging index, HEAD, and soft vs mixed vs hard reset.",
        },
        {
          topic: "Branches as Lightweight Pointers",
          scrollToId: IDS.subPointers,
          summary:
            "41-byte ref files in .git/refs/heads and symbolic HEAD references.",
        },
        {
          topic: "Interactive Rebase vs. Merge",
          scrollToId: IDS.subRebaseMerge,
          summary:
            "Three-way merge commits versus replaying linear history with interactive rebase.",
        },
      ],
    },
    tableOfContents: [
      {
        id: IDS.topicStorage,
        title: "1. Storage & Object Model",
        subTopics: [
          {
            id: IDS.subBlobsTrees,
            title: "1.1 Blobs, Trees & SHA-1 Hashes",
            component: ObjectsAndHashes,
          },
          {
            id: IDS.subThreeTrees,
            title: "1.2 The Three-Tree Architecture",
            component: StagingIndex,
          },
        ],
      },
      {
        id: IDS.topicBranching,
        title: "2. Branching & History",
        subTopics: [
          {
            id: IDS.subPointers,
            title: "2.1 Branches as Lightweight Pointers",
            component: BranchesAsPointers,
          },
          {
            id: IDS.subRebaseMerge,
            title: "2.2 Interactive Rebase vs. Merge",
            component: RebaseVsMerge,
          },
        ],
      },
    ],
    component: GitInternalsPage,
  },
  ["#Git", "#DevTools", "#Fundamentals"],
);
