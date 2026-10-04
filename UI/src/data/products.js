export const products = [
  {
    id: "8901030310243", // Parle-G
    name: "Parle-G Original Glucose Biscuits",
    price: 10,
    unit: "800g",
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "8901058863646", // Maggi
    name: "Maggi 2-Minute Noodles Masala",
    price: 14,
    unit: "70g",
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "8901138513725", // Amul Butter
    name: "Amul Pasteurised Butter",
    price: 58,
    unit: "100g",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "8901456987123", // Tata Salt
    name: "Tata Salt Vacuum Evaporated",
    price: 28,
    unit: "1kg",
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1626074961596-f368bb03b9b4?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "8901234567890", // Aashirvaad Atta
    name: "Aashirvaad Superior MP Sharbati Atta",
    price: 275,
    unit: "5kg",
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "8901765432109", // Brooke Bond Red Label
    name: "Brooke Bond Red Label Tea",
    price: 140,
    unit: "250g",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1576092762791-dd9e2220abd4?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "8901111222333", // Lay's
    name: "Lay's Potato Chips, India's Magic Masala",
    price: 20,
    unit: "50g",
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "8902222333444", // Cadbury Dairy Milk
    name: "Cadbury Dairy Milk Silk Chocolate",
    price: 85,
    unit: "60g",
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1623660021666-419b4700d60d?auto=format&fit=crop&q=80&w=400&h=400"
  }
];

export const getProductByBarcode = (barcode) => {
  return products.find(p => p.id === barcode) || null;
};
