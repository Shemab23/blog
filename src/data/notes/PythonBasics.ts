import { PrimitiveTypes } from "@/views/Python_basics/primitiveTypes";
import { registerBlog } from "../BlogRegistry";
import { TypeCasting } from "@/views/Python_basics/typeCasting";
import { PythonBasicsPage } from "@/views/Python_basics";

const IDS = {
  blog: "550e8400-e29b-41d4-a716-446655440000",
  topicVariables: "550e8400-e29b-41d4-a716-446655440001",
  subPrimitives: "550e8400-e29b-41d4-a716-446655440002",
  subTypeCasting: "550e8400-e29b-41d4-a716-446655440003",
};

registerBlog(
  {
    id: IDS.blog,
    slug: "python-basics",
    name: "Python Basics",
    version: "v1.0",
    recordedDate: "2026/07",
    tags: ["#Python", "#Fundamentals", "#Scripting"],
    recommendedIds: [],
    media: {
      coverImage: "/images/cover.jpg",
      logoImage: "/images/python.png",
      initials: "PB",
    },
    summary: {
      general:
        "A ground-up introduction to Python syntax, memory model, and data types.",
      sections: [
        {
          topic: "Primitive Types",
          scrollToId: IDS.subPrimitives,
          summary: "Integers, floats, strings, booleans, and dynamic binding.",
        },
        {
          topic: "Type Casting",
          scrollToId: IDS.subTypeCasting,
          summary:
            "Converting between types safely using int(), str(), and float().",
        },
      ],
    },
    tableOfContents: [
      {
        id: IDS.topicVariables,
        title: "1. Variables & Data Types",
        subTopics: [
          {
            id: IDS.subPrimitives,
            title: "1.1 Primitive Types",
            component: PrimitiveTypes,
          },
          {
            id: IDS.subTypeCasting,
            title: "1.2 Type Casting",
            component: TypeCasting,
          },
        ],
      },
    ],
    component: PythonBasicsPage,
  },
  ["#Fundamentals", "#Python"],
);
