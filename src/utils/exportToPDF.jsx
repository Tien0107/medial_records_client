import jsPDF from "jspdf";

export const exportToDPF = (context) => {
    const doc = new jsPDF();
    doc.text(context, 10, 10);
    doc.save("medical_records.pdf");
};