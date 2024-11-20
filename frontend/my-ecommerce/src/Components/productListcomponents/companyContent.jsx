import React from "react";

const AboutCompany = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-900">About Us</h3>

        <div className="mt-8 space-y-2">
          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Company Name:</span>
            <span className="text-gray-600">OGCS</span>
          </div>

          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Industry:</span>
            <span className="text-gray-600">Civil Engineering Products</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Our Mission:</span>
            <span className="text-gray-600">
              Provide top-quality civil engineering products that meet the highest industry standards, ensuring safety, durability, and cost-effectiveness.
            </span>
          </div>

          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Product Range:</span>
            <span className="text-gray-600">Construction materials, heavy machinery, and other engineering solutions.</span>
          </div>

          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Our Commitment:</span>
            <span className="text-gray-600">
              Empower contractors, builders, and engineers by providing reliable and durable products.
            </span>
          </div>

          <div className="flex">
            <span className="font-semibold text-gray-700 mr-2">Customer Support:</span>
            <span className="text-gray-600">
              Our customer-first approach ensures we're always here to assist with product selection, bulk purchases, and order processing.
            </span>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">Why Choose OGCS?</h3>
            <ul className="list-disc pl-6 mt-4 text-gray-600">
              <li>Trusted by industry professionals for over a decade.</li>
              <li>Wide selection of high-quality civil engineering products.</li>
              <li>Competitive pricing and bulk order discounts.</li>
              <li>Quick and reliable shipping services to meet project deadlines.</li>
              <li>Expert guidance and consultation on product selection and usage.</li>
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">Our Values</h3>
            <div className="flex">
              <span className="font-semibold text-gray-700 mr-2">Integrity:</span>
              <span className="text-gray-600">We maintain transparency and honesty in all our dealings.</span>
            </div>

            <div className="flex">
              <span className="font-semibold text-gray-700 mr-2">Quality:</span>
              <span className="text-gray-600">We prioritize the highest standards in the products we offer.</span>
            </div>

            <div className="flex">
              <span className="font-semibold text-gray-700 mr-2">Innovation:</span>
              <span className="text-gray-600">We strive to introduce new and advanced products that improve construction processes.</span>
            </div>

            <div className="flex">
              <span className="font-semibold text-gray-700 mr-2">Customer Satisfaction:</span>
              <span className="text-gray-600">Our focus is on delivering a seamless customer experience from order to delivery.</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">Client Testimonials</h3>
            <p className="text-gray-600 mt-4 italic">
              "OGCS has been an invaluable partner for our construction projects. Their quality products and responsive customer service have made a significant difference in the success of our work."
            </p>
            <p className="text-gray-600 mt-2 italic">
              "We've relied on OGCS for several years now, and they consistently deliver top-notch products. Their commitment to excellence and customer support is unmatched."
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">Our Achievements</h3>
            <ul className="list-disc pl-6 mt-4 text-gray-600">
              <li>Awarded 'Best Civil Engineering Supplier' by the National Construction Association.</li>
              <li>Over 500 successful projects completed worldwide.</li>
              <li>Consistently ranked as a top supplier in the civil engineering industry for customer satisfaction and product reliability.</li>
            </ul>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-800">Sustainability Efforts</h3>
            <p className="text-gray-600 mt-4">
              At OGCS, we are committed to sustainability and environmental responsibility. Our products are manufactured using eco-friendly materials, and we continuously work towards minimizing our carbon footprint. We aim to promote sustainable construction practices while ensuring the highest quality and durability in our offerings.
            </p>
          </div>

          <div className="mt-12">
            <a
              href="https://www.ogcs.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
            >
              Visit Our Website for More Information
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany;
