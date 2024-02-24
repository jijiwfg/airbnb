import { getToken } from '../Auth'
import request from '../resquest'

// create listing request
export function createNewListing (formData) {
  console.log('dd', formData);
  return request({
    url: '/listings/new',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + getToken(),
      'Content-Type': 'multipart/form-data'
    },
    body: JSON.stringify(formData)
  })
}

// api function
export function apiRequest (path, methods, data, ifCache) {
  return new Promise((resolve, reject) => {
    const options = {
      method: methods,
      headers: {
        'content-type': 'application/json',
      }
    };
    if (getToken()) {
      options.headers.Authorization = 'Bearer ' + getToken();
    }
    if (methods === 'POST' || methods === 'PUT' || methods === 'DELETE') {
      options.body = JSON.stringify(data)
    }
    fetch('http://localhost:5005' + path, options)
      .then((response) => {
        response.json()
          .then((res) => {
            if (res.error) {
              reject(res.error)
            } else {
              resolve(res)
            }
          })
      }).catch((err) => {
        reject(new Error(err))
      })
  })
}

// get listing details
export function getListingInfo (id) {
  return new Promise((resolve, reject) => {
    apiRequest(`/listings/${id}`, 'GET', {}, false)
      .then((response) => {
        const ListingRaw = response.listing
        const metadata = ListingRaw.metadata
        const Bednumbers = metadata.bedroomTypes.map((str) => parseFloat(str));

        // reduce total sum
        const totalBedNum = Bednumbers.reduce((acc, curr) => acc + curr, 0);
        const address = ListingRaw.address
        const totalRating = ListingRaw.reviews.reduce((sum, item) => sum + item.rating, 0);
        let averageRating
        if (ListingRaw.reviews.length > 0) {
          averageRating = totalRating / ListingRaw.reviews.length;
        } else {
          averageRating = 0;
        }

        const getListingData = {
          // propertyType: metadata.propertyType,
          bednums: totalBedNum,
          bedrooms: Bednumbers.length,
          bedroomsType: metadata.bedroomTypes,
          bathrooms: metadata.numBathrooms ? metadata.numBathrooms : 0,
          propertyAmenities: metadata.propertyAmenities,
          propertyImages: metadata.propertyImages,
          addressString: `${address.country}, ${address.state}, ${address.city}, ${address.street}, ${address.postalCode}`,
          rating: averageRating,
          propertyType: metadata.propertyType,
          totalReviews: ListingRaw.reviews.length,
          pricePerNight: ListingRaw.price,
        };
        resolve({ ...getListingData, ...ListingRaw, id })
      })
      .catch((error) => {
        reject(new Error(error))
      });
  })
}

// get booking details
export function getListingBookInfo (id) {
  return new Promise((resolve, reject) => {
    apiRequest('/bookings', 'GET', {}, false)
      .then((response) => {
        const bookingsRaw = response.bookings
        const userBookInfo = bookingsRaw.filter((item) => (item.listingId === id));
        resolve(userBookInfo)
      })
      .catch((error) => {
        reject(new Error(error))
      });
  })
}
