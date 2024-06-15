import { Container, Text, VStack, Heading, Button, Box, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { GenerativeModel, configure, setSafetySettings } from '@google-cloud/aiplatform';
import tiktoken from 'tiktoken';

const Index = () => {
  const [novelText, setNovelText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Configure API Key
  const api_key = process.env.REACT_APP_GOOGLE_API_KEY;
  configure({ apiKey: api_key });
  const model = new GenerativeModel('gemini-1.5-pro');

  // Set Safety Settings
  const safety_settings = [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_NONE"
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_NONE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_NONE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_NONE"
    }
  ];
  setSafetySettings(safety_settings);

  // Load Guidance Content for Overused Words
  const guidance_content = `## Guidance on Overused Words

  **Guidance for Avoiding Overused Terms and Enhancing Creative Expression in Writing**

  **Objective**: Our goal is to cultivate a style of writing that is fresh, engaging, and distinctive. We aim to move away from clichéd and hackneyed expressions that might detract from the originality of our work.

  **Words to Avoid or Use with Caution**:

  - **Tapestry**
  - **Enigma**
  - **Delve**
  - **Nuanced**
  - **Multifaceted**
  - **Dance**
  - **Cosmic**
  - **Whisper**
  - **Echoes**
  - **Echo**
  - **Crucial** (and any similar weaving or thread-related metaphors)

  **Strategies for Enhancing Language:**

  1. **Expand Vocabulary**:
      - Encourage the use of diverse and less common vocabulary that captures the essence of what's meant to be conveyed without falling back on the listed overused terms.
      - Use thesauruses or lexical databases to find alternatives that might not be top-of-mind but are appropriate and vivid.
  2. **Encourage Unique Descriptions**:
      - Challenge yourself to describe scenes, emotions, or objects in innovative ways. For instance, instead of using "a tapestry of emotions," describe how each emotion contributes uniquely to the character's perspective, perhaps using colors, textures, or sounds as metaphors.
  3. **Use Specifics Over Generalities**:
      - Avoid vague descriptions by using concrete details that are more engaging and visual. Replace generic terms like "cosmic" with specific astronomical terms or descriptions that bring the reader closer to the actual experience.
  4. **Reframe the Narrative**:
      - Consider altering the structure of your narrative for greater impact. Experiment with different points of view, narrative styles, or the sequence of information presentation to make the story more dynamic and less predictable.

  **Practical Implementation**:

  - **For AI Tools**: Implement filters that flag the overused words and suggest alternatives during the content generation process. Adjust the AI's training data to decrease the frequency of these clichés.
  - **For Writers**: Before finalizing your drafts, use a review checklist that includes scanning for these words. Reflect on whether they can be replaced with more original expressions or if their usage is genuinely the best choice for the context.

  **Examples**:

  - Instead of "She felt a cosmic sadness," try "She felt a deep sadness, like the silent, endless expanse of the night sky."
  - Replace "His life was a tapestry of adventures," with "His life was a collection of adventures, each a vivid scene painted with the colors of diverse experiences."

  By following these guidelines, you aim to enrich your writing with authenticity and creativity, steering clear of expressions that might render it mundane or derivative. This approach not only enhances the reader's experience but also strengthens your unique voice as a writer.
  `;

  const getBookDetails = () => {
    const genre = prompt("Enter the genre of the book:");
    const chapters = parseInt(prompt("Enter the number of chapters:"));
    const pagesPerChapter = parseInt(prompt("Enter the approximate pages per chapter:"));
    const subject = prompt("Enter the subject of the book:");
    const themes = prompt("Enter the themes of the book:");
    const plotPoints = prompt("Enter any specific plot points:");
    const characters = prompt("Enter information about the characters:");

    return {
      genre,
      chapters,
      pagesPerChapter,
      subject,
      themes,
      plotPoints,
      characters
    };
  };

  const generateAndRefinePlotPoints = (bookDetails) => {
    const generationConfig = {
      'candidateCount': 1,
      'maxOutputTokens': 150
    };
    let response = model.generateContent(
      `${guidance_content}\nGenerate engaging plot points for a ${bookDetails.genre} book with the following details:\nSubject: ${bookDetails.subject}\nThemes: ${bookDetails.themes}\n`,
      generationConfig
    );

    let initialPlotPoints = response.candidates[0].content.text.trim();

    while (true) {
      const feedback = prompt(`Initial Plot Points:\n${initialPlotPoints}\nPlease provide feedback or type 'continue' to proceed:`);
      if (feedback.toLowerCase() === "continue") {
        break;
      }
      response = model.generateContent(
        `${guidance_content}\nGenerate engaging plot points for a ${bookDetails.genre} book with the following details:\nSubject: ${bookDetails.subject}\nThemes: ${bookDetails.themes}\nFeedback: ${feedback}\n`,
        generationConfig
      );
      initialPlotPoints = response.candidates[0].content.text.trim();
    }

    return initialPlotPoints;
  };

  const generateAndSelectTitle = (plotPoints) => {
    const generationConfig = {
      'candidateCount': 1,
      'maxOutputTokens': 50
    };
    const response = model.generateContent(
      `${guidance_content}\nGenerate 5 potential titles for a novel with these plot points:\n${plotPoints}`,
      generationConfig
    );
    const titles = response.candidates[0].content.text.trim().split("\n");

    let title = titles[0];
    if (titles.length > 1) {
      const choice = parseInt(prompt(`Choose the best title:\n${titles.map((title, index) => `${index + 1}. ${title}`).join("\n")}\nEnter the number of your choice:`)) - 1;
      title = titles[choice];
    }

    return title;
  };

  const generateChapter1 = (plotPoints, title, bookDetails) => {
    const generationConfig = {
      'candidateCount': 1,
      'maxOutputTokens': 500
    };
    let response = model.generateContent(
      `${guidance_content}\nWrite the first chapter of a ${bookDetails.genre} novel titled '${title}', incorporating these plot points:\n${plotPoints}`,
      generationConfig
    );

    let chapter1Text = response.candidates[0].content.text.trim();

    while (true) {
      const feedback = prompt(`Chapter 1:\n${chapter1Text}\nPlease provide feedback or type 'continue' to proceed:`);
      if (feedback.toLowerCase() === "continue") {
        break;
      }
      response = model.generateContent(
        `${guidance_content}\nWrite the first chapter of a ${bookDetails.genre} novel titled '${title}', incorporating these plot points:\n${plotPoints}\n\nFeedback: ${feedback}\n`,
        generationConfig
      );
      chapter1Text = response.candidates[0].content.text.trim();
    }

    return chapter1Text;
  };

  const generateChapters = (plotPoints, bookDetails, previousChapters) => {
    const chapters = [];
    for (let chapterNum = 2; chapterNum <= bookDetails.chapters; chapterNum++) {
      const previousChaptersText = previousChapters.join("\n\n");
      const generationConfig = {
        'candidateCount': 1,
        'maxOutputTokens': 500
      };
      const response = model.generateContent(
        `${guidance_content}\nContinue the novel with these plot points:\n${plotPoints}\n\nPrevious chapters:\n${previousChaptersText}`,
        generationConfig
      );
      const chapterText = response.candidates[0].content.text.trim();
      chapters.push(chapterText);
    }

    return chapters;
  };

  const saveNovel = (title, chapters) => {
    const blob = new Blob([`Title: ${title}\n\n${chapters.map((chapter, index) => `Chapter ${index + 1}:\n\n${chapter}\n\n`).join("")}`], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.txt`;
    link.click();
  };

  const handleGenerateText = async () => {
    setIsLoading(true);

    const bookDetails = getBookDetails();
    const plotPoints = generateAndRefinePlotPoints(bookDetails);
    const title = generateAndSelectTitle(plotPoints);
    const chapter1 = generateChapter1(plotPoints, title, bookDetails);
    const chapters = generateChapters(plotPoints, bookDetails, [chapter1]);
    saveNovel(title, [chapter1, ...chapters]);

    setNovelText(`Novel '${title}.txt' generated successfully!`);
    setIsLoading(false);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Heading as="h1" size="xl">Novel Writing App</Heading>
        <Text fontSize="lg">Leverage Gemini 1.5 Pro's 1 million context window to write your novel.</Text>
        <Box width="100%">
          <Textarea
            value={novelText}
            onChange={(e) => setNovelText(e.target.value)}
            placeholder="Start writing your novel here..."
            size="lg"
            height="300px"
          />
        </Box>
        <Button
          colorScheme="teal"
          size="lg"
          onClick={handleGenerateText}
          isLoading={isLoading}
          loadingText="Generating"
        >
          Generate More Text
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;