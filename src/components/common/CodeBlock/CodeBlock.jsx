import { useState } from 'react';
import { FaCheck, FaRegCopy } from 'react-icons/fa';
import './CodeBlock.css';

/**
 * Monospace code panel with a language label and a copy-to-clipboard button.
 *
 * @param {object} props
 * @param {string} props.code - the code or command text
 * @param {string} [props.language] - label shown in the header (bash, python, json...)
 * @param {string} [props.title] - optional caption shown beside the language
 */
export function CodeBlock({ code, language = 'bash', title }) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 1600);
    } catch {
      /* clipboard blocked - the text is still selectable */
    }
  };

  return (
    <figure className="code-block">
      <figcaption className="code-block__header">
        <span className="code-block__language">{language}</span>
        {title ? <span className="code-block__title">{title}</span> : null}
        <button type="button" className="code-block__copy no-print" onClick={copyCode} aria-label="Copy code">
          {hasCopied ? <FaCheck aria-hidden="true" /> : <FaRegCopy aria-hidden="true" />}
          <span>{hasCopied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      <pre className="code-block__body">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
