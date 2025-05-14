import { EstimateData, MaterialItem } from "@/types";
import { jsPDF } from "jspdf";

// Extend jsPDF to include lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}
import autoTable from "jspdf-autotable"; // Explicitly importing

// Import the custom font
// Adjusted the path to match the relative structure
//import customFont from "../fonts/font.js";

export const generatePDF = (estimateData: EstimateData): void => {
  try {
    // Initialize PDF document
    const doc = new jsPDF();
    const totalAmount = estimateData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Add the font to jsPDF
    //doc.addFileToVFS("Roboto-Italic.woff", customFont);
    //doc.addFont("Roboto-Italic.woff", "Roboto", "normal");
    //doc.setFont("Roboto"); // Set the custom font

    // Add company header
    doc.setFontSize(20);
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

    // Handle currency symbol
    const currencySymbol = estimateData.currency?.trim() || '\u20B5'; // Unicode for ₵
    console.log("Currency in estimateData:", estimateData.currency); // Debugging
    doc.text(`Currency: ${currencySymbol}`, 150, 59);

    // Add items table
    const tableColumn = ["Material", "Brand/Standard", "Quantity", "Unit Price", "Total"];
    const tableRows: any[][] = [];

    estimateData.items.forEach((item: MaterialItem) => {
      const itemBrand = item.isCable ? (item.brand || "N/A") : (item.brand || "N/A");
      const total = item.quantity * item.price;
      
      tableRows.push([
        item.name,
        itemBrand,
        `${item.quantity} ${item.unit}`,
        `${currencySymbol}${item.price.toFixed(2)}`,
        `${currencySymbol}${total.toFixed(2)}`,
      ]);
    });

    // Use autoTable correctly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 67,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 145, 234], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 247, 255] },
    });

    // Add total
    const finalY = doc.lastAutoTable?.finalY || 67;
    doc.setFontSize(11);
    doc.text("Total Amount:", 140, finalY + 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${currencySymbol}${totalAmount.toFixed(2)}`, 175, finalY + 10);

    // Add footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Thank you for your business!", 105, finalY + 25, { align: "center" });
    doc.text("Generated with Electrical Estimate App", 105, finalY + 30, { align: "center" });

    // Add estimate ID at the bottom
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(`Estimate ID: ${estimateData.estimateNumber}`, 105, finalY + 40, { align: "center" });

    // Save PDF with a unique name to avoid browser caching issues
    const timestamp = new Date().getTime();
    doc.save(`Electrical_Estimate_${estimateData.estimateNumber}_${timestamp}.pdf`);
    
    console.log("PDF generated successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
