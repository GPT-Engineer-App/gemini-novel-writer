import { Container, Text, VStack, Heading, Button, Box, Textarea } from "@chakra-ui/react";
import { useState } from "react";

const Index = () => {
  const [novelText, setNovelText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateText = async () => {
    setIsLoading(true);
    // Simulate a call to Gemini 1.5 Pro API
    setTimeout(() => {
      setNovelText((prevText) => prevText + "\n\nGenerated text...");
      setIsLoading(false);
    }, 2000);
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