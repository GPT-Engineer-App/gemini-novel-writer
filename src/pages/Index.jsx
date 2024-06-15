import { Container, Text, VStack, Heading, Button, Box, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { GenerativeModel, configure, setSafetySettings } from '@google-cloud/aiplatform';

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

  