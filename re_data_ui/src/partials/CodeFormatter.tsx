import React, { ReactNode } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type CodeFormatterProps = {
    code: ReactNode
    language: string
  }

const CodeFormatter = ({ code, language }: CodeFormatterProps): JSX.Element => (
  <SyntaxHighlighter language={language} style={dark}>
    {code}
  </SyntaxHighlighter>
);

export default CodeFormatter;
