"use client";

import { motion } from "framer-motion";
import { Home, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function OurTeamPage() {
  const [selectedDirectors, setSelectedDirectors] = useState<Set<number>>(new Set());
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Set<number>>(new Set());

  // Directors (Executive)
  const directors = [
    {
      name: "Joseph Mbugua",
      title: "Director - Marketing",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767434501/Joseph_Mbugua_v4k2c4.jpg",
      description: "Joseph Mbugua is the Director at Inuka Afrika Properties, where he is in charge of Marketing and brand growth. He plays a key role in promoting the company's real estate solutions and strengthening its market presence. Professionally trained as a Clearing and Forwarding Officer, Joseph brings strong expertise in logistics, coordination, and operational management. His background allows him to apply strategic planning and efficiency-driven approaches to real estate marketing and client engagement. Through his leadership, Joseph contributes to building trust with clients, driving business growth, and positioning Inuka Afrika Properties as a reliable and customer-focused real estate company.",
    },
    {
      name: "Josphat Muchere",
      title: "Director - Projects and IT",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767434501/Josphat_Muchere_mtskmd.jpg",
      description: "Josphat Muchere is the Director of Projects and IT at Inuka Afrika Properties, where he oversees project execution, systems management, and technology-driven operations. He plays a critical role in ensuring projects are delivered efficiently while aligning technology with the company's strategic goals. With a strong background in project coordination and information technology, Josphat brings a structured, solutions-oriented approach to real estate development and operations. His expertise supports effective planning, process optimization, and the integration of digital tools to enhance performance and service delivery. Through his leadership, Josphat contributes to operational excellence, innovation, and the successful implementation of projects across the organization.",
    },
    {
      name: "Kelvin Ngigi Mbugua",
      title: "Director - Finance and Debt Collection",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767434501/Kelvin_Mbugua_xwo7d7.jpg",
      description: "Kelvin Ngigi Mbugua is the Director in charge of Finance and Debt Collection at Inuka Afrika Properties, where he oversees financial management, revenue control, and debt recovery processes. He plays a key role in ensuring the company's financial stability and sustainable growth. Professionally trained as an Engineer, Kelvin brings a strong analytical and problem-solving approach to financial planning and management. In addition to his finance responsibilities, he is actively involved in the company's affordable housing initiatives, contributing technical insight to the development of practical, cost-effective housing solutions. Through his leadership, Kelvin supports financial accountability, operational efficiency, and the advancement of affordable housing within the organization.",
    },
  ];

  // Team Members
  const teamMembers = [
    {
      name: "Ruth Mueni",
      title: "General Manager",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384363/RuthMueni-GeneralManager_g2lcr5.jpg",
      description: "Ruth Mueni serves as the General Manager at Inuka Afrika Properties, where she provides strategic leadership and oversees the overall operations of the company. She plays a crucial role in coordinating between different departments, ensuring organizational efficiency, and driving the company's growth objectives. With her comprehensive management expertise, Ruth ensures that all business functions align with the company's mission and vision. She is responsible for implementing strategic initiatives, managing resources effectively, and maintaining high standards of service delivery. Through her leadership, Ruth contributes to creating a cohesive work environment and ensuring that Inuka Afrika Properties continues to deliver exceptional value to clients and stakeholders.",
    },
    {
      name: "Esther Kibandi",
      title: "Sales and Marketing Manager",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384362/EstherKibandi-SalesandMarketingManager_gbt8zx.jpg",
      description: "Esther Kibandi is the Sales and Marketing Manager at Inuka Afrika Properties, where she leads the company's sales initiatives and marketing strategies. She is responsible for developing and executing comprehensive marketing campaigns that promote the company's real estate offerings and attract potential clients. Esther manages the sales team, coordinates client acquisition efforts, and works closely with the marketing department to ensure consistent brand messaging. Her role involves market research, client relationship management, and developing strategies to expand the company's market reach. Through her expertise, Esther drives revenue growth, enhances brand visibility, and ensures that Inuka Afrika Properties maintains a strong competitive position in the real estate market.",
    },
    {
      name: "Valentine Kerubo",
      title: "Head Accountant",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384363/ValentineKerubo-HeadAccountant_srl5yg.jpg",
      description: "Valentine Kerubo serves as the Head Accountant at Inuka Afrika Properties, where she oversees all financial accounting operations and ensures accurate financial reporting. She is responsible for managing the company's financial records, preparing financial statements, and ensuring compliance with accounting standards and regulations. Valentine plays a critical role in budgeting, financial analysis, and providing financial insights to support strategic decision-making. Her expertise in accounting principles and financial management helps maintain the company's financial integrity and supports sustainable business growth. Through her meticulous attention to detail and financial acumen, Valentine ensures that all financial transactions are properly recorded and that the company maintains transparent and accurate financial records.",
    },
    {
      name: "Alex Etidit",
      title: "IT Manager",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384362/AlexEtidit-ITManager_ud1mce.jpg",
      description: "Alex Etidit is the IT Manager at Inuka Afrika Properties, where he manages the company's information technology infrastructure and systems. He is responsible for ensuring that all IT systems operate efficiently, securely, and support the company's operational needs. Alex oversees the implementation of new technologies, maintains existing systems, and provides technical support to staff across all departments. His role involves managing network security, data backup and recovery, software updates, and ensuring that technology solutions align with business objectives. Through his technical expertise, Alex helps streamline operations, improve productivity, and ensure that Inuka Afrika Properties leverages technology effectively to serve clients and maintain a competitive edge in the digital landscape.",
    },
    {
      name: "Benjamin Maza",
      title: "Head of Logistics and Transport",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384362/BenjaminMaza-HeadofLogisticsandTransport_tiqw0b.jpg",
      description: "Benjamin Maza serves as the Head of Logistics and Transport at Inuka Afrika Properties, where he manages the company's transportation and logistics operations. He is responsible for coordinating the movement of materials, equipment, and personnel required for various projects and business activities. Benjamin oversees vehicle fleet management, route planning, and ensures timely delivery of services. His role involves managing logistics partnerships, optimizing transportation costs, and ensuring that all logistics operations run smoothly and efficiently. Through his expertise in logistics and transport management, Benjamin supports project execution, client site visits, and overall operational efficiency, contributing to the company's ability to deliver services effectively across different locations.",
    },
    {
      name: "Derick Mogaka",
      title: "Graphic Designer and Social Media Manager",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384362/DerickMogaka-GraphicDesignerandSocialMediaManager_noblnu.jpg",
      description: "Derick Mogaka is the Graphic Designer and Social Media Manager at Inuka Afrika Properties, where he combines creative design skills with digital marketing expertise. He is responsible for creating visually compelling marketing materials, including brochures, advertisements, and digital content that effectively communicate the company's brand and property offerings. Derick manages the company's social media presence across various platforms, developing engaging content strategies and maintaining consistent brand messaging. His role involves graphic design, content creation, social media campaign management, and analyzing engagement metrics to optimize digital marketing efforts. Through his creative and strategic approach, Derick helps enhance brand visibility, engage with potential clients, and strengthen Inuka Afrika Properties' online presence in the competitive real estate market.",
    },
    {
      name: "Liz Ntziki",
      title: "Office Administrator",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384362/LizNtziki-OfficeAdministrator_b8qotj.jpg",
      description: "Liz Ntziki serves as the Office Administrator at Inuka Afrika Properties, where she ensures the smooth day-to-day operations of the office. She is responsible for managing administrative tasks, coordinating office activities, and providing support to all departments. Liz handles document management, scheduling, correspondence, and maintains organized office systems. Her role involves client communication, managing office supplies, coordinating meetings, and ensuring that administrative processes run efficiently. Through her organizational skills and attention to detail, Liz contributes to creating a well-functioning office environment that supports the company's operations and enables staff to focus on their core responsibilities, ultimately enhancing overall productivity and service delivery.",
    },
    {
      name: "Sophia Santa",
      title: "Registry",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384363/SophiaSanta-Registry_he9g7b.jpg",
      description: "Sophia Santa serves in the Registry department at Inuka Afrika Properties, where she manages important company documents and records. She is responsible for maintaining organized filing systems, ensuring proper documentation of transactions, and managing the storage and retrieval of critical business documents. Sophia plays a key role in document control, record keeping, and ensuring that all important paperwork is properly catalogued and easily accessible when needed. Her role involves handling property documentation, legal records, and maintaining compliance with record-keeping requirements. Through her meticulous organization and management of company records, Sophia supports efficient operations, facilitates quick access to important information, and ensures that Inuka Afrika Properties maintains proper documentation standards for all business activities.",
    },
    {
      name: "Tabitha Wangari",
      title: "Office Assistant",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768384364/Tabitha_Wangari-_office_assistant_kvrajb.jpg",
      description: "Tabitha Wangari serves as the Office Assistant at Inuka Afrika Properties, where she provides essential support to ensure the office operates smoothly. She assists with various administrative tasks, helps maintain a clean and organized work environment, and supports staff members across different departments. Tabitha handles routine office duties, assists with client inquiries, and helps coordinate day-to-day office activities. Her role involves providing general administrative support, managing office supplies, and ensuring that the office environment is conducive to productivity. Through her dedication and support, Tabitha contributes to the efficient functioning of the office, enabling other team members to focus on their specialized responsibilities and ensuring that clients receive prompt and professional service.",
    },
  ];


  const aboutLinks = [
    { name: "About Us", href: "/about-us", active: false },
    { name: "Our Team", href: "/about-us/our-team", active: true },
  ];

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="container mx-auto px-4">
              {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-dark-600 text-sm md:text-base">
            <Link href="/" className="hover:text-primary-600 transition font-montserrat">
              INUKA AFRIKA PROPERTIES
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
            <Link href="/about-us" className="hover:text-primary-600 transition font-montserrat">
              ABOUT US
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
            <span className="text-dark-900 font-montserrat">OUR TEAM</span>
          </div>
              </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="border-2 border-primary-600 rounded-lg p-6 bg-white shadow-sm"
            >
              <h2 className="text-xl font-bold text-dark-900 mb-6 font-montserrat">ABOUT</h2>
              <nav className="space-y-3">
                {aboutLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={`flex items-center gap-2 font-bold text-sm md:text-base transition ${
                      link.active
                        ? "text-dark-900"
                        : "text-dark-700 hover:text-primary-600"
                    } font-montserrat`}
                  >
                    {link.active && (
                      <Play size={16} className="text-primary-600" fill="currentColor" />
                    )}
                    {!link.active && link.name !== "About Us" && (
                      <Play size={16} className="text-primary-600" />
                    )}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
            
            {/* Dashed line pattern below sidebar */}
            <div className="mt-6 hidden lg:block">
              <div className="border-t-2 border-dashed border-dark-300"></div>
        </div>

            {/* Vision and Mission in Sidebar */}
            <div className="mt-8 space-y-6">
              {/* Our Vision Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                transition={{ duration: 0.6 }}
          >
                <h2 className="text-xl md:text-2xl font-bold text-dark-900 mb-3 font-montserrat">
                  OUR VISION
            </h2>
                <p className="text-sm md:text-base text-dark-700 leading-relaxed font-montserrat">
                  To transform the real estate landscape in Kenya with affordable and accessible property solutions.
                </p>
              </motion.section>

              {/* Our Mission Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-dark-900 mb-3 font-montserrat">
                  OUR MISSION
                </h2>
                <p className="text-sm md:text-base text-dark-700 leading-relaxed font-montserrat">
                  To provide comprehensive real estate services that meet our clients' property and land ownership needs.
                </p>
              </motion.section>

              {/* Our Core Values Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-dark-900 mb-3 font-montserrat">
                  OUR CORE VALUES
                </h2>
                <ul className="space-y-2 text-sm md:text-base text-dark-700 leading-relaxed font-montserrat">
                  <li>• <strong>Integrity:</strong> We conduct business with honesty and transparency</li>
                  <li>• <strong>Customer Focus:</strong> Our clients' satisfaction is our top priority</li>
                  <li>• <strong>Excellence:</strong> We strive for the highest standards in all our services</li>
                  <li>• <strong>Innovation:</strong> We embrace new solutions to better serve our clients</li>
                  <li>• <strong>Trust:</strong> We build lasting relationships based on reliability</li>
                </ul>
              </motion.section>
          </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {/* Executive Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-600 mb-8 text-left font-montserrat">
                EXECUTIVE
                </h2>

              {/* Executive Profiles Grid */}
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
                {directors.map((member, index) => {
                  const isExpanded = selectedDirectors.has(index);
                  return (
                  <motion.div
                      key={index}
                    initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="bg-white overflow-hidden"
                    >
                      {/* Member Image */}
                      <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        quality={90}
                      />
                    </div>
                      
                      {/* Member Info */}
                      <div className="p-4 md:p-6 text-center">
                        <h3 className="text-lg md:text-xl font-bold text-dark-900 mb-2 font-montserrat">
                          {member.name.toUpperCase()}
                      </h3>
                        <p className="text-sm md:text-base text-dark-600 mb-4 font-montserrat">
                          {member.title}
                        </p>
                        <button
                          onClick={() => {
                            const newSet = new Set(selectedDirectors);
                            if (isExpanded) {
                              newSet.delete(index);
                            } else {
                              newSet.add(index);
                            }
                            setSelectedDirectors(newSet);
                          }}
                          className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition font-montserrat text-sm md:text-base w-full"
                        >
                          {isExpanded ? "View less" : "View more"}
                        </button>
                      </div>

                      {/* Expanded Details Below Card */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 md:px-6 pb-4 md:pb-6"
                        >
                          <div className="pt-4 border-t border-dark-200">
                            <p className="text-sm md:text-base text-dark-700 leading-relaxed font-montserrat text-left">
                              {member.description}
                      </p>
                    </div>
                  </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Dashed line separator */}
            <div className="my-12">
              <div className="border-t-2 border-dashed border-dark-300"></div>
        </div>

            {/* Team Members Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-600 mb-8 text-left font-montserrat">
                OUR TEAM
              </h2>

              {/* Team Members Grid */}
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
                {teamMembers.map((member, index) => {
                  const isExpanded = selectedTeamMembers.has(index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="bg-white overflow-hidden"
                    >
                      {/* Member Image */}
                      <div className="relative w-full aspect-[3/4] overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          quality={90}
                        />
                      </div>
                      
                      {/* Member Info */}
                      <div className="p-4 md:p-6 text-center">
                        <h3 className="text-lg md:text-xl font-bold text-dark-900 mb-2 font-montserrat">
                          {member.name.toUpperCase()}
                        </h3>
                        <p className="text-sm md:text-base text-dark-600 mb-4 font-montserrat">
                          {member.title}
                        </p>
                        <button
                          onClick={() => {
                            const newSet = new Set(selectedTeamMembers);
                            if (isExpanded) {
                              newSet.delete(index);
                            } else {
                              newSet.add(index);
                            }
                            setSelectedTeamMembers(newSet);
                          }}
                          className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition font-montserrat text-sm md:text-base w-full"
                        >
                          {isExpanded ? "View less" : "View more"}
                        </button>
                      </div>

                      {/* Expanded Details Below Card */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 md:px-6 pb-4 md:pb-6"
                        >
                          <div className="pt-4 border-t border-dark-200">
                            <p className="text-sm md:text-base text-dark-700 leading-relaxed font-montserrat text-left">
                              {member.description}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Dashed line separator */}
            <div className="my-12">
              <div className="border-t-2 border-dashed border-dark-300"></div>
            </div>

            {/* Sales Team Section - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="w-full"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-600 mb-8 text-left font-montserrat">
                SALES TEAM
              </h2>

              {/* Sales Team Images Grid - 2 columns per row, landscape images */}
              <div className="space-y-6 lg:space-y-8 mb-12 w-full">
                {/* Row 1: 2 images */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8 w-full">
                  {[
                    "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768633314/TheTeam1_cfiuux.jpg",
                    "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768633314/TheTeam2_d4yvtv.jpg",
                  ].map((imageUrl, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="bg-white overflow-hidden w-full"
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={`Sales Team Member ${index + 1}`}
                          fill
                          className="object-cover"
                          quality={90}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Row 2: 2 images */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8 w-full">
                  {[
                    "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768633315/TheTeam3_fhahx2.jpg",
                    "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768633314/TheTeam4_c4kv9d.jpg",
                  ].map((imageUrl, index) => (
                    <motion.div
                      key={index + 2}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                      className="bg-white overflow-hidden w-full"
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={`Sales Team Member ${index + 3}`}
                          fill
                          className="object-cover"
                          quality={90}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Row 3: 1 image (full width) */}
                <div className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    className="bg-white overflow-hidden w-full"
                  >
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <Image
                        src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1768633315/TheTeam5_q0gmur.jpg"
                        alt="Sales Team Member 5"
                        fill
                        className="object-cover"
                        quality={90}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Dashed line at bottom */}
            <div className="mt-12">
              <div className="border-t-2 border-dashed border-dark-300"></div>
          </div>
          </main>
        </div>
      </div>
    </div>
  );
}
