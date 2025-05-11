
import { EstimateData, MaterialItem } from "@/types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "@/components/ui/use-toast";

// Need to add the type definition for jspdf-autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = (estimateData: EstimateData): void => {
  try {
    // Initialize PDF document
    const doc = new jsPDF();
    const totalAmount = estimateData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(16, 145, 234); // electric-500 color
    doc.text("Electrical Estimate", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Professional Electrical Services", 105, 27, { align: "center" });
    doc.setDrawColor(16, 145, 234);
    doc.line(20, 35, 190, 35);

    // Add estimate info
    doc.setFontSize(11);
    doc.setTextColor(0);

    // Left side information
    if (estimateData.clientName) {
      doc.text(`Client: ${estimateData.clientName}`, 20, 45);
    }
    if (estimateData.clientEmail) {
      doc.text(`Email: ${estimateData.clientEmail}`, 20, 52);
    }

    // Right side information
    doc.text(`Estimate #: ${estimateData.estimateNumber}`, 150, 45);
    doc.text(`Date: ${estimateData.date}`, 150, 52);

    // Add items table
    const tableColumn = ["Material", "Quantity", "Unit Price", "Total"];
    const tableRows: any[][] = [];

    estimateData.items.forEach((item: MaterialItem) => {
      const total = item.quantity * item.price;
      tableRows.push([
        item.name,
        `${item.quantity} ${item.unit}`,
        `$${item.price.toFixed(2)}`,
        `$${total.toFixed(2)}`,
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 145, 234], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 247, 255] },
    });

    // Add total
    const finalY = (doc as any).lastAutoTable.finalY || 60;
    doc.setFontSize(11);
    doc.text("Total Amount:", 140, finalY + 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`$${totalAmount.toFixed(2)}`, 175, finalY + 10);

    // Add footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Thank you for your business!", 105, finalY + 25, {
      align: "center",
    });
    doc.text("Generated with Electrical Estimate App", 105, finalY + 30, {
      align: "center",
    });

    // Save PDF
    doc.save(`Electrical_Estimate_${estimateData.estimateNumber}.pdf`);
    
    toast({
      title: "Success",
      description: "PDF generated successfully!",
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast({
      title: "Error",
      description: "Failed to generate PDF. Please try again.",
      variant: "destructive",
    });
  }
};
