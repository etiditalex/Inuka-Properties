"use client";

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Bed, Square, Phone, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  // In a real application, this would fetch property data based on the ID
  // For now, we'll use a sample property
  const propertyId = parseInt(params.id);
  
  // Property data based on ID
  const properties: Record<number, any> = {
    1: {
      id: 1,
      title: "Bofa Platinum",
      location: "Bofa, Kilifi County",
      type: "beach",
      price: "KES 5,990,000",
      size: "1/4 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg",
      description: "A Controlled Gated Community Development, touching Bofa Road and only 30 metres from the sandy Beach. The Project boasts premium features and exceptional beachfront living.",
      features: [
        "Beautiful panoramic views of the Beach",
        "Proximity to Silver Palm Beach Resort and just 4km from Kilifi Town",
        "Fresh Water and Borehole water available",
        "Perimeter walls all around the Project",
        "Electricity on Site",
        "Controlled design with 3 Bedroom Bungalows and 1 Storey Maisonettes",
        "Gated Community Security",
      ],
      pricing: {
        "1/8 Acre": "KES 2,990,000",
        "1/4 Acre": "KES 5,990,000",
      },
    },
    2: {
      id: 2,
      title: "Chumani Phase 6",
      location: "Chumani, Kilifi County",
      type: "residential",
      price: "KES 595,000",
      size: "1/8 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285403/chumani_phase_6_y4smsw.jpg",
      description: "Chumani Phase 6 offers prime coastal development plots located approximately 400 meters from the Kilifi-Malindi Highway. This strategic development combines excellent highway accessibility with the unique charm of coastal living, making it an ideal location for both residential development and investment opportunities. The project is situated in a thriving community with coastal ambiance that provides residents with the perfect balance of tranquility and connectivity.",
      features: [
        "Prime Location - 400m from Kilifi-Malindi Highway",
        "Coastal Ambiance",
        "Thriving Community",
        "High Investment Potential",
        "Excellent Highway Accessibility",
        "Perfect balance of tranquility and connectivity",
        "Multiple plot sizes available",
      ],
      pricing: {
        "1/8 Acre": "KES 595,000",
        "1/4 Acre": "KES 1,299,000",
      },
      quickInfo: {
        "Location": "Chumani, Kilifi County",
        "Highway Distance": "400m from Kilifi-Malindi Highway",
        "Plot Sizes Available": "1/8 & 1/4 Acre",
        "Development Type": "Prime Coastal Development",
        "Community Status": "Thriving Community",
        "Ambiance": "Coastal Ambiance",
        "Investment Rating": "High Investment Potential",
        "Starting Price": "KES 595,000 (1/8 Acre)",
      },
    },
    3: {
      id: 3,
      title: "Kikambala Phase 2",
      location: "Kikambala, Kilifi County",
      type: "residential",
      price: "KES 1,250,000",
      size: "1/8 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285860/Kikambala_Phase_2_cw64y8.jpg",
      description: "Kikambala Gardens Phase 2 is a serene coastal development located opposite the Sultan Palace junction, just 2.5km from the highway. The project sits on the main murram access road and offers reliable access to utilities and key social amenities. With a secure perimeter fence, 9m wide access roads, and a peaceful environment with indigenous trees like mango and palm, this project is ideal for residential development, holiday homes, and investment opportunities.",
      features: [
        "Serene & Secure environment",
        "Coastal Lifestyle",
        "Utilities Connected (Water & Electricity)",
        "Perimeter Fence all round",
        "9m wide access roads",
        "Peaceful environment with indigenous trees",
        "Access to schools, hospitals, beach resorts, and holiday homes",
        "Main murram access road",
      ],
      pricing: {
        "1/8 Acre": "KES 1,250,000",
      },
      quickInfo: {
        "Location": "Kikambala, Kilifi County",
        "Highway Distance": "2.5km",
        "Access Road": "Main murram road",
        "Perimeter Fence": "All round",
        "Access Roads": "9m wide",
        "Utilities": "Water & Electricity",
        "Amenities": "Schools, hospitals, beach resorts, holiday homes",
        "Nearest Town": "Mtwapa (7km)",
      },
    },
    4: {
      id: 4,
      title: "Chumani Phase 3",
      location: "Chumani, Kilifi County",
      type: "residential",
      price: "KES 550,000",
      size: "1/8 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286100/chumani_phase_3_2_muym3y.jpg",
      description: "Chumani Phase 3 offers premium residential development plots in an ideal location just 300 meters from the Kilifi-Malindi Highway. This development combines excellent accessibility with immediate development potential, making it perfect for both residential and investment purposes. The project is designed for immediate settlement and development, with essential utilities already in place. With flexible payment terms that allow for easy ownership, this location offers exceptional value for money in one of Kilifi County's most accessible areas.",
      features: [
        "Flexible Payment Terms",
        "Highway Proximity - 300m from Kilifi-Malindi Highway",
        "Ready for Immediate Settlement",
        "Utilities Available (Water & Electricity)",
        "Excellent accessibility",
        "Immediate development potential",
        "Perfect for residential and investment purposes",
        "Essential utilities already in place",
      ],
      pricing: {
        "1/8 Acre": "KES 550,000",
      },
      paymentPlan: {
        "Deposit": "KES 150,000",
        "Balance": "KES 400,000",
        "Installments": "12 Monthly Payments",
        "Monthly Payment": "KES 33,333",
      },
      quickInfo: {
        "Location": "Chumani, Kilifi County",
        "Highway Distance": "300m from Kilifi-Malindi Highway",
        "Plot Size": "1/8 Acre",
        "Property Type": "Residential Development",
        "Development Status": "Ready for Immediate Settlement",
        "Utilities": "Water & Electricity Available",
        "Total Price": "KES 550,000",
        "Payment Plan": "Deposit + 12 Monthly Installments",
      },
    },
    9: {
      id: 9,
      title: "Ocean View Gardens",
      location: "Tezo, Kilifi County",
      type: "residential",
      price: "KES 495,000",
      size: "1/8 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
      description: "Ocean View Gardens offers premium residential and mixed development serviced plots in the picturesque Tezo area of Kilifi County. This development combines the tranquility of coastal living with excellent accessibility, making it an ideal location for both permanent residents and vacation homeowners. The project is strategically positioned just 1km from the pristine beach, offering residents easy access to coastal activities while maintaining proximity to major transportation routes. With essential utilities already on site and all-inclusive pricing that covers all legal processes, this development provides exceptional value for money.",
      features: [
        "All-Inclusive Pricing",
        "Beach Proximity - 1km from pristine beach",
        "Highway Access - 2.5km from Kilifi-Mombasa Highway",
        "Serviced Plots",
        "Utilities on Site (Water & Electricity)",
        "Tranquility of coastal living",
        "Excellent accessibility",
        "Ideal for permanent residents and vacation homeowners",
        "All legal processes covered in pricing",
      ],
      pricing: {
        "1/8 Acre": "KES 495,000",
      },
      quickInfo: {
        "Location": "Tezo, Kilifi County",
        "Distance to Beach": "1km",
        "Distance to Highway": "2.5km from Kilifi-Mombasa Highway",
        "Plot Size": "1/8 Acre",
        "Property Type": "Residential/Mixed Development",
        "Utilities": "Water & Electricity on Site",
        "Pricing": "All-Inclusive (KES 495,000)",
        "Covered Costs": "Legal Fees, Stamp Duty, Transfer Process",
      },
    },
    6: {
      id: 6,
      title: "Malindi Airport Gardens",
      location: "Ganda Furunzi Area, Malindi",
      type: "beach",
      price: "KES 950,000",
      size: "1/8 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287215/Malindi_Airport_Gardens_dphmr6.jpg",
      description: "Malindi Airport View Gardens is strategically located in Ganda Furunzi Area, Malindi, offering the perfect blend of accessibility, coastal living, and investment potential. This premium development is positioned for maximum growth and convenience in one of Kenya's most desirable coastal regions. The project offers exceptional connectivity with proximity to Malindi Airport and easy access to Watamu, while providing a secure, cosmopolitan neighborhood environment. With essential amenities nearby and booming development in the area, this is an ideal location for both permanent residents and vacation homeowners.",
      features: [
        "Airport Proximity - Just 3km from Malindi Airport",
        "Coastal Living - Minutes away from Malindi Ocean & Beach",
        "Healthcare Access - Nearby hospitals for quality healthcare",
        "Educational Facilities - Schools in the vicinity",
        "Recreation Spots - Various recreation spots available",
        "Secure Community - Cosmopolitan neighborhood",
        "Tourist Hub Access - 10km to Watamu",
        "Booming Development Area",
      ],
      pricing: {
        "1/8 Acre": "KES 950,000",
      },
      quickInfo: {
        "Location": "Ganda Furunzi Area, Malindi",
        "County": "Kilifi County",
        "Distance to Airport": "3km",
        "Distance to Watamu": "10km",
        "Distance to Beach": "Minutes away",
        "Plot Size": "1/8 Acre",
        "Property Type": "Residential Development",
        "Community": "Cosmopolitan Neighborhood",
        "Development Status": "Booming Area",
      },
    },
    7: {
      id: 7,
      title: "Msabaha Phase 6",
      location: "Malindi, Kizingo Area",
      type: "residential",
      price: "KES 450,000",
      size: "1/8 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287397/Msabaha_Phase_6_2_vebo06.jpg",
      description: "Msabaha Phase 6 is strategically located in Malindi, Kizingo area, one of the fastest growing areas in Kilifi County. This premium development offers exceptional accessibility and growth potential for discerning buyers seeking strategic investments in the coastal region. The project is perfectly positioned for immediate development and settlement, making it ideal for holiday homes, cottages, and residential development. With essential infrastructure already in place, including water and electricity, this development is ready for immediate use.",
      features: [
        "Highway Accessibility - Just 1.3km from Mombasa-Malindi highway",
        "Gede-Watamu Junction - Only 1.8km from Gede-Watamu junction",
        "Airport Proximity - Just 10 minutes drive to Malindi International Airport",
        "Town Accessibility - 10 minutes drive to Malindi town",
        "Water Available - Reliable water supply available on site",
        "Electricity Available - Infrastructure already in place",
        "Perfect for holiday homes, cottages, and residential development",
        "Fast-growing area with exceptional growth potential",
      ],
      pricing: {
        "1/8 Acre": "KES 450,000",
      },
      quickInfo: {
        "Location": "Malindi, Kizingo Area",
        "County": "Kilifi County",
        "Distance to Highway": "1.3km",
        "Distance to Gede-Watamu": "1.8km",
        "Distance to Airport": "10 minutes drive",
        "Distance to Malindi Town": "10 minutes drive",
        "Plot Size": "1/8 Acre",
        "Property Type": "Residential Development",
        "Water Supply": "Available",
        "Electricity": "Available",
      },
    },
    8: {
      id: 8,
      title: "Bofa Phase 21",
      location: "Bofa, Kilifi County",
      type: "residential",
      price: "KES 1,850,000",
      size: "1/8 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767291293/Bofa_Phase_21_17_ss7xhv.jpg",
      description: "Bofa Phase 21 offers premium development plots located off the newly tarmacked Bofa Road (B69), providing excellent accessibility and modern infrastructure. This development combines the convenience of urban living with the tranquility of a well-planned residential area, making it perfect for both residential development and investment opportunities. The project features complete infrastructure including water and electricity connections, well-demarcated plots with beacons, access roads, and perimeter fencing. With flexible payment terms and immediate development potential, this location offers exceptional value for money in one of Kilifi County's most accessible and well-developed areas.",
      features: [
        "Tarmacked Road Access - Located off the newly tarmacked Bofa Road (B69)",
        "Water & Electricity - Complete utility connections available",
        "Well Demarcated - All plots professionally demarcated with beacons",
        "Access Roads - Well-planned access roads provided",
        "Perimeter Fence - Secure perimeter fencing for added security",
        "Premium 1/8th acre plots",
        "Flexible Payment Terms - Deposit KES 700,000 with 12 monthly installments",
        "Immediate Development Potential - Ready for immediate development",
        "High ROI Potential - Consistent appreciation with excellent infrastructure",
        "Excellent Connectivity - Easy access to major highways and towns",
      ],
      pricing: {
        "1/8 Acre": "KES 1,850,000",
      },
      paymentPlan: {
        "Total Price": "KES 1,850,000",
        "Initial Deposit": "KES 700,000",
        "Remaining Balance": "KES 1,150,000",
        "Monthly Installments": "12 months",
        "Monthly Payment": "KES 95,833",
      },
      quickInfo: {
        "Location": "Bofa, Kilifi County",
        "Road Access": "Tarmacked Bofa Road (B69)",
        "Plot Size": "1/8th Acre",
        "Property Type": "Residential Development",
        "Utilities": "Water & Electricity",
        "Security": "Perimeter Fence",
        "Demarcation": "Well demarcated with beacons",
        "Development Status": "Ready for immediate development",
        "Payment Terms": "Deposit KES 700,000 + 12 Monthly Installments",
      },
    },
    5: {
      id: 5,
      title: "Mtondia Highway Gardens",
      location: "Mtondia, Kilifi County",
      type: "residential",
      price: "KES 1,250,000",
      size: "1/8 Acre",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286867/Mtondia_Higway_Gardens_2_rwwsyi.jpg",
      description: "Mtondia Highway Gardens offers premium residential and commercial serviced plots in the fast-growing Mtondia area, strategically positioned to touch the Kilifi-Malindi Highway. This development combines accessibility, security, and growth potential in one of Kilifi County's most promising locations. The project is perfectly suited for various development purposes including commercial apartments, holiday homes, cottages, and student hostels, making it an ideal investment for both residential and commercial developers. With essential utilities already on site and a cosmopolitan population, this location offers excellent potential for high returns.",
      features: [
        "Highway Access - Direct access to Kilifi-Malindi Highway",
        "University Proximity - Just 4.5km from Pwani University",
        "Serviced Plots",
        "Water Supply - Reliable water supply already available on site",
        "Electricity - Infrastructure already in place",
        "Multiple Development Options - Commercial apartments, holiday homes, cottages, and student hostels",
        "Secure Environment - Highly secure location with cosmopolitan population",
        "Fast Growing Town - Increasing development and investment potential",
      ],
      pricing: {
        "1/8 Acre": "KES 1,250,000",
        "1/4 Acre": "KES 2,500,000",
      },
      quickInfo: {
        "Location": "Mtondia, Kilifi County",
        "Highway Access": "Touching Kilifi-Malindi Highway",
        "Distance to Pwani University": "4.5km",
        "Plot Sizes Available": "1/8 & 1/4 Acre",
        "Property Type": "Residential/Commercial",
        "Development Status": "Fast Growing Town",
        "Utilities": "Water & Electricity on Site",
        "Security": "Highly Secure Location",
        "Population": "Cosmopolitan",
      },
    },
  };
  
  const property = properties[propertyId] || properties[1]; // Default to Bofa Platinum if ID not found

  // In a real app, check if property exists
  if (isNaN(propertyId) || propertyId < 1) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20">
      <section className="container mx-auto px-4 py-8">
        <Link
          href="/for-sale"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Properties
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[500px] rounded-xl overflow-hidden"
          >
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-dark-900 mb-4">{property.title}</h1>
              <div className="flex items-center text-dark-600 mb-4">
                <MapPin size={20} className="mr-2 text-primary-600" />
                <span>{property.location}</span>
              </div>
              <div className="text-4xl font-bold text-primary-700 mb-6">{property.price}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Square size={20} className="text-primary-600" />
                <span className="text-dark-600">{property.size}</span>
              </div>
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-primary-600" />
                  <span className="text-dark-600">{property.bedrooms} Bedrooms</span>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <a
                href="tel:+254711082084"
                className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition text-center flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                Call Now
              </a>
              <a
                href="mailto:info@inukaproperties.co.ke"
                className="block w-full bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition text-center border-2 border-primary-600 flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Email Us
              </a>
              <Link
                href="/book-site-visit"
                className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition text-center"
              >
                Book Site Visit
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Description</h2>
              <p className="text-dark-700 leading-relaxed">{property.description}</p>
            </div>

            {property.pricing && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Available Sizes & Pricing</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(property.pricing).map(([size, price]) => (
                    <div key={size} className="border-2 border-primary-200 rounded-lg p-4 hover:border-primary-400 transition">
                      <div className="text-lg font-semibold text-dark-900 mb-2">{size} Plot</div>
                      <div className="text-2xl font-bold text-primary-600">{price as string}</div>
                      {size === "1/8 Acre" && property.id === 2 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Prime Location</div>
                          <div>• Coastal Ambiance</div>
                          <div>• Highway Access</div>
                        </div>
                      )}
                      {size === "1/4 Acre" && property.id === 2 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Best Value</div>
                          <div>• Larger Development</div>
                          <div>• Investment Potential</div>
                          <div>• Thriving Community</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 4 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Flexible Payments</div>
                          <div>• Highway Proximity</div>
                          <div>• Ready for Development</div>
                          <div>• Utilities Available</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 9 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• All-Inclusive</div>
                          <div>• Beach Proximity</div>
                          <div>• Highway Access</div>
                          <div>• Serviced Plots</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 5 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Highway Access</div>
                          <div>• University Proximity</div>
                          <div>• Serviced Plots</div>
                        </div>
                      )}
                      {size === "1/4 Acre" && property.id === 5 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Best Value</div>
                          <div>• Larger Development</div>
                          <div>• Commercial Potential</div>
                          <div>• Premium Location</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 6 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Prime Location</div>
                          <div>• Airport Proximity</div>
                          <div>• Coastal Bliss</div>
                          <div>• High Growth Potential</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 7 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Strategic Location</div>
                          <div>• Perfect for Holiday Homes</div>
                          <div>• Airport Proximity</div>
                          <div>• Fast-Growing Area</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 8 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Tarmacked Road Access</div>
                          <div>• Water & Electricity</div>
                          <div>• Well Demarcated</div>
                          <div>• Perimeter Fence</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.paymentPlan && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Flexible Payment Terms</h2>
                <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold text-primary-700 mb-1">Deposit:</div>
                      <div className="text-2xl font-bold text-primary-600">{property.paymentPlan.Deposit}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-700 mb-1">Balance:</div>
                      <div className="text-2xl font-bold text-primary-600">{property.paymentPlan.Balance}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-700 mb-1">Installments:</div>
                      <div className="text-xl font-bold text-dark-900">{property.paymentPlan.Installments}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-700 mb-1">Monthly Payment:</div>
                      <div className="text-xl font-bold text-dark-900">{property.paymentPlan["Monthly Payment"]}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {property.quickInfo && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Quick Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(property.quickInfo).map(([label, value]) => (
                    <div key={label} className="border-l-4 border-primary-600 pl-4">
                      <div className="text-sm font-semibold text-primary-600 mb-1">{label}:</div>
                      <div className="text-dark-700">{value as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Project Features</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {property.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-dark-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              <h3 className="text-xl font-bold text-dark-900 mb-4">Interested?</h3>
              <p className="text-dark-600 mb-6">
                Contact us today to schedule a viewing or get more information about this property.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+254711082084"
                  className="block text-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  0711 082084
                </a>
                <a
                  href="mailto:info@inukaproperties.co.ke"
                  className="block text-center bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition border-2 border-primary-600"
                >
                  info@inukaproperties.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

