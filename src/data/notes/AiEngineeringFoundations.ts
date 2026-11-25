import { AiEngineeringFoundationsPage } from "@/views/AiEnginerringFoundations";
import {
  ModelProviderWrapper,
  EnvironmentSecrets,
  ChoosingWrapper,
  SmokeTest,
} from "@/views/AiEnginerringFoundations/Boarding";
import {
  WhatIsAnLlm,
  SoftmaxTemperature,
  RolesSystemPrompt,
  ConversationHistory,
  Tokens,
  CountingTokensCost,
  SlidingWindow,
  Summarisation,
  Streaming,
  OneClassOwnsState,
  ProjectClientIntakeBot,
} from "@/views/AiEnginerringFoundations/ChatBot";
import {
  SentimentPromptEngineering,
  Nli,
  Bert,
  PipelineModels,
  ChoosingApproach,
  ClassifierEvaluation,
  ProjectInboxTriage,
} from "@/views/AiEnginerringFoundations/Classifier";
import {
  WhatAreEmbeddings,
  SentenceTransformers,
  SemanticSearchLayout,
  EmbeddingPitfalls,
  ProjectGigRadar,
} from "@/views/AiEnginerringFoundations/Embeddings";
import { registerBlog } from "../BlogRegistry";

const IDS = {
  blog: "0f7ebe1f-cf45-4cbf-ac4d-5ea912ccd68c",

  // Chapters
  chBoarding: "6c564ce1-5223-405a-886b-453b2cb88656",
  chChatbot: "aee0a455-3fb0-4d82-8790-c503776dcec2",
  chClassifier: "8498bc64-2b6d-4f54-aa37-01210175fcac",
  chEmbeddings: "3f42c5a6-2791-4a28-8844-24753c1e9dcd",

  // 1. Boarding
  s11: "ac4ea12a-7bac-4aa4-9ee0-5b56a78f27fc",
  s12: "96a72d32-4fd5-4a3b-9a3b-8b9c8930af56",
  s13: "67483e6a-25d7-4e0e-996a-3e0450794e2b",
  s14: "fefa81c0-0731-414d-bcc7-b45336a6567b",

  // 2. Planet Chatbot
  s21: "85506c82-ce73-48c8-9c94-334c3f55e9e9",
  s22: "d123847c-39f3-4ce0-b171-4b5d2e6b42c0",
  s23: "fae36821-bfc2-482d-a9f9-96f2dc0b5459",
  s24: "64be8285-d9ff-43b9-82da-86acf7d6cb28",
  s25: "2e6f2717-7062-4486-8793-abe02c44fed2",
  s26: "3d35ac65-125d-4f02-9efc-48ca28714639",
  s27: "44707dc4-2a92-448c-9824-ac553a1694a2",
  s28: "90740770-332f-4ed5-b820-820da1387a71",
  s29: "ea5b960c-d9d2-4b17-a680-f8c15fb32461",
  s210: "5f4e4efc-bfdf-4f5e-83e8-8b3aeed155c2",
  s211: "58fa126b-625e-4dca-89b6-7389e5367dd9",

  // 3. Planet Classifier
  s31: "bd689064-8494-425a-91ac-82bc7f224351",
  s32: "c462ddb0-4841-418f-a67d-5edbfb9befbe",
  s33: "6aaf6c11-9559-4d1a-a7d7-1925fa2a4cb8",
  s34: "ec43e46e-9ae7-4ab0-8954-3e12f63851ab",
  s35: "5916b283-250e-4c00-abbd-71f93c9ebd29",
  s36: "dd9fb0cf-9f3f-4b05-b429-1a4ed435afdd",
  s37: "a2732365-b829-47e2-a3aa-e8720afa260d",

  // 4. Planet Embeddings
  s41: "0cc43bee-2f4b-4263-85fd-7c8152ea0802",
  s42: "5fa7b902-61d1-425a-9ff2-27d5e697fa9d",
  s43: "3603f756-bebc-43ed-bcb6-7eb01da76f19",
  s44: "a7776ee0-347b-4ccf-bcfa-d7236bb1addc",
  s45: "b9f5760d-54cb-4105-973e-a8af97d2143e",
};

