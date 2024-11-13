import React from 'react';
import './TermsModal.css';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Terms and Conditions</h2>
        <div className="terms-content">
          <TermsSection title="Registration and Subscription">
            <ol>
              <li>Suppliers must register on the BuildPro OGCS portal by submitting accurate and verifiable business details, including certifications, licenses, and product documentation.</li>
              <li>Service charges are payable upfront, and services will commence upon successful verification of the submitted documents.</li>
            </ol>
          </TermsSection>

          <TermsSection title="Product Listing and Data Submission">
            <ol>
              <li>Suppliers are responsible for regularly updating their product catalogs, specifications, and compliance certificates. Any changes to product offerings must be communicated to BuildPro OGCS immediately.</li>
              <li>Suppliers must ensure all uploaded data, including product specifications and compliance certificates, are current and meet regulatory standards.</li>
            </ol>
          </TermsSection>

          <TermsSection title="Service Activation and Cancellation">
            <ol>
              <li>Services will remain active for the duration of the subscription unless canceled.</li>
              <li>Cancellation within the first month is eligible for a refund as per BuildPro OGCS’s refund policy. No refunds are applicable after the first month unless the product is discontinued.</li>
            </ol>
          </TermsSection>

          <TermsSection title="Visibility and Marketing Compliance">
            <ol>
              <li>Suppliers subscribing to higher visibility tiers (such as 3X or 4X) must comply with all relevant advertising regulations.</li>
              <li>False or misleading claims in advertisements will result in the suspension or termination of services.</li>
              <li>Advertisements must adhere to government regulations and industry standards. BuildPro OGCS reserves the right to suspend any non-compliant advertisements without prior notice.</li>
            </ol>
          </TermsSection>

          <TermsSection title="Product Quality, Liability, and Compliance">
            <ol>
              <li>Suppliers are responsible for ensuring their products meet all quality and legal standards, such as BIS and ISO certifications.</li>
              <li>BuildPro OGCS is not liable for verifying the authenticity of products beyond reviewing the documentation provided by suppliers.</li>
            </ol>
          </TermsSection>

          <TermsSection title="Separate Terms for Fulfillment by BuildPro OGCS">
            <ol>
              <li>When BuildPro OGCS provides supply or services on behalf of suppliers, separate terms will apply. These will be made available prior to service initiation.</li>
            </ol>
          </TermsSection>

          <TermsSection title="Payment Terms and Refund Policy">
            <ol>
              <li>Suppliers must complete payment in full before accessing services. Delays in payment will result in service suspension.</li>
              <li>Refunds, when applicable, will be issued after deducting administrative charges as outlined in BuildPro OGCS’s refund policy.</li>
            </ol>
          </TermsSection>

          <TermsSection title="Compliance with Legal and Ethical Standards">
            <ol>
              <li>Suppliers must comply with all local and international laws, including environmental regulations and ethical manufacturing practices.</li>
              <li>Suppliers found in violation of these laws may face service termination without entitlement to a refund.</li>
            </ol>
          </TermsSection>

          <TermsSection title="Dispute Resolution">
            <ol>
              <li></li>
            </ol>
          </TermsSection>

          <button className="close-modal" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const TermsSection = ({ title, children }) => {
  return (
    <div>
      <h4>{title}</h4>
      {children}
    </div>
  );
};

export default TermsModal;