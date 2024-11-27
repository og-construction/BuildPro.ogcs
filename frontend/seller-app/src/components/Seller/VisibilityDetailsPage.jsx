import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VisibilityDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tierTitle } = location.state;

  // Define static content for each tier
  const tierDetails = {
    '1X Visibility': {
      description: 'Basic module with standard visibility. The product will be visible to 10 prospective buyers out of 100 searching in the same geographic circle.',
      visibilityExplanation: ['1X Visibility: The product will appear in the search results in a standard position.'],
      operationalDetails: [
        'Visibility Service: The visibility tier determines how prominently the product will appear to buyers in specific geographic areas.',
        'Visibility Rotation: For fairness, the product listing sequence may rotate among suppliers within the same visibility tier.',
        'Refund and Cancellation Policy: No refunds after registration and payment. If a supplier discontinues their product, they must provide valid documentation for refund consideration.',
        'Product and Service Data: Suppliers must maintain accurate product specifications and documentation.',
        'Supplier Responsibility: Suppliers are responsible for ensuring product quality and regulatory compliance.',
        'Service Termination: BuildPro OGCS reserves the right to terminate services for unethical practices.',
      ],
    },
    '2X Visibility': {
      description: 'Enhanced visibility. The product will be visible to 20 prospective buyers out of 100.',
      visibilityExplanation: ['2X Visibility: The product’s position is elevated, appearing higher in search results.'],
      operationalDetails: [
        'Visibility Service: The visibility tier determines how prominently the product will appear to buyers in specific geographic areas.',
        'Visibility Rotation: For fairness, the product listing sequence may rotate among suppliers within the same visibility tier.',
        'Refund and Cancellation Policy: No refunds after registration and payment. If a supplier discontinues their product, they must provide valid documentation for refund consideration.',
        'Product and Service Data: Suppliers must maintain accurate product specifications and documentation.',
        'Supplier Responsibility: Suppliers are responsible for ensuring product quality and regulatory compliance.',
        'Service Termination: BuildPro OGCS reserves the right to terminate services for unethical practices.',
      ],
    },
    '3X Visibility + Video Informative Advertisement': {
      description: 'Increased visibility. The product will be visible to 30 prospective buyers out of 100, and a short informative video advertisement will play in search results (visible to 10% of searchers).',
      visibilityExplanation: ['3X Visibility: The product’s visibility is further increased, appearing in a prominent position in search results.'],
      operationalDetails: [
        'Visibility Service: The visibility tier determines how prominently the product will appear to buyers in specific geographic areas.',
        'Visibility Rotation: For fairness, the product listing sequence may rotate among suppliers within the same visibility tier.',
        'Refund and Cancellation Policy: No refunds after registration and payment. If a supplier discontinues their product, they must provide valid documentation for refund consideration.',
        'Product and Service Data: Suppliers must maintain accurate product specifications and documentation.',
        'Supplier Responsibility: Suppliers are responsible for ensuring product quality and regulatory compliance.',
        'Service Termination: BuildPro OGCS reserves the right to terminate services for unethical practices.',
      ],
    },
    '4X Visibility + Product Informative Video Advertisement': {
      description: 'Maximum visibility. The product will be visible to 40 prospective buyers out of 100, and the supplier\'s name will be at the top in all 40 listings.',
      visibilityExplanation: ['4X Visibility: Provides the highest level of visibility, ensuring top placement in all search results.'],
      operationalDetails: [
        'Visibility Service: The visibility tier determines how prominently the product will appear to buyers in specific geographic areas.',
        'Visibility Rotation: For fairness, the product listing sequence may rotate among suppliers within the same visibility tier.',
        'Refund and Cancellation Policy: No refunds after registration and payment. If a supplier discontinues their product, they must provide valid documentation for refund consideration.',
        'Product and Service Data: Suppliers must maintain accurate product specifications and documentation.',
        'Supplier Responsibility: Suppliers are responsible for ensuring product quality and regulatory compliance.',
        'Service Termination: BuildPro OGCS reserves the right to terminate services for unethical practices.',
      ],
    },
  };

  // Get the relevant details for the selected tier
  const selectedTier = tierDetails[tierTitle];

  return (
    <div className="visibility-details-page">
      <h1>{tierTitle}</h1>
      <p>{selectedTier.description}</p>

      <h3>Visibility Explanation:</h3>
      <ul>
        {selectedTier.visibilityExplanation.map((explanation, index) => (
          <li key={index}>{explanation}</li>
        ))}
      </ul>

      <h3>Operational Details:</h3>
      <ul>
        {selectedTier.operationalDetails.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default VisibilityDetailsPage;
