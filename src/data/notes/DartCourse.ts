import { registerBlog } from "../BlogRegistry";
import { createElement } from "react";
import { RightSideSkeleton } from "@/components/BlogRightSkeleton";

import * as Ch0 from "@/views/Dart/setup";
import * as Ch1 from "@/views/Dart/variables_and_immutability";
import * as Ch2 from "@/views/Dart/functional_collections";
import * as Ch3 from "@/views/Dart/functions_and_classes";
import * as Ch4 from "@/views/Dart/extensions_and_operators";
import * as Ch5 from "@/views/Dart/generators_and_streams";
const slug = "dart-foundations";

const IDS = {
  topicCh0: `${slug}-ch0`,
  ch0_01: `${slug}-ch0-01`,
  ch0_02: `${slug}-ch0-02`,
  ch0_03: `${slug}-ch0-03`,
  ch0_04: `${slug}-ch0-04`,
  topicCh1: `${slug}-ch1`,
  ch1_01: `${slug}-ch1-01`,
  ch1_02: `${slug}-ch1-02`,
  ch1_03: `${slug}-ch1-03`,
  ch1_04: `${slug}-ch1-04`,
  ch1_05: `${slug}-ch1-05`,
  topicCh2: `${slug}-ch2`,
  ch2_01: `${slug}-ch2-01`,
  ch2_02: `${slug}-ch2-02`,
  ch2_03: `${slug}-ch2-03`,
  ch2_04: `${slug}-ch2-04`,
  ch2_05: `${slug}-ch2-05`,
  topicCh3: `${slug}-ch3`,
  ch3_01: `${slug}-ch3-01`,
  ch3_02: `${slug}-ch3-02`,
  ch3_03: `${slug}-ch3-03`,
  ch3_04: `${slug}-ch3-04`,
  ch3_05: `${slug}-ch3-05`,
  topicCh4: `${slug}-ch4`,
  ch4_01: `${slug}-ch4-01`,
  ch4_02: `${slug}-ch4-02`,
  ch4_03: `${slug}-ch4-03`,
  ch4_04: `${slug}-ch4-04`,
  topicCh5: `${slug}-ch5`,
  ch5_01: `${slug}-ch5-01`,
  ch5_02: `${slug}-ch5-02`,
  ch5_03: `${slug}-ch5-03`,
  ch5_04: `${slug}-ch5-04`,
  ch5_05: `${slug}-ch5-05`,
};

registerBlog({
  id: slug,
  slug,
  name: "Dart Programming Foundations",
  version: "v0.1",
  recordedDate: "2026/Nov",
  tags: [
    "#Dart",
    "#Flutter",
    "#NullSafety",
    "#OOP",
    "#FunctionalProgramming",
    "#AsyncProgramming",
    "#Streams",
    "#CLI",
    "#TypeSafety",
    "#Fundamentals",
  ],
  recommendedIds: [],
  media: {
    logoImage: "/blogs/dart/logo.png",
    coverImage: "/blogs/dart/cover.png",
    initials: "DF",
  },
  summary: {
    general:
      "A hands-on Dart curriculum covering lightweight CLI & Android setup, sound null safety, functional collections, OOP composition, extensions, and asynchronous streams—culminating in a live TCP socket telemetry system and streaming wallet ledger.",
    sections: [
      {
        topic: "0. Environment Setup & CLI Fundamentals",
        scrollToId: IDS.ch0_01,
        summary:
          "Audit existing tools, set up a lightweight Flutter & Android CLI environment without Android Studio, build interactive stdin/stdout programs, and organize multi-experiment CLI apps.",
      },
      {
        topic: "1. Variables, Immutability & Sound Null Safety",
        scrollToId: IDS.ch1_01,
        summary:
          "Master final vs. const immutability, type inference, string interpolation, null-aware operators, and safe collection lookups through a CLI Receipt & Invoice Formatter.",
      },
      {
        topic: "2. Collections, Functional Iteration & Exhaustive Enums",
        scrollToId: IDS.ch2_01,
        summary:
          "Transform typed Lists, Sets, and Maps with functional pipelines, model rich domain states using enhanced enums and exhaustive switch expressions, and build a Multi-Currency Expense Aggregator.",
      },
      {
        topic: "3. Functions, Constructors & Class Composition",
        scrollToId: IDS.ch3_01,
        summary:
          "Design flexible function signatures, generative and factory constructors, inheritance hierarchies, and reusable mixins & interfaces in a JSON-to-Object Ledger System.",
      },
      {
        topic: "4. Idiomatic Dart — Extensions & Operator Overloading",
        scrollToId: IDS.ch4_01,
        summary:
          "Extend existing types with safe parsing helpers, overload operators with covariant type safety, customize toString() output, and build a Smart Measurement & Money Toolkit.",
      },
      {
        topic: "5. Generators & Asynchronous Streams",
        scrollToId: IDS.ch5_01,
        summary:
          "Generate lazy sequences with sync*, master Futures and async/await, stream live events with async*, walk through the two-terminal Fleet Telemetry socket project, and build a Real-Time Streaming Wallet Ledger.",
      },
    ],
  },
  tableOfContents: [
    {
      id: IDS.topicCh0,
      title: "0. Environment Setup & CLI Fundamentals",
      subTopics: [
        {
          id: IDS.ch0_01,
          title: `0.1 ${Ch0.subtopics[0]}`,
          component: Ch0.Subtopic0_01,
        },
        {
          id: IDS.ch0_02,
          title: `0.2 ${Ch0.subtopics[1]}`,
          component: Ch0.Subtopic0_02,
        },
        {
          id: IDS.ch0_03,
          title: `0.3 ${Ch0.subtopics[2]}`,
          component: Ch0.Subtopic0_03,
        },
        {
          id: IDS.ch0_04,
          title: `0.4 ${Ch0.subtopics[3]}`,
          component: Ch0.Subtopic0_04,
        },
      ],
    },
    {
      id: IDS.topicCh1,
      title: "1. Variables, Immutability & Sound Null Safety",
      subTopics: [
        {
          id: IDS.ch1_01,
          title: `1.1 ${Ch1.subtopics[0]}`,
          component: Ch1.Subtopic1_01,
        },
        {
          id: IDS.ch1_02,
          title: `1.2 ${Ch1.subtopics[1]}`,
          component: Ch1.Subtopic1_02,
        },
        {
          id: IDS.ch1_03,
          title: `1.3 ${Ch1.subtopics[2]}`,
          component: Ch1.Subtopic1_03,
        },
        {
          id: IDS.ch1_04,
          title: `1.4 ${Ch1.subtopics[3]}`,
          component: Ch1.Subtopic1_04,
        },
        {
          id: IDS.ch1_05,
          title: `1.5 ${Ch1.subtopics[4]}`,
          component: Ch1.Subtopic1_05,
        },
      ],
    },
    {
      id: IDS.topicCh2,
      title: "2. Collections, Functional Iteration & Exhaustive Enums",
      subTopics: [
        {
          id: IDS.ch2_01,
          title: `2.1 ${Ch2.subtopics[0]}`,
          component: Ch2.Subtopic2_01,
        },
        {
          id: IDS.ch2_02,
          title: `2.2 ${Ch2.subtopics[1]}`,
          component: Ch2.Subtopic2_02,
        },
        {
          id: IDS.ch2_03,
          title: `2.3 ${Ch2.subtopics[2]}`,
          component: Ch2.Subtopic2_03,
        },
        {
          id: IDS.ch2_04,
          title: `2.4 ${Ch2.subtopics[3]}`,
          component: Ch2.Subtopic2_04,
        },
        {
          id: IDS.ch2_05,
          title: `2.5 ${Ch2.subtopics[4]}`,
          component: Ch2.Subtopic2_05,
        },
      ],
    },
    {
      id: IDS.topicCh3,
      title: "3. Functions, Constructors & Class Composition",
      subTopics: [
        {
          id: IDS.ch3_01,
          title: `3.1 ${Ch3.subtopics[0]}`,
          component: Ch3.Subtopic3_01,
        },
        {
          id: IDS.ch3_02,
          title: `3.2 ${Ch3.subtopics[1]}`,
          component: Ch3.Subtopic3_02,
        },
        {
          id: IDS.ch3_03,
          title: `3.3 ${Ch3.subtopics[2]}`,
          component: Ch3.Subtopic3_03,
        },
        {
          id: IDS.ch3_04,
          title: `3.4 ${Ch3.subtopics[3]}`,
          component: Ch3.Subtopic3_04,
        },
        {
          id: IDS.ch3_05,
          title: `3.5 ${Ch3.subtopics[4]}`,
          component: Ch3.Subtopic3_05,
        },
      ],
    },
    {
      id: IDS.topicCh4,
      title: "4. Idiomatic Dart — Extensions & Operator Overloading",
      subTopics: [
        {
          id: IDS.ch4_01,
          title: `4.1 ${Ch4.subtopics[0]}`,
          component: Ch4.Subtopic4_01,
        },
        {
          id: IDS.ch4_02,
          title: `4.2 ${Ch4.subtopics[1]}`,
          component: Ch4.Subtopic4_02,
        },
        {
          id: IDS.ch4_03,
          title: `4.3 ${Ch4.subtopics[2]}`,
          component: Ch4.Subtopic4_03,
        },
        {
          id: IDS.ch4_04,
          title: `4.4 ${Ch4.subtopics[3]}`,
          component: Ch4.Subtopic4_04,
        },
      ],
    },
    {
      id: IDS.topicCh5,
      title: "5. Generators & Asynchronous Streams",
      subTopics: [
        {
          id: IDS.ch5_01,
          title: `5.1 ${Ch5.subtopics[0]}`,
          component: Ch5.Subtopic5_01,
        },
        {
          id: IDS.ch5_02,
          title: `5.2 ${Ch5.subtopics[1]}`,
          component: Ch5.Subtopic5_02,
        },
        {
          id: IDS.ch5_03,
          title: `5.3 ${Ch5.subtopics[2]}`,
          component: Ch5.Subtopic5_03,
        },
        {
          id: IDS.ch5_04,
          title: `5.4 ${Ch5.subtopics[3]}`,
          component: Ch5.Subtopic5_04,
        },
        {
          id: IDS.ch5_05,
          title: `5.5 ${Ch5.subtopics[4]}`,
          component: Ch5.Subtopic5_05,
        },
      ],
    },
  ],
  component: () =>
    createElement(RightSideSkeleton, {
      targetSlug: slug,
    }),
});
