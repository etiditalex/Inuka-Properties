/** Existing size-specific notes that previously sat inside pricing cards. */
export function pricingNotes(propertyId: number, size: string): string[] {
  if (size === "1/8 Acre" && propertyId === 2) {
    return ["Prime Location", "Coastal Ambiance", "Highway Access"];
  }
  if (size === "1/4 Acre" && propertyId === 2) {
    return ["Best Value", "Larger Development", "Investment Potential", "Thriving Community"];
  }
  if (size === "1/8 Acre" && propertyId === 4) {
    return ["Flexible Payments", "Highway Proximity", "Ready for Development", "Utilities Available"];
  }
  if (size === "1/8 Acre" && propertyId === 9) {
    return ["All-Inclusive", "Beach Proximity", "Highway Access", "Serviced Plots"];
  }
  if (size === "1/8 Acre" && propertyId === 5) {
    return ["Highway Access", "University Proximity", "Serviced Plots"];
  }
  if (size === "1/4 Acre" && propertyId === 5) {
    return ["Best Value", "Larger Development", "Commercial Potential", "Premium Location"];
  }
  if (size === "1/8 Acre" && propertyId === 6) {
    return ["Prime Location", "Airport Proximity", "Coastal Bliss", "High Growth Potential"];
  }
  if (size === "1/8 Acre" && propertyId === 7) {
    return ["Strategic Location", "Perfect for Holiday Homes", "Airport Proximity", "Fast-Growing Area"];
  }
  if (size === "1/8 Acre" && propertyId === 8) {
    return ["Tarmacked Road Access", "Water & Electricity", "Well Demarcated", "Perimeter Fence"];
  }
  if (size === "50x100 (1/8 Acre)" && propertyId === 10) {
    return [
      "Prime Location - 500m from Bypasses",
      "Affordable Pricing",
      "Zero Interest Payment Plan",
      "High Growth Potential",
    ];
  }
  if (size === "1/8 Acre" && propertyId === 11) {
    return ["Prime Location - 1km off Bypass", "Water & Electricity on-site", "Ready to Build", "Perfect for Home or Investment"];
  }
  if (size === "1/8 Acre" && propertyId === 14) {
    return ["600m from Mariakani–Mavueni Bypass", "Water & electricity on site", "Deposit KES 150,000", "Balance within 12 months"];
  }
  if (size === "1/8 Acre" && propertyId === 13) {
    return ["All-inclusive — no hidden charges", "Deposit KES 150,000", "Balance within 12 months", "10-year anniversary offer"];
  }
  if (size === "1/4 Acre" && propertyId === 13) {
    return ["All-inclusive — no hidden charges", "Deposit KES 250,000", "Balance within 12 months", "More space for home or farm"];
  }
  return [];
}
