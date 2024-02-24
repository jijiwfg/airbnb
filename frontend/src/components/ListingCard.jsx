import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Grid,
  IconButton,
  Snackbar,
  Button,
  Alert,
  Chip,
  Rating
} from '@mui/material';
import { apiRequest, getListingInfo } from '../utils/api/listing';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CardMedia from '@mui/material/CardMedia';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DatePickerWithButton from './DateSelect'
const ListingCard = ({ id, uploadListingData }) => {
  const [listingData, setListingData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    getListingInfo(id)
      .then((listingInfo) => {
        setListingData(listingInfo);
      })
      .catch((error) => {
        console.log(error)
      });
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleDeleteListing = () => {
    apiRequest(`/listings/${id}`, 'DELETE', {}, false)
      .then((response) => {
        setSnackbarOpen(true)
        uploadListingData()
      })
      .catch((error) => {
        console.log(error)
      });
  };
  const handleUnpublish = () => {
    apiRequest(`/listings/unpublish/${id}`, 'PUT', {}, false)
      .then((response) => {
        setSnackbarOpen(true)
        window.location.reload()
      })
      .catch((error) => {
        alert(error)
      });
  }
  const checkPublished = (published) => {
    if (published) {
      return 1
    } else {
      return null;
    }
  }

  return (
    <div>
      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
        <Card >
          { listingData &&
            (<>
              <CardMedia
                sx={ { height: 140 } }
                image={ listingData.thumbnail }
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  { listingData.title }
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Property Type: { listingData.propertyType }
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Bed Nums: { listingData.bednums }
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Bathroom Nums: { listingData.bathrooms }
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Reviews Nums: { listingData.totalReviews }
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Property amenities:
                  { listingData.propertyAmenities && listingData.propertyAmenities.map((amenity, index) => (
                    <Chip label={ amenity } color="success" variant="outlined" size='small' key={ index } />
                  )) }
                </Typography>
                <Typography variant="h6" color="error">
                  Price: $ { listingData.price }
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <LocationOnIcon fontSize="small"></LocationOnIcon>{ listingData.addressString }
                </Typography>

                {
                  listingData.rating >= 0 && <>
                    <Typography variant="body1" color="text.secondary">
                      Rating:
                      <Rating name="half-rating" value={ listingData.rating } precision={ 0.5 } size="small" readOnly />
                      { `   ${listingData.rating}` }
                    </Typography>
                  </>
                }
              </CardContent>
              <CardActions>
                <Box flex={ 1 } />
                <Link to={ `/editListing/${id}` }>
                  <IconButton
                    color="primary"
                    size="small"
                  >
                    <EditIcon></EditIcon>
                  </IconButton>
                </Link>
                <IconButton
                  color="error"
                  size="small"
                  onClick={ handleDeleteListing }
                >
                  <DeleteOutlineIcon></DeleteOutlineIcon>
                </IconButton>
                <Link to={ `/showHostedListing/${id}` }>
                  <Button id="show-more-btn" size="small" color="primary" variant="outlined">
                    Show More
                  </Button>
                </Link>
                { checkPublished(listingData.published) &&
                  <Button id="unpublish-btn" variant="outlined" color="error" size="small" onClick={ handleUnpublish }>Unpublish</Button> }
                { !checkPublished(listingData.published) && <DatePickerWithButton id={ id } uploadListingData={ uploadListingData } />
                }
              </CardActions></>) }
        </Card>
      </Grid>
      <Snackbar open={ snackbarOpen } autoHideDuration={ 3000 } onClose={ handleSnackbarClose }>
        <Alert onClose={ handleSnackbarClose } severity="success">
          Delete successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ListingCard;
