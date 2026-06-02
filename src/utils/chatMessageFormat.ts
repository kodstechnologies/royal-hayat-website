const LINK_CLASS = "text-accent underline hover:text-accent/80 font-medium";

const COMPLETE_LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const INCOMPLETE_LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)$/;
const INCOMPLETE_LABEL_RE = /\[[^\]]*$/;
/** [Label](/path with no closing parenthesis */
const UNCLOSED_LINK_RE = /\[([^\]]+)\]\((\/[^)\s]+)(?!\))/g;

function linkHtml(label: string, href: string) {
  return `<a href="${href}" class="${LINK_CLASS}">${label}</a>`;
}

/**
 * Converts assistant markdown (bold + internal links) to HTML for chat bubbles.
 */
export function formatChatMessageHtml(text: string, isStreaming = false): string {
  let line = text;

  if (isStreaming) {
    line = line.replace(INCOMPLETE_LINK_RE, "$1");
    line = line.replace(INCOMPLETE_LABEL_RE, "");
  }

  line = line.replace(COMPLETE_LINK_RE, (_, label, href) => linkHtml(label, href));

  if (!isStreaming) {
    line = line.replace(UNCLOSED_LINK_RE, (_, label, href) => linkHtml(label, href));
  }

  line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return line;
}
