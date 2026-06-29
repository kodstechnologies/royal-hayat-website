const getColonIndex = (text: string) => {
  const candidates = [text.indexOf(":"), text.indexOf("؛")].filter((index) => index !== -1);
  return candidates.length ? Math.min(...candidates) : -1;
};

export const renderColonHeading = (text: string) => {
  const colonIndex = getColonIndex(text);
  if (colonIndex === -1) {
    return <span className="font-bold">{text}</span>;
  }
  const label = text.slice(0, colonIndex + 1);
  const rest = text.slice(colonIndex + 1);
  return (
    <>
      <span className="font-bold">{label}</span>
      {rest}
    </>
  );
};
