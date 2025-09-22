import removeMarkdown from 'remove-markdown';

export const stripMarkdown = (text: string): string => {
  return removeMarkdown(text);
};
