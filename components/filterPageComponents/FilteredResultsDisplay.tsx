// FilteredResultsDisplay.tsx
import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';

interface FilteredResultsDisplayProps {
  handleUpload: () => void;
  isButtonDisabled: boolean;
}

const FilteredResultsDisplay: React.FC<FilteredResultsDisplayProps> = ({ handleUpload, isButtonDisabled }) => {
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Button
        onClick={handleUpload}
        isDisabled={isButtonDisabled}
        colorScheme="blue"
        mt={4}
      >
        Filtrar Clientes
      </Button>
    </Flex>
  );
};

export default FilteredResultsDisplay;