registerBlog(
  {
    id: IDS.blog,
    slug: "ai-engineering-foundations",
    name: "AI Engineering I: LLM Foundations",
    version: "v1.0",
    recordedDate: "2026/11",
    tags: ["#AI", "#LLM", "#PromptEngineering", "#Embeddings", "#Python"],
    recommendedIds: [], // add Series 2 and 3 IDs once those blogs exist
    media: {
      coverImage: "/blogs/ai-engineering-foundations/cover.jpg",
      logoImage: "/blogs/ai-engineering-foundations/logo.png",
      initials: "AF",
    },
    summary: {
      general:
        "From first principles: how language models work, how to talk to them in code, how to label text, and how to compare meaning with embeddings. Four planets, three projects.",
      sections: [
        {
          topic: "1. Boarding",
          scrollToId: IDS.chBoarding,
          summary:
            "1.1: model, weights, Hugging Face, provider, Groq, wrapper, SDK, local vs hosted, free tier. 1.2: virtual environment, venv, pip install, API key, .env, .gitignore, dotenv, secrets, Python 3.12. 1.3: HTTP request, curl, openai SDK, base_url, ChatGroq, LangChain, HumanMessage, SystemMessage. 1.4: smoke test, usage, prompt_tokens, 401, 404, 429 rate limit.",
        },
        {
          topic: "2. Planet Chatbot",
          scrollToId: IDS.chChatbot,
          summary:
            "2.1: LLM, next-token probability. 2.2: softmax, temperature. 2.3: roles, system prompt. 2.4: conversation history. 2.5: tokens. 2.6: cost. 2.7: sliding window. 2.8: summarisation. 2.9: streaming. 2.10: class design. 2.11: project Client Intake Bot.",
        },
        {
          topic: "3. Planet Classifier",
          scrollToId: IDS.chClassifier,
          summary:
            "3.1: sentiment, few-shot. 3.2: NLI. 3.3: BERT. 3.4: pipeline. 3.5: approach comparison. 3.6: evaluation. 3.7: project Inbox Triage.",
        },
        {
          topic: "4. Planet Embeddings",
          scrollToId: IDS.chEmbeddings,
          summary:
            "4.1: embeddings, cosine similarity. 4.2: sentence-transformers. 4.3: semantic search. 4.4: pitfalls. 4.5: project Gig Radar.",
        },
      ],
    },
    tableOfContents: [
      {
        id: IDS.chBoarding,
        title: "1. Boarding: Setup and Mental Model",
        subTopics: [
          {
            id: IDS.s11,
            title: "1.1 Model, provider and wrapper",
            component: ModelProviderWrapper,
          },
          {
            id: IDS.s12,
            title: "1.2 Environment and secrets",
            component: EnvironmentSecrets,
          },
          {
            id: IDS.s13,
            title: "1.3 Choosing a wrapper",
            component: ChoosingWrapper,
          },
          { id: IDS.s14, title: "1.4 Smoke test", component: SmokeTest },
        ],
      },
      {
        id: IDS.chChatbot,
        title: "2. Planet Chatbot",
        subTopics: [
          { id: IDS.s21, title: "2.1 What an LLM is", component: WhatIsAnLlm },
          {
            id: IDS.s22,
            title: "2.2 Softmax and temperature",
            component: SoftmaxTemperature,
          },
          {
            id: IDS.s23,
            title: "2.3 Roles and the system prompt",
            component: RolesSystemPrompt,
          },
          {
            id: IDS.s24,
            title: "2.4 Conversation history",
            component: ConversationHistory,
          },
          { id: IDS.s25, title: "2.5 Tokens", component: Tokens },
          {
            id: IDS.s26,
            title: "2.6 Counting tokens and cost",
            component: CountingTokensCost,
          },
          {
            id: IDS.s27,
            title: "2.7 Context management A: the sliding window",
            component: SlidingWindow,
          },
          {
            id: IDS.s28,
            title: "2.8 Context management B: summarisation",
            component: Summarisation,
          },
          { id: IDS.s29, title: "2.9 Streaming", component: Streaming },
          {
            id: IDS.s210,
            title: "2.10 One class owns the state",
            component: OneClassOwnsState,
          },
          {
            id: IDS.s211,
            title: "2.11 Project 1: Client Intake Bot",
            component: ProjectClientIntakeBot,
          },
        ],
      },
      {
        id: IDS.chClassifier,
        title: "3. Planet Classifier",
        subTopics: [
          {
            id: IDS.s31,
            title: "3.1 Sentiment analysis and prompt engineering",
            component: SentimentPromptEngineering,
          },
          {
            id: IDS.s32,
            title: "3.2 Natural Language Inference (NLI)",
            component: Nli,
          },
          { id: IDS.s33, title: "3.3 BERT", component: Bert },
          {
            id: IDS.s34,
            title: "3.4 Running a model with pipeline",
            component: PipelineModels,
          },
          {
            id: IDS.s35,
            title: "3.5 Choosing an approach",
            component: ChoosingApproach,
          },
          {
            id: IDS.s36,
            title: "3.6 How to know it works: evaluation",
            component: ClassifierEvaluation,
          },
          {
            id: IDS.s37,
            title: "3.7 Project 2: Inbox Triage",
            component: ProjectInboxTriage,
          },
        ],
      },
      {
        id: IDS.chEmbeddings,
        title: "4. Planet Embeddings",
        subTopics: [
          {
            id: IDS.s41,
            title: "4.1 What embeddings are",
            component: WhatAreEmbeddings,
          },
          {
            id: IDS.s42,
            title: "4.2 Using Sentence Transformers",
            component: SentenceTransformers,
          },
          {
            id: IDS.s43,
            title: "4.3 Layout of semantic search",
            component: SemanticSearchLayout,
          },
          { id: IDS.s44, title: "4.4 Pitfalls", component: EmbeddingPitfalls },
          {
            id: IDS.s45,
            title: "4.5 Project 3: Gig Radar",
            component: ProjectGigRadar,
          },
        ],
      },
    ],
    component: AiEngineeringFoundationsPage,
  },
  ["#AI", "#LLM", "#PromptEngineering", "#Embeddings", "#Python"],
);
