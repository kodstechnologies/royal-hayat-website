import { useLocation } from "react-router-dom";

const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const pdfSrc = pathname;

  return (
    <iframe
      src={pdfSrc}
      className="fixed inset-0 h-screen w-full border-0"
      title="PDF document"
    />
  );
};

export default RuntimePdfViewer;
