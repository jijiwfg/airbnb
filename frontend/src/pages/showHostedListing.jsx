import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  // CardActions,
  Grid,
  Snackbar,
  Button,
  Alert,
  // Chip,
  Rating,
  Divider,
  CardMedia
} from '@mui/material';
import List from '@mui/material/List';
import StarIcon from '@mui/icons-material/Star';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { apiRequest, getListingInfo, getListingBookInfo } from '../utils/api/listing';
import dayjs from 'dayjs';
const ShowHostedListing = () => {
  const { id } = useParams();
  const [listingData, setListingData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [booksInfo, setBooksInfo] = useState([])
  const [postedDuration, setPostedDuration] = useState(null);
  const [bookedDaysThisYear, setBookedDaysThisYear] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  useEffect(() => {
    getListingInfo(id)
      .then((listingInfo) => {
        setListingData(listingInfo);
        const datePosted = dayjs(listingInfo.postedOn);
        const currentDateTime = dayjs();
        setPostedDuration(currentDateTime.diff(datePosted, 'day') + 1);
        getListingBookInfo(id)
          .then((booksList) => {
            setBooksInfo(booksList)
            const acceptedBookList = booksList.filter(item => item.status === 'accepted')

            const Bookdays = acceptedBookList.map((acceptedBook) => {
              const startDate = dayjs(acceptedBook.dateRange.startDate)
              const endDate = dayjs(acceptedBook.dateRange.endDate)
              return endDate.diff(startDate, 'day')
            })
            setBookedDaysThisYear(Bookdays.reduce((acc, num) => acc + num, 0))
          })
          .catch((error) => {
            console.log(error)
          });
      })
      .catch((error) => {
        console.log(error)
      });
  }, []);
  useEffect(() => {
    setTotalProfit(bookedDaysThisYear * listingData.price)
  }, [bookedDaysThisYear, listingData])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAcceptBooking = (id) => {
    apiRequest(`/bookings/accept/${id}`, 'PUT', {}, false)
      .then((response) => {
        setSnackbarOpen(true)
        window.location.reload()
      })
      .catch((error) => {
        alert(error)
      });
  }

  const handleRejectBooking = (id) => {
    apiRequest(`/bookings/decline/${id}`, 'PUT', {}, false)
      .then((response) => {
        setSnackbarOpen(true)
        window.location.reload()
      })
      .catch((error) => {
        alert(error)
      });
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
                    Title:  { listingData.title }
                  </Typography>
                  <CardMedia
                    component="img"
                    sx={ { width: 151 } }
                    image={ listingData.thumbnail }
                    alt="Live from space album cover"
                  />
                  <Divider>
                    <Typography variant="h5" >
                      Publish Info
                    </Typography>
                  </Divider>
                  <p>Posted Duration: { postedDuration }</p>
                  <p>Booked Days This Year: { bookedDaysThisYear } days</p>
                  <p>Total Profit: ${ totalProfit }</p>
                  <Divider>
                    <Typography variant="h5" >
                      Property Images
                    </Typography>
                  </Divider>
                  <ImageList sx={ { width: '100%', minheight: 100 } } cols={ 3 } rowHeight={ 300 }>
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
            <Divider>
              <Typography variant="h5" >
                Booking Request
              </Typography>
            </Divider>
            <Grid container spacing={ 2 }>
              { booksInfo.map((booking) => (
                <Grid item xs={ 12 } key={ booking.id }>
                  <Card>
                    <CardContent>
                      <Grid container spacing={ 2 } direction="row"
                        justifyContent="center"
                        alignItems="center">
                        <Grid item xs={ 12 } sm={ 12 } md={ 8 }>
                          <Typography variant="h5">Booking ID: { booking.id }</Typography>
                          <Typography>Owner: { booking.owner }</Typography>
                          <Typography>
                            Date Range: { new Date(booking.dateRange.startDate).toLocaleDateString() } -{ ' ' }
                            { new Date(booking.dateRange.endDate).toLocaleDateString() }
                          </Typography>
                          <Typography>Total Price: ${ booking.totalPrice }</Typography>
                          <Typography>Listing ID: { booking.listingId }</Typography>
                          { booking.status === 'pending' && (
                            <Button variant="outlined" color="warning" disabled>
                              Pending
                            </Button>
                          ) }
                          { booking.status === 'accepted' && (
                            <Button variant="outlined" color="success">
                              accepted
                            </Button>
                          ) }
                          { booking.status === 'declined' && (
                            <Button variant="outlined" color="error">
                              declined
                            </Button>
                          ) }
                        </Grid>
                        <Grid item xs={ 12 } sm={ 12 } md={ 4 } justifyContent="center">
                          { booking.status === 'pending' && (
                            <div>
                              <Button id="accept-btn" variant="contained" color="success" onClick={ () => handleAcceptBooking(booking.id) }>
                                Accept
                              </Button>
                              <Button variant="contained" color="error" style={ { 'margin-left': '20px' } } onClick={ () => handleRejectBooking(booking.id) }>
                                Reject
                              </Button>
                            </div>
                          ) }
                        </Grid>
                      </Grid>

                    </CardContent>
                  </Card>
                </Grid>
              )) }
              { booksInfo && booksInfo.length === 0 &&
                <>
                  <Typography variant="body1" color="text.secondary">
                    There is no booking request
                  </Typography>
                </>
              }
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Snackbar open={ snackbarOpen } autoHideDuration={ 3000 } onClose={ handleSnackbarClose }>
        <Alert onClose={ handleSnackbarClose } severity="success">
          Booking Process successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShowHostedListing;
