import fs from "fs"
import PDFDocument from "pdfkit"

const generatePaymentPDF = (paymentDetails) => {
    const { receiptId,orderId,amount,currency,name,email,paymentId,createdAt } = paymentDetails;
  
    const doc = new PDFDocument();
    const filePath = `./public/payments/receipt-${name.trim()}.png`;
  
    doc.pipe(fs.createWriteStream(filePath)); // Write PDF to file
  
    // Add a logo at the top
    const logoPath = './public/assets/logo.jpeg'; // Path to the logo file
    doc.image(logoPath, 50, 50, { width: 100 }); // Position (x: 50, y: 50), width: 100
  
    // Add content to the PDF
    doc.moveDown(4); // Add space below the logo
    doc.fontSize(20).text("Payment Acknowledgment", { align: 'center' });
  
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${Date.now()}`, { align: 'center' });
    doc.text(`Payment ID: ${paymentId}`);
    doc.text(`Receipt ID: ${receiptId}`);
    doc.text(`Order ID: ${orderId}`);
    doc.text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Amount Paid: $${amount}${ currency}`);
    doc.text(`Payment Date: ${createdAt}`);
  
    doc.moveDown();
    doc.text("Thank you for your payment!", { align: 'center' });
  
    doc.end(); // Finalize the PDF document
    return filePath; // Return the path to the generated file
  };
  

  export {generatePaymentPDF}