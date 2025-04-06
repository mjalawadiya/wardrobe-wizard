import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube, FaCreditCard, FaPaypal, FaLock } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: white;
  padding: 3rem 0 1.5rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
`;

const FooterLogo = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    
    span {
      color: #f39c12;
    }
  }
  
  p {
    color: #bdc3c7;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f39c12;
    transform: translateY(-3px);
  }
`;

const FooterSection = styled.div`
  h4 {
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -6px;
      width: 30px;
      height: 2px;
      background-color: #f39c12;
    }
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.7rem;
  
  a {
    color: #bdc3c7;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #f39c12;
    }
  }
`;

const ContactInfo = styled.div`
  p {
    color: #bdc3c7;
    margin-bottom: 0.7rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
  
  svg {
    font-size: 1.5rem;
    color: #bdc3c7;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  text-align: center;
  color: #bdc3c7;
  font-size: 0.9rem;
  
  p {
    margin-bottom: 0.5rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterLogo>
            <h3>Wardrobe<span>Wizard</span></h3>
            <p>
              Your go-to destination for premium quality t-shirts in various styles,
              colors, and fits. Discover the perfect tees for every occasion.
            </p>
            <SocialIcons>
              <SocialIcon href="https://facebook.com" target="_blank" aria-label="Facebook">
                <FaFacebook />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank" aria-label="Twitter">
                <FaTwitter />
              </SocialIcon>
              <SocialIcon href="https://instagram.com" target="_blank" aria-label="Instagram">
                <FaInstagram />
              </SocialIcon>
              <SocialIcon href="https://pinterest.com" target="_blank" aria-label="Pinterest">
                <FaPinterest />
              </SocialIcon>
              <SocialIcon href="https://youtube.com" target="_blank" aria-label="YouTube">
                <FaYoutube />
              </SocialIcon>
            </SocialIcons>
          </FooterLogo>
          
          <FooterSection>
            <h4>Shop</h4>
            <FooterLinks>
              <FooterLink>
                <Link to="/products">All Products</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/products?category=Regular Fit">Regular Fit</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/products?category=Slim Fit">Slim Fit</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/products?category=Loose Fit">Loose Fit</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/products?filter=new">New Arrivals</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/products?filter=sale">Sale</Link>
              </FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h4>Help</h4>
            <FooterLinks>
              <FooterLink>
                <Link to="/faq">FAQs</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/shipping">Shipping Information</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/returns">Returns & Exchanges</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/size-guide">Size Guide</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/contact">Contact Us</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h4>Contact Us</h4>
            <ContactInfo>
              <p>1234 Fashion Street, Design District, NY 10001, USA</p>
              <p>Email: support@wardrobewizard.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Mon-Fri: 9:00 AM - 8:00 PM</p>
              <p>Sat-Sun: 10:00 AM - 6:00 PM</p>
            </ContactInfo>
            <PaymentMethods>
              <FaCreditCard />
              <FaPaypal />
              <FaLock />
            </PaymentMethods>
          </FooterSection>
        </FooterTop>
        
        <FooterBottom>
          <p>&copy; {new Date().getFullYear()} Wardrobe Wizard. All rights reserved.</p>
          <p>Designed and developed with ❤️</p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 