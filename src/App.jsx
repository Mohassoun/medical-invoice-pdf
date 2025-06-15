

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const A4_WIDTH_PX = 794; 
const A4_WIDTH_MM = 210; 

export default function App() {
  const invoice1 = useRef(null);
  const invoice2 = useRef(null);
  const [loading, setLoading] = useState(false);

  const capture = async (node) => {
    const clone = node.cloneNode(true);
    
    Object.assign(clone.style, {
      width: `${A4_WIDTH_PX}px`,
      position: "absolute",
      left: "-9999px",
      top: "0",
      background: "white",
      zIndex: "-1",
      overflow: "hidden",
    });

    document.body.appendChild(clone);
    await new Promise((r) => setTimeout(r, 100));

    const contentHeight = clone.scrollHeight;

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      width: A4_WIDTH_PX,
      height: contentHeight,
      windowWidth: A4_WIDTH_PX,
      windowHeight: contentHeight,
    });

    document.body.removeChild(clone);
    return canvas;
  };

  const download = async () => {
    if (!invoice1.current || !invoice2.current) return;
    setLoading(true);

    try {
      const [c1, c2] = await Promise.all([
        capture(invoice1.current),
        capture(invoice2.current),
      ]);

      const aspectRatio1 = c1.height / c1.width;
      const page1HeightMM = A4_WIDTH_MM * aspectRatio1;
      
      const aspectRatio2 = c2.height / c2.width;
      const page2HeightMM = A4_WIDTH_MM * aspectRatio2;

      const pdf = new jsPDF("p", "mm", [page1HeightMM, A4_WIDTH_MM]);
      pdf.addImage(c1, "PNG", 0, 0, A4_WIDTH_MM, page1HeightMM);

      pdf.addPage([page2HeightMM, A4_WIDTH_MM]);
      pdf.addImage(c2, "PNG", 0, 0, A4_WIDTH_MM, page2HeightMM);

      pdf.save("فاتورة-طبية.pdf");
    } catch (error) {
      console.error("حدث خطأ أثناء التصدير:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-wrapper">
      <button onClick={download} disabled={loading} className="pdf-button">
        {loading ? "جارٍ التصدير..." : "تحميل الفاتورة PDF"}
      </button>

      <div ref={invoice1} className="page-container">
 

  

      

    

         </div>

      <div ref={invoice2} className="page-container">
       

       


       
      </div>
    </div>
  );
}