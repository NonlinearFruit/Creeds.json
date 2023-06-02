interface CreedDocument<T> {
  Metadata: Metadata;
  Data: T;
}

interface Metadata {
  Title: string;
  Year: string;
  SourceAttribution: string;
  SourceUrl: string;
  OriginStory: string | null;
  OriginalLanguage: string | null;
  Location: string | null;
  CreedFormat: "Creed" | "Canon" | "Confession" | "Catechism" | "HenrysCatechism";
  AlternativeTitles: string[];
  Authors: string[];
}

interface Creed extends CreedDocument<CreedContent> {}

interface CreedContent {
  Content: string;
}

interface Canon extends CreedDocument<CanonArticle[]> {}

interface CanonArticle {
  Article: string;
  Title: string;
  Content: string;
}

interface Confession extends CreedDocument<ConfessionChapter[]> {}

interface ConfessionChapter {
  Chapter: string;
  Title: string;
  Sections: any;
}

interface ConfessionSection {
  Section: string;
  Content: string;
}

interface Catechism extends CreedDocument<CatechismQuestion[]> {}

interface CatechismQuestion {
  Number: number;
  Question: string;
  Answer: string;
}

interface HenrysCatechism extends CreedDocument<HenrysCatechismQuestion[]> {}

interface HenrysCatechismQuestion {
  Number: string;
  Question: string;
  Answer: string;
  SubQuestions: HenrysCatechismSubQuestion[];
}

interface HenrysCatechismSubQuestion {
  Number: string;
  Question: string;
  Answer: string;
}
