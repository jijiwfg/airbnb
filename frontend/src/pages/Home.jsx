import React, { useState, useEffect } from 'react';
import { getToken, getUserInfo } from '../utils/Auth';
import { Link } from 'react-router-dom';
import { apiRequest, getListingInfo } from '../utils/api/listing';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Box, Paper, Chip } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Home () {
  const [listingDict, setListingDict] = useState({
    booked: [],
    others: []
  });
  const [bookedIds, setBookedIds] = useState([]);
  const [listingIds, setListingIds] = useState([])
  const [sortedListingList, setSortedListingList] = useState([]);
  const [filter, setFilter] = useState({
    keyWord: '',
    bedrooms: { min: 1, max: 1 },
    dateRange: { startDate: null, endDate: null },
    price: { min: 0, max: 0 }
  })
  const [filteredListing, setFilteredListing] = useState([])
  function isDateRangeWithinAvailable (dateRange, available) {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    for (const range of available) {
      const availableStartDate = new Date(range.startDate);
      const availableEndDate = new Date(range.endDate);
      if (startDate >= availableStartDate && endDate <= availableEndDate) {
        return true;
      }
    }
    return false;
  }

  const handleKeywordChange = (event) => {
    const { value } = event.target;
    setFilter((prevFilter) => ({ ...prevFilter, keyWord: value }));
  };

  const handleBedroomsChange = (event, newValue) => {
    setFilter((prevFilter) => ({ ...prevFilter, bedrooms: { min: newValue[0], max: newValue[1] } }));
  };

  const handleDateChange = (field, value) => {
    const updatedDateRanges = { ...filter.dateRange };
    updatedDateRanges[field] = value;
    setFilter((prevFilter) => ({ ...prevFilter, dateRange: updatedDateRanges }));
  };

  const handlePriceChange = (event, newValue) => {
    setFilter((prevFilter) => ({ ...prevFilter, price: { min: newValue[0], max: newValue[1] } }));
  };

  const handleSearch = () => {
    filterListing(sortedListingList, filter)
  };
  useEffect(() => {
    if (getToken()) {
      apiRequest('/bookings', 'GET', {}, false)
        .then((response) => {
          const bookings = response.bookings
          const filteredList = bookings.filter(item => item.owner === getUserInfo());
          const listingIds = filteredList.map(item => Number(item.listingId));
          setBookedIds(listingIds)
          getPublishData(listingIds)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      getPublishData([])
    }
  }, []);
  useEffect(() => {
    const sortedOtherList = listingDict.others.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
    setSortedListingList([...listingDict.booked, ...sortedOtherList])
  }, [listingDict]);

  useEffect(() => {
    filterListing(sortedListingList, filter)
  }, [sortedListingList]);
  const filterListing = (listingList, filterDict) => {
    const filteredList = listingList.filter((listingInfo) => {
      const keyWord = filterDict.keyWord
      const bedrooms = filterDict.bedrooms
      const dateRange = filterDict.dateRange
      const price = filterDict.price
      if (keyWord !== '') {
        const titleMatch = new RegExp(keyWord, 'i').test(listingInfo.title);
        const locationMatch = new RegExp(keyWord, 'i').test(listingInfo.addressString);
        if (!titleMatch && !locationMatch) {
          return false
        }
      }

      if (!(bedrooms.min === bedrooms.max & bedrooms.max === 1)) {
        if (listingInfo.bedrooms > bedrooms.max || listingInfo.bedrooms < bedrooms.min) {
          return false
        }
      }

      if (!(dateRange.startDate == null || dateRange.endDate == null)) {
        const dateRangeString = {
          startDate: dateRange.startDate.format('YYYY-MM-DD'),
          endDate: dateRange.endDate.format('YYYY-MM-DD'),
        }
        if (isDateRangeWithinAvailable(dateRangeString, listingInfo.availability) === false) {
          return false
        }
      }
      if (!(price.min === price.max & price.max === 0)) {
        if (listingInfo.price > price.max || listingInfo.price < price.min) {
          return false
        }
      }
      return true
    })
    setFilteredListing(filteredList)
  }
  useEffect(() => {
    if (listingIds.length > 0) {
      const id = listingIds[0]
      getListingInfo(id)
        .then((listingInfo) => {
          if (listingInfo.published === false) {
            setListingIds(listingIds.slice(1))
            return
          }
          const isBooked = bookedIds.includes(id);
          if (isBooked) {
            const currentBooked = listingDict.booked
            const newListingBooked = [...currentBooked, listingInfo]
            setListingDict({ ...listingDict, booked: newListingBooked })
            setListingIds(listingIds.slice(1))
          } else {
            setListingDict({ ...listingDict, others: [...listingDict.others, listingInfo] })
            setListingIds(listingIds.slice(1))
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }, [listingIds])
  const getPublishData = () => {
    setListingDict({
      booked: [],
      others: []
    })
    apiRequest('/listings', 'GET', {}, false)
      .then((response) => {
        const listingsAllList = response.listings
        const getlistingIds = listingsAllList.map(item => item.id);
        setListingIds(getlistingIds)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
  return (
    <div>
      <div>
        <Grid container spacing={ 3 } justifyContent="center"
          alignItems="center">
          <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
            <TextField label="keyword" value={ filter.keyWord } onChange={ handleKeywordChange } fullWidth />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
            bedroom num range: { filter.bedrooms.min } - { filter.bedrooms.max }
            <Slider
              value={ [filter.bedrooms.min, filter.bedrooms.max] }
              onChange={ handleBedroomsChange }
              min={ 1 }
              max={ 10 }
              valueLabelDisplay="auto"
            // fullWidth
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
            price range: { filter.price.min } - { filter.price.max }
            <Slider
              value={ [filter.price.min, filter.price.max] }
              onChange={ handlePriceChange }
              min={ 0 }
              max={ 1000 }
              valueLabelDisplay="auto"
            // fullWidth
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 12 } md={ 4 }>
            date range
            <LocalizationProvider dateAdapter={ AdapterDayjs }>
              <Grid container spacing={ 0 } justifyContent="center"
                alignItems="center">
                <Grid item xs={ 5 }>
                  <DatePicker
                    label='Start date'
                    value={ filter.dateRange.startDate }
                    onChange={ (date) => handleDateChange('startDate', date) }
                  />
                </Grid>
                <Grid item xs={ 2 }>
                  <ArrowForwardIosIcon color='gray'></ArrowForwardIosIcon>
                </Grid>
                <Grid item xs={ 5 }>
                  <DatePicker
                    label='End date'
                    value={ filter.dateRange.endDate }
                    onChange={ (date) => handleDateChange('endDate', date) }
                  />
                </Grid>
              </Grid>

            </LocalizationProvider>
          </Grid>
          <Grid item xs={ 6 } sm={ 6 } md={ 4 }>
            <Box mt={ 5 }>
              <Button variant="contained" onClick={ handleSearch } fullWidth>
                Search
              </Button>
            </Box>

          </Grid>
        </Grid>
      </div>
      <>
        <Box mt={ 5 }>
          <Paper>
            <Box pl={ 5 } pr={ 5 } pb={ 5 }>
              <Grid container spacing={ 2 }>
                {
                  filteredListing.map((listing) => (
                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } key={ listing.id }>
                      <Card sx={ { maxWidth: 345 } } >
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="140"
                            image={ listing.thumbnail }
                            alt="green iguana"
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                              { listing.title }
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              Property Type: { listing.propertyType }
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              Bedroom Nums: { listing.bedrooms }
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              Bathroom Nums: { listing.bathrooms }
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              Reviews Nums: { listing.totalReviews }
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              Property amenities:
                              { listing.propertyAmenities && listing.propertyAmenities.map((amenity, index) => (
                                <Chip label={ amenity } color="success" variant="outlined" size='small' key={ index } />
                              )) }
                            </Typography>

                            <Typography variant="h6" color="error">
                              Price: ${ listing.price }
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <Link id="listing-more-link" to={ `/showListing/${listing.id}` }>
                            <Button size="small" variant="outlined" color="primary">Show More</Button>
                            </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>
            </Box>
          </Paper>
        </Box>
      </>
    </div >
  );
}

export default Home;
