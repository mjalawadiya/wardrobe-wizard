import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaUser, FaMapMarkerAlt, FaSave, FaEnvelope, FaLock, FaEdit, FaTimes } from 'react-icons/fa';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f39c12;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  
  svg {
    font-size: 2.5rem;
    color: white;
  }
`;

const ProfileTitle = styled.div`
  h2 {
    margin: 0 0 0.5rem;
    color: #2c3e50;
  }
  
  p {
    margin: 0;
    color: #7f8c8d;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #f39c12;
  }
`;

const Button = styled.button`
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  max-width: 200px;

  &:hover {
    background-color: #e67e22;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 5px;
`;

const SuccessText = styled.div`
  color: #27ae60;
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: rgba(39, 174, 96, 0.1);
  border-radius: 5px;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #f39c12;
  }
`;

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    city: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Validation state
  const [validations, setValidations] = useState({
    username: true,
    email: true,
    passwordMatch: true,
    passwordLength: true
  });

  useEffect(() => {
    // Check if user is logged in
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      navigate('/login');
      return;
    }

    try {
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
      
      // Initialize form data
      setFormData({
        username: parsedUserData.username || '',
        email: parsedUserData.email || '',
        city: parsedUserData.city || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      setError('Failed to load user data. Please log in again.');
    }
  }, [navigate]);

  // Validate form inputs when they change
  useEffect(() => {
    setValidations({
      username: formData.username.length >= 3,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      passwordMatch: !formData.newPassword || formData.newPassword === formData.confirmPassword,
      passwordLength: !formData.newPassword || formData.newPassword.length >= 6
    });
  }, [formData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear previous success/error messages when user makes changes
    setError(null);
    setSuccess(null);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        city: userData.city || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  // Form validation
  const isFormValid = () => {
    // Basic validation
    if (!formData.username || !formData.email) {
      return false;
    }
    
    // Check validation state
    if (!validations.username || !validations.email || !validations.passwordMatch || !validations.passwordLength) {
      return false;
    }
    
    // Password validation
    if (formData.newPassword && !formData.currentPassword) {
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill all required fields correctly');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare update data
      const updateData = {
        username: formData.username,
        email: formData.email,
        city: formData.city
      };
      
      // Include password data if provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.password = formData.newPassword;
      }
      
      // Send update to server
      const response = await axios.put(
        '/api/users/profile',
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update local data
      const updatedData = response.data;
      setUserData(updatedData);
      localStorage.setItem('userData', JSON.stringify(updatedData));
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Notify other components of the update
      window.dispatchEvent(new Event('userLogin'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to update profile. Please try again.');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <ProfileContainer>Loading user profile...</ProfileContainer>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileIcon>
          <FaUser />
        </ProfileIcon>
        <ProfileTitle>
          <h2>{userData.username}</h2>
          <p>{userData.email}</p>
          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={toggleEditMode} 
              style={{ 
                background: 'none',
                border: 'none',
                color: '#f39c12',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                padding: 0
              }}
            >
              {isEditing ? (
                <>
                  <FaTimes /> Cancel Editing
                </>
              ) : (
                <>
                  <FaEdit /> Edit Profile
                </>
              )}
            </button>
          </div>
        </ProfileTitle>
      </ProfileHeader>

      {isEditing ? (
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>
              <FaUser /> Personal Information
            </SectionTitle>
            
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {!validations.username && formData.username && (
                <ErrorText>Username must be at least 3 characters</ErrorText>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {!validations.email && formData.email && (
                <ErrorText>Please enter a valid email address</ErrorText>
              )}
            </FormGroup>
          </Section>
          
          <Section>
            <SectionTitle>
              <FaMapMarkerAlt /> Location Settings
            </SectionTitle>
            <p>
              Update your city to get weather-based clothing recommendations on the home page.
            </p>
            
            <FormGroup>
              <Label htmlFor="city">Your City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </FormGroup>
          </Section>
          
          <Section>
            <SectionTitle>
              <FaLock /> Password
            </SectionTitle>
            <p>Leave blank to keep your current password.</p>
            
            <FormGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter a new password"
              />
              {!validations.passwordLength && formData.newPassword && (
                <ErrorText>Password must be at least 6 characters</ErrorText>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                disabled={!formData.newPassword}
              />
              {!validations.passwordMatch && formData.confirmPassword && (
                <ErrorText>Passwords do not match</ErrorText>
              )}
            </FormGroup>
          </Section>
          
          {error && <ErrorText>{error}</ErrorText>}
          {success && <SuccessText>{success}</SuccessText>}
          
          <Button type="submit" disabled={loading || !isFormValid()}>
            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      ) : (
        <>
          <Section>
            <SectionTitle>
              <FaUser /> Personal Information
            </SectionTitle>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Username:</strong> {userData.username}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Email:</strong> {userData.email}
            </div>
          </Section>
          
          <Section>
            <SectionTitle>
              <FaMapMarkerAlt /> Location Settings
            </SectionTitle>
            <div style={{ marginBottom: '1rem' }}>
              <strong>City:</strong> {userData.city || 'Not set'}
            </div>
          </Section>
        </>
      )}
    </ProfileContainer>
  );
};

export default UserProfile; 