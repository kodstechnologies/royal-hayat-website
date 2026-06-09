const LINK_CLASS = "text-primary underline hover:text-primary/80 font-medium";
const COMPLETE_LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const INCOMPLETE_LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)$/;
const INCOMPLETE_LABEL_RE = /\[[^\]]*$/;
const UNCLOSED_LINK_RE = /\[([^\]]+)\]\((\/[^)\s]+)(?!\))/g;
function linkHtml(label: string, href: string) {
  return `<a href="${href}" class="${LINK_CLASS}">${label}</a>`;
}
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
