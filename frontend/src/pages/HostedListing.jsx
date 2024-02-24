import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import ListingCard from '../components/ListingCard';
// import axios from 'axios';
import { apiRequest } from '../utils/api/listing';
import { getUserInfo } from '../utils/Auth';
function Dashboard () {
  const [listingList, setListingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uploadListingData = () => {
    apiRequest('/listings', 'GET', {}, false)
      .then((response) => {
        setListingList(response.listings.filter(item => item.owner === getUserInfo()));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    uploadListingData()
  }, []);

  return (
    <Container>
      { isLoading
        ? (
          <Typography>Loading...</Typography>
          )
        : listingList.length > 0
          ? (
            <Grid container spacing={ 2 }>
              { listingList.map((listing) => (
                <Grid item xs={ 12 } sm={ 6 } md={ 4 } key={ listing.id }>
                  <ListingCard id={ listing.id } uploadListingData={ uploadListingData } />
                </Grid>
              )) }
            </Grid>
            )
          : (
            <Typography>There are currently no hosted listings</Typography>
            ) }
    </Container>
  );
}

export default Dashboard;
