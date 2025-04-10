import React from 'react';
import { 
  FaClipboardList, 
  FaUserShield, 
  FaShippingFast, 
  FaExchangeAlt, 
  FaCopyright, 
  FaCreditCard 
} from 'react-icons/fa';
import '../styles/pages/terms.css';

const TermsPage = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1 className="terms-title">Terms & Conditions</h1>
        <p className="terms-subtitle">Last Updated: April 9, 2025</p>
      </div>
      
      <div className="terms-intro">
        <p>
          Welcome to WardrobeWizard. By accessing or using our website, you agree to be bound by these 
          Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, 
          please do not use our website or services.
        </p>
      </div>
      
      <section className="terms-section">
        <div className="section-header">
          <FaClipboardList className="section-icon" />
          <h2 className="section-title">General Terms of Use</h2>
        </div>
        <div className="section-content">
          <h3>Account Registration</h3>
          <p>
            To access certain features of our website, you may be required to register for an account. 
            You agree to provide accurate, current, and complete information during the registration process 
            and to update such information to keep it accurate, current, and complete.
          </p>
          
          <h3>Account Responsibilities</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account and password and for 
            restricting access to your computer or device. You accept responsibility for all activities 
            that occur under your account.
          </p>
          
          <h3>Prohibited Activities</h3>
          <p>
            You agree not to engage in any of the following activities:
          </p>
          <ul>
            <li>Violating any applicable laws or regulations</li>
            <li>Impersonating any person or entity</li>
            <li>Submitting false or misleading information</li>
            <li>Using the website for any unauthorized or illegal purpose</li>
            <li>Attempting to interfere with the proper functioning of the website</li>
          </ul>
        </div>
      </section>
      
      <section className="terms-section">
        <div className="section-header">
          <FaUserShield className="section-icon" />
          <h2 className="section-title">Privacy Policy</h2>
        </div>
        <div className="section-content">
          <h3>Information Collection</h3>
          <p>
            We collect personal information when you create an account, place an order, or interact with our website. 
            This information may include your name, email address, shipping address, payment information, and browsing behavior.
          </p>
          
          <h3>Information Use</h3>
          <p>
            We use your information to process orders, personalize your shopping experience, improve our website, 
            communicate with you about products or services, and for other legitimate business purposes.
          </p>
          
          <h3>Information Sharing</h3>
          <p>
            We do not sell or rent your personal information to third parties. We may share your information with 
            service providers who help us operate our business, such as payment processors and shipping companies.
          </p>
          
          <h3>Cookies and Tracking</h3>
          <p>
            Our website uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
            and personalize content. You can manage your cookie preferences through your browser settings.
          </p>
        </div>
      </section>
      
      <section className="terms-section">
        <div className="section-header">
          <FaShippingFast className="section-icon" />
          <h2 className="section-title">Shipping Policy</h2>
        </div>
        <div className="section-content">
          <h3>Shipping Methods</h3>
          <p>
            We offer several shipping options, including standard shipping (3-5 business days) and 
            express shipping (1-2 business days). Shipping costs are calculated based on the total order value, 
            shipping method, and destination.
          </p>
          
          <h3>Free Shipping</h3>
          <p>
            Orders over ₹3,750 qualify for free standard shipping within India. 
            Additional fees may apply for expedited shipping or oversized items.
          </p>
          
          <h3>International Shipping</h3>
          <p>
            We ship to select international destinations. International customers are responsible for 
            any customs duties, taxes, or import fees imposed by their country.
          </p>
        </div>
      </section>
      
      <section className="terms-section">
        <div className="section-header">
          <FaExchangeAlt className="section-icon" />
          <h2 className="section-title">Return & Refund Policy</h2>
        </div>
        <div className="section-content">
          <h3>Return Eligibility</h3>
          <p>
            You may return most unworn, unwashed, and unaltered items within 30 days of delivery. 
            Items must be returned with all original tags and packaging. Certain items, such as 
            final sale merchandise or personalized items, are not eligible for return.
          </p>
          
          <h3>Return Process</h3>
          <p>
            To initiate a return, log in to your account and follow the return instructions, or 
            contact our customer service team. You will receive a return authorization and 
            shipping instructions.
          </p>
          
          <h3>Refunds</h3>
          <p>
            Refunds will be issued to the original payment method within 5-7 business days after 
            we receive and process your return. Shipping charges are non-refundable unless the 
            return is due to a damaged or defective item.
          </p>
          
          <h3>Exchanges</h3>
          <p>
            If you wish to exchange an item for a different size or color, please return the 
            original item for a refund and place a new order for the desired item.
          </p>
        </div>
      </section>
      
      <section className="terms-section">
        <div className="section-header">
          <FaCreditCard className="section-icon" />
          <h2 className="section-title">Payment Terms</h2>
        </div>
        <div className="section-content">
          <h3>Payment Methods</h3>
          <p>
            We accept all major credit cards, debit cards, UPI, net banking, and other payment methods 
            supported by Razorpay. All transactions are processed securely through our payment partner.
          </p>
          
          <h3>Pricing and Taxes</h3>
          <p>
            All prices are listed in Indian Rupees (INR) and are subject to change without notice. 
            Applicable GST (18%) will be added to your order as per Indian tax regulations.
          </p>
          
          <h3>Secure Transactions</h3>
          <p>
            We use industry-standard encryption and security measures to protect your payment 
            information during transmission. All payments are processed through Razorpay's secure 
            payment gateway.
          </p>
        </div>
      </section>
      
      <section className="terms-section">
        <div className="section-header">
          <FaCopyright className="section-icon" />
          <h2 className="section-title">Intellectual Property</h2>
        </div>
        <div className="section-content">
          <h3>Ownership</h3>
          <p>
            All content on the WardrobeWizard website, including text, graphics, logos, images, 
            and software, is the property of WardrobeWizard or its content suppliers and is 
            protected by copyright, trademark, and other intellectual property laws.
          </p>
          
          <h3>Limited License</h3>
          <p>
            We grant you a limited, non-exclusive, non-transferable license to access and use 
            our website for personal, non-commercial purposes. This license does not include the 
            right to collect or use information from the website, modify or create derivative works, 
            or use the website in any way that could harm WardrobeWizard.
          </p>
        </div>
      </section>
      
      <div className="terms-footer">
        <p>
          By using our website, you acknowledge that you have read, understood, and agree to 
          be bound by these Terms and Conditions. If you have any questions, please contact us 
          at support@wardrobewizard.com.
        </p>
      </div>
    </div>
  );
};

export default TermsPage; 