export const findMatchingCombination = (combinations, selectedVariants) => {
  return combinations.find(combo => {
    const comboSelections = combo.option_labels.reduce((acc, label) => {
      acc[label.type] = label.value;
      return acc;
    }, {});
    
    return Object.entries(selectedVariants).every(
      ([type, value]) => comboSelections[type] === value
    );
  });
};