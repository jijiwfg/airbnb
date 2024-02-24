import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Grid,
  Snackbar,
  Button,
  CardMedia,
  Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip, Rating
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { apiRequest, getListingInfo, getListingBookInfo } from '../utils/api/listing';
import { getUserInfo } from '../utils/Auth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import CommentDialog from '../components/commentListing';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Divider from '@mui/material/Divider';
const ShowListing = () => {
  const { id } = useParams();
  const [listingData, setListingData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  })
  const [booksInfo, setBooksInfo] = useState([])
  const [errorMessage, setErrorMessage] = useState('');
  const [totalBookPrice, setTotalBookPrice] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  useEffect(() => {
    getListingInfo(id)
      .then((listingInfo) => {
        setListingData(listingInfo);
      })
      .catch((error) => {
        console.log(error)
      });
    getListingBookInfo(id)
      .then((booksInfoOfUser) => {
        setBooksInfo(booksInfoOfUser.filter((item) => item.owner === getUserInfo()))
      })
      .catch((error) => {
        console.log(error)
      });
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleDateChange = (field, value) => {
    const updatedDateRanges = { ...dateRange };
    updatedDateRanges[field] = value;
    setDateRange(updatedDateRanges);
    // setDateRanges(updatedDateRanges);
  };

  const handleBoook = () => {
    if (dateRange.startDate >= dateRange.endDate || !dateRange.startDate || !dateRange.endDate) {
      setErrorMessage('invalid date range!')
    } else {
      const bookDays = dateRange.endDate.diff(dateRange.startDate, 'day');
      setTotalBookPrice(bookDays * Number(listingData.price))
      setDialogOpen(true)
    }
  }

  const handleConfirm = () => {
    apiRequest(`/bookings/new/${id}`, 'POST', { dateRange, totalPrice: totalBookPrice }, false)
      .then((response) => {
        setSnackbarOpen(true)
        window.location.reload()
        // uploadListingData()
      })
      .catch((error) => {
        alert(error)
      });
    setDialogOpen(false)
  }
  return (
    <div>
      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
        <Card>
          <CardContent>

            { listingData &&
              (
                <>
                  <Typography gutterBottom variant="h5" component="div">
                    { listingData.title }
                  </Typography>
                  <CardMedia
                    component="img"
                    sx={ { width: 151 } }
                    image={ listingData.thumbnail }
                    alt="Live from space album cover"
                  />
                  <Divider>
                    <Typography variant="h5" >
                      Property Info
                    </Typography>
                  </Divider>
                  <Typography variant="body1" color="text.secondary">
                    Property Type: { listingData.propertyType }
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bedroom Nums: { listingData.bedrooms }
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bed Nums: { listingData.bednums }
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bathroom Nums: { listingData.bathrooms }
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Property amenities:
                    { listingData.propertyAmenities && listingData.propertyAmenities.map((amenity, index) => (
                      <Chip label={ amenity } color="success" variant="outlined" size='small' key={ index } />
                    )) }
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {
                      listingData.rating >= 0 && <>
                        <Rating name="half-rating" value={ listingData.rating } precision={ 0.5 } size="small" readOnly />
                        { `   ${listingData.rating}` }
                      </>
                    }
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <LocationOnIcon fontSize="small"></LocationOnIcon>{ listingData.addressString }
                  </Typography>
                  <Typography variant="h6" color="error">
                    Price:  ${ listingData.price }
                  </Typography>
                  <Divider>
                    <Typography variant="h5" >
                      property Images
                    </Typography>
                  </Divider>

                  <ImageList sx={ { width: 500, minheight: 100 } } cols={ 3 } rowHeight={ 164 }>
                    { listingData.propertyImages && listingData.propertyImages.map((item, index) => (
                      <ImageListItem key={ index }>
                        <img
                          srcSet={ item }
                          src={ item }
                          alt='propertyImages'
                          loading="lazy"
                        />
                      </ImageListItem>
                    )) }
                  </ImageList>
                  <Divider>
                    <Typography variant="h5" >
                      Comments
                    </Typography>
                  </Divider>
                  <List sx={ { width: '100%', maxWidth: 360, bgcolor: 'background.paper' } }>
                    { listingData.reviews && listingData.reviews.map((value) => (
                      <ListItem
                        key={ value }
                        alignItems="flex-start"
                      >
                        <Typography variant="h6" color="gray">
                          {
                            value.rating && <>
                              <Rating
                                name="text-feedback"
                                value={ value.rating }
                                readOnly
                                precision={ 0.5 }
                                emptyIcon={ <StarIcon style={ { opacity: 0.55 } } fontSize="inherit" /> }
                              />
                            </>
                          }

                          <Box sx={ { ml: 2 } }><ListItemText primary={ value.comment } /></Box>
                        </Typography>

                        <Divider variant="inset" component="li" />
                      </ListItem>
                    )) }
                    { listingData.reviews && listingData.reviews.length === 0 &&
                      <>

                        <Typography variant="body1" color="text.secondary">
                          There is no Comment
                        </Typography>
                      </>
                    }
                  </List>
                </>
              ) }
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
        <Divider>
          <Typography variant="h5" >
            Booking
          </Typography>
        </Divider>
        <LocalizationProvider dateAdapter={ AdapterDayjs }>
          <DatePicker
            label='Start date'
            value={ dateRange.startDate }
            onChange={ (date) => handleDateChange('startDate', date) }
          />
          <DatePicker
            label='End date'
            value={ dateRange.endDate }
            onChange={ (date) => handleDateChange('endDate', date) }
          />
        </LocalizationProvider>
        <Button id="book-btn" variant="contained" color="success" onClick={ handleBoook }>Book</Button>
      </Grid>
      { errorMessage && <Typography variant="error" style={ { marginTop: '10px', color: '#e83b46' } }>{ errorMessage }</Typography> }
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 }>
          <Divider>
            <Typography variant="h5" >
              Booking History
            </Typography>
          </Divider>
        </Grid>
        { booksInfo.map((booking) => (
          <Grid item xs={ 12 } key={ booking.id }>
            <Card>
              <CardContent>
                <Typography variant="h6">Booking ID: { booking.id }</Typography>
                <Typography>Owner: { booking.owner }</Typography>
                <Typography>
                  Date Range: { new Date(booking.dateRange.startDate).toLocaleDateString() } -{ ' ' }
                  { new Date(booking.dateRange.endDate).toLocaleDateString() }
                </Typography>
                <Typography>Total Price: ${ booking.totalPrice }</Typography>
                status:
                { booking.status === 'pending' && (
                  <Chip label='Pending' variant="outlined" color="warning" />
                  //   Pending
                  // </Button>
                ) }
                { booking.status === 'accepted' && (
                  <Chip label="accepted" variant="outlined" color="success" />
                  // <Button variant="outlined" color="success">
                  //   accepted
                  // </Button>
                ) }
                { booking.status === 'declined' && (
                  <Chip label="declined" variant="outlined" color="error" />
                ) }
              </CardContent>
              <CardActions>
                { booking.status === 'accepted' && (
                  <CommentDialog bookingId={ booking.id } listingId={ id }></CommentDialog>
                ) }
              </CardActions>
            </Card>
          </Grid>
        )) }
        { booksInfo && booksInfo.length === 0 &&
          <>

            <Typography variant="body1" color="text.secondary">
              There is no booking history
            </Typography>
          </>
        }
      </Grid>
      <Dialog open={ dialogOpen } onClose={ () => setDialogOpen(false) }>
        <DialogTitle>Booking Comfirm</DialogTitle>
        <DialogContent>
          <DialogContentText>dateRange: { dateRange.startDate ? dateRange.startDate.format('YYYY-MM-DD') : null } : { dateRange.endDate ? dateRange.endDate.format('YYYY-MM-DD') : null } </DialogContentText>
          <DialogContentText>totalPrice: { totalBookPrice }</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="confirm-book" variant="contained" color="primary" onClick={ handleConfirm }>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={ snackbarOpen } autoHideDuration={ 3000 } onClose={ handleSnackbarClose }>
        <Alert onClose={ handleSnackbarClose } severity="success">
          Booking successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShowListing;
