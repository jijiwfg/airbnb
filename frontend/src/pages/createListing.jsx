import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { fileToDataUrl } from '../utils/helper';
import { apiRequest } from '../utils/api/listing';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
function CreateListing () {
  const [formData, setFormData] = useState({
    title: '',
    address: {
      country: '',
      state: '',
      city: '',
      street: '',
      postalCode: '',
    },
    price: 0,
    thumbnail: ''
  });

  // const [listingThumbnail, setListingThumbnail] = useState(null);
  // const [numBathrooms, setNumBathrooms] = useState(1);
  const [bedroomTypes, setBedroomTypes] = useState([]);
  const [numBathrooms, setNumBathrooms] = useState(0)
  const [propertyAmenities, setPropertyAmenities] = useState([]);
  const [propertyType, setPropertyType] = useState('');
  const [propertyImages, setPropertyImages] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handelpropertyImagesUpload = (e) => {
    const file = e.target.files[0];
    fileToDataUrl(file)
      .then(dataUrl => {
        setPropertyImages([...propertyImages, dataUrl])
      })
      .catch(error => {
        console.error(error);
      });
  }
  const handelThumbnailUpload = (e) => {
    const file = e.target.files[0];
    fileToDataUrl(file)
      .then(dataUrl => {
        setFormData({
          ...formData,
          thumbnail: dataUrl,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };
  const handleAddBedroomType = () => {
    setBedroomTypes([...bedroomTypes, 'Single']);
  };

  const handleCreateListing = () => {
    const metadata = {
      propertyImages, propertyAmenities, bedroomTypes, propertyType, numBathrooms
    }
    const uploadData = {
      ...formData,
      metadata
    }
    apiRequest('/listings/new', 'POST', uploadData, false)
      .then((response) => {
        setSnackbarOpen(true)
        window.location.href = '/hostedListing';
      })
      .catch((error) => {
        alert(error)
      });
  }

  const handleAddAmenity = (text) => {
    setPropertyAmenities([...propertyAmenities, text]);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Listing
      </Typography>
      <form>
        <Grid container spacing={ 2 }>
          <Grid item xs={ 12 } sm={ 12 }>
            <Grid container spacing={ 2 }>
              <Grid item xs={ 6 } sm={ 6 }>
                <Grid container spacing={ 2 }>
                  <Grid item xs={ 12 } sm={ 12 }>
                    <TextField
                      label="Listing Title"
                      fullWidth
                      name='title'
                      value={ formData.title }
                      onChange={ (e) => setFormData({ ...formData, title: e.target.value }) }
                    />
                  </Grid>
                  <Grid item xs={ 12 } sm={ 12 } >
                    <FormControl fullWidth>
                      <InputLabel>Property Type</InputLabel>
                      <Select id="proporty-combobox" value={ propertyType } onChange={ (e) => setPropertyType(e.target.value) }>
                        <MenuItem id="option-Apartment" value="Apartment">Apartment</MenuItem>
                        <MenuItem value="House">House</MenuItem>
                        <MenuItem value="Villa">Villa</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={ 12 } sm={ 12 } >
                    <TextField
                      label="Listing Price (per night)"
                      fullWidth
                      type="number"
                      name="price"
                      value={ formData.price }
                      onChange={ (e) => setFormData({ ...formData, price: e.target.value }) }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={ 6 } sm={ 6 }>
                <Box>
                  { formData.thumbnail && (
                    <img
                      src={ formData.thumbnail }
                      alt="Thumbnail"
                      style={ { maxWidth: '150px', maxHeight: '150px' } }
                    />
                  ) }
                </Box>
                <Button component="label" variant="contained" startIcon={ <CloudUploadIcon /> }>
                  Upload file
                  <input id="uploadFile" type="file" accept="image/*" onChange={ handelThumbnailUpload } style={ { display: 'none' } } />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <TextField label="Country" name="country" fullWidth value={ formData.address.country } onChange={ handleAddressChange } />
          </Grid>
          <Grid item xs={ 12 } sm={ 6 }>
            <TextField label="State" name="state" fullWidth value={ formData.address.state } onChange={ handleAddressChange } />
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <TextField label="City" name="city" fullWidth value={ formData.address.city } onChange={ handleAddressChange } />
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <TextField label="Street" name="street" fullWidth value={ formData.address.street } onChange={ handleAddressChange } />
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <TextField label="Postal Code" name="postalCode" fullWidth value={ formData.address.postalCode } onChange={ handleAddressChange } />
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <TextField
              label="Number of Bathrooms"
              type="number"
              name="number"
              value={ numBathrooms }
              onChange={ (e) => setNumBathrooms(e.target.value) }
            />
          </Grid>
        </Grid>
        <Typography variant="h5" component="h5" color='gray' mt={ 2 } mb={ 2 }>
          Bedroom Settingg
        </Typography>
        <Button startIcon={ <AddIcon /> } onClick={ handleAddBedroomType } variant="outlined">
          Add Bedroom
        </Button>
        { bedroomTypes.map((bedroomType, index) => (
          <Box key={ index } mt={ 2 }>
            <TextField
              label={ `Number of beds in room ${index + 1}` }
              type="number"
              value={ bedroomType }
              onChange={ (e) => {
                const updatedBedroomTypes = [...bedroomTypes];
                updatedBedroomTypes[index] = e.target.value;
                setBedroomTypes(updatedBedroomTypes);
              } }
            />
          </Box>
        )) }

        <Box mt={ 2 }>
          <Typography variant="h5" component="h5" color='gray' mt={ 2 } mb={ 2 }>
            Property Amenity Settingg
          </Typography>
          <Button
            startIcon={ <AddIcon /> }
            variant="outlined"
            onClick={ () => {
              const text = window.prompt('Add Property Amenity');
              if (text) {
                handleAddAmenity(text);
              }
            } }
          >
            Add Property Amenity
          </Button>
        </Box>

        { propertyAmenities.map((amenity, index) => (
          <Box key={ index } display="flex" alignItems="center" mt={ 1 }>
            <Chip label={ amenity } onDelete={ () => setPropertyAmenities(propertyAmenities.filter((_, i) => i !== index)) } />
          </Box>
        )) }
        <Box mt={ 2 }>
          <Typography variant="h5" component="h5" color='gray' mt={ 2 } mb={ 2 }>
            Upload Property Images
          </Typography>
          <Button startIcon={ <AddIcon /> } variant="outlined" component="label">
            Upload
            <input id="setPropertyImages" type="file" accept="image/*" onChange={ handelpropertyImagesUpload } style={ { display: 'none' } } />
          </Button>

        </Box>
        { propertyImages.map((image, index) => (
          <Box key={ index } mt={ 2 }>
            <img
              src={ image }
              alt={ `Image ${index + 1}` }
              style={ { maxWidth: '150px', maxHeight: '150px' } }
            />
            <IconButton onClick={ () => setPropertyImages(propertyImages.filter((_, i) => i !== index)) }>
              <DeleteIcon />
            </IconButton>
          </Box>
        )) }
        <Box mt={ 4 }>
          <Button id="create-listing-btn" variant="contained" color="primary" onClick={ handleCreateListing }>
            Create Listing
          </Button>
        </Box>

      </form>
      <Snackbar open={ snackbarOpen } autoHideDuration={ 3000 } onClose={ handleSnackbarClose }>
        <Alert onClose={ handleSnackbarClose } severity="success">
          Listing created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CreateListing;
