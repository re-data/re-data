import React, { ReactNode } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type CodeFormatterProps = {
    code: ReactNode
    language: string
    mode?: 'light' | 'dark';
  }

const CodeFormatter = ({ code, language, mode = 'dark' }: CodeFormatterProps): JSX.Element => (
  <SyntaxHighlighter language={language} style={mode === 'dark' ? dark : undefined}>
    {code}
  </SyntaxHighlighter>
);

export default CodeFormatter;
