import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const doc = new Document({
  creator: "SmartCart AI Assistant",
  title: "SmartCart Project Architecture",
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          text: "SmartCart Project Planning & Architecture",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Below is the complete folder structure and an explanation of what each file does in the SmartCart application.", italics: true }),
          ],
          spacing: { after: 300 }
        }),

        // 1. Root
        new Paragraph({ text: "1. Root Configuration (UI/)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• package.json & vite.config.js: Project dependencies and Vite build configuration." }),
        new Paragraph({ text: "• tailwind.config.js & postcss.config.js: Tailwind CSS configuration and theme colors (Tailwind v3).", spacing: { after: 200 } }),

        // 2. Src Root
        new Paragraph({ text: "2. Main Application (UI/src/)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• main.jsx & App.jsx: Application entry points. App.jsx contains the React Router configuration linking all pages together." }),
        new Paragraph({ text: "• index.css: Global CSS styles and Tailwind base imports.", spacing: { after: 200 } }),

        // 3. Components
        new Paragraph({ text: "3. Reusable UI Components (UI/src/components/)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Button.jsx: Standardized, reusable button component used throughout the app." }),
        new Paragraph({ text: "• Card.jsx: Clean glassmorphism card container." }),
        new Paragraph({ text: "• BottomSheet.jsx: Mobile pop-up modal from the bottom, used primarily in the scanner." }),
        new Paragraph({ text: "• Header.jsx: Standard navigation header for mobile pages." }),
        new Paragraph({ text: "• Toast.jsx: In-app notification popup component (success/error messages).", spacing: { after: 200 } }),

        // 4. Context
        new Paragraph({ text: "4. Global State Management (UI/src/context/)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• CartContext.jsx: Manages the user's shopping basket, item quantities, totals, and tracks if the checkout is locked." }),
        new Paragraph({ text: "• ToastContext.jsx: Manages rendering and showing global toast notifications.", spacing: { after: 200 } }),

        // 5. Data & Utils
        new Paragraph({ text: "5. Mock Data & Utilities", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• UI/src/data/products.js: Contains realistic mock data for Indian supermarket products, prices, and barcodes." }),
        new Paragraph({ text: "• UI/src/utils/currency.js: Helper function to format numbers into Indian Rupees (₹).", spacing: { after: 200 } }),

        // 6. Customer Pages
        new Paragraph({ text: "6. Customer Facing Mobile Flow (UI/src/pages/customer/)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Dashboard.jsx: The start screen for customers showing quick actions and cart summary." }),
        new Paragraph({ text: "• Scanner.jsx: Simulated camera interface for scanning barcodes with flash and manual entry features." }),
        new Paragraph({ text: "• Cart.jsx: Displays added items, allows quantity adjustments, and shows total price." }),
        new Paragraph({ text: "• CheckoutPrepare.jsx: Pre-checkout summary warning the user that their cart will be locked." }),
        new Paragraph({ text: "• CheckoutQR.jsx: Displays the generated QR code to be scanned at the physical counter." }),
        new Paragraph({ text: "• CheckoutSuccess.jsx: Digital receipt and success message shown after staff processes payment.", spacing: { after: 200 } }),

        // 7. Staff Pages
        new Paragraph({ text: "7. Staff Facing Counter Flow (UI/src/pages/staff/)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• StaffLogin.jsx: Authentication screen for store workers." }),
        new Paragraph({ text: "• StaffDashboard.jsx: Counter dashboard to scan customer QRs or type manual checkout IDs." }),
        new Paragraph({ text: "• StaffVerify.jsx: Screen for staff to spot-check a customer's basket and verify item counts." }),
        new Paragraph({ text: "• StaffPayment.jsx: Payment method selection (UPI/Card/Cash) and processing simulation." }),
        new Paragraph({ text: "• StaffComplete.jsx: Final receipt generation and transaction close for the staff member.", spacing: { after: 200 } }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("../SmartCart_Planning_Chart.docx", buffer);
  console.log("Word document generated successfully at E:/Shoping Mart/SmartCart_Planning_Chart.docx");
}).catch(err => {
  console.error("Error generating word document:", err);
});
