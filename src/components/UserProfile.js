import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaUser, FaMapMarkerAlt, FaSave } from 'react-icons/fa';

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
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      setCity(parsedUserData.city || 'London');
    } catch (error) {
      console.error('Error parsing user data:', error);
      setError('Failed to load user data. Please log in again.');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update locally first
      const updatedUserData = { ...userData, city };
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Then try to update on server
      try {
        const response = await axios.put(
          '/api/users/city',
          { city },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        console.log('City updated on server successfully');
      } catch (apiErr) {
        console.warn('Server update failed, but local update succeeded:', apiErr);
        // We don't show this error to user since the local update worked
      }
      
      setSuccess('Your city has been updated successfully!');
    } catch (err) {
      console.error('Error updating city:', err);
      setError('Failed to update city. Please try again.');
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
        </ProfileTitle>
      </ProfileHeader>

      <Section>
        <SectionTitle>
          <FaMapMarkerAlt /> Location Settings
        </SectionTitle>
        <p>
          Update your city to get weather-based clothing recommendations on the home page.
        </p>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="city">Your City</Label>
            <Input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </FormGroup>

          {error && <ErrorText>{error}</ErrorText>}
          {success && <SuccessText>{success}</SuccessText>}

          <Button type="submit" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      </Section>
    </ProfileContainer>
  );
};

export default UserProfile; 