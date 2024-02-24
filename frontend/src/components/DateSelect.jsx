import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import { apiRequest } from '../utils/api/listing';
function DateRangePickerPopup ({ id }) {
  const [dateRanges, setDateRanges] = useState([{ startDate: null, endDate: null }]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleAddDateRange = () => {
    const newDateRange = { startDate: null, endDate: null };
    setDateRanges([...dateRanges, newDateRange]);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (index, field, value) => {
    const updatedDateRanges = [...dateRanges];
    updatedDateRanges[index][field] = value;
    setDateRanges(updatedDateRanges);
  };

  const validateDateRanges = () => {
    for (const dateRange of dateRanges) {
      if (dateRange.startDate && dateRange.endDate && dateRange.startDate.isAfter(dateRange.endDate)) {
        return false;
      }
    }
    return true;
  };

  const handleConfirm = () => {
    if (validateDateRanges()) {
      const mergedDateRanges = [];
      dateRanges.forEach((dateRange) => {
        const lastMergedRange = mergedDateRanges[mergedDateRanges.length - 1];
        if (lastMergedRange && lastMergedRange.endDate >= dateRange.startDate) {
          lastMergedRange.endDate = dateRange.endDate > lastMergedRange.endDate ? dateRange.endDate : lastMergedRange.endDate;
        } else {
          mergedDateRanges.push({ ...dateRange });
        }
      });
      const availability = mergedDateRanges.map((dateRange) => ({
        startDate: dateRange.startDate ? dateRange.startDate.format('YYYY-MM-DD') : null,
        endDate: dateRange.endDate ? dateRange.endDate.format('YYYY-MM-DD') : null,
      }));
      apiRequest(`/listings/publish/${id}`, 'PUT', { availability }, false)
        .then((response) => {
          setSnackbarOpen(true)
          window.location.reload()
          // uploadListingData()
        })
        .catch((error) => {
          alert(error)
        });
      setOpen(false);
    } else {
      setErrorMessage('invalid date');
    }
  };

  return (
    <>
      <Button id="publish-btn" variant="contained" color="primary" size="small" onClick={ handleOpen }>
        Publish
      </Button>
      <Dialog open={ open } onClose={ handleClose }>
        <DialogTitle>set Date Range</DialogTitle>
        <DialogContent>
          { dateRanges.map((dateRange, index) => (
            <div key={ index }>
              <LocalizationProvider dateAdapter={ AdapterDayjs }>
                <DatePicker
                  label={ `start date ${index + 1}` }
                  value={ dateRange.startDate }
                  onChange={ (date) => handleDateChange(index, 'startDate', date) }
                />
                <DatePicker
                  label={ `end date ${index + 1}` }
                  value={ dateRange.endDate }
                  onChange={ (date) => handleDateChange(index, 'endDate', date) }
                />
              </LocalizationProvider>
            </div>
          )) }
          <DialogContentText style={ { color: 'red' } }>{ errorMessage }</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={ handleAddDateRange }>
            add New date range
          </Button>
          <Button id="confirm-publish" variant="contained" color="primary" onClick={ handleConfirm }>
            confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={ snackbarOpen } autoHideDuration={ 3000 } onClose={ handleSnackbarClose }>
        <Alert onClose={ handleSnackbarClose } severity="success">
          Publish listing successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default DateRangePickerPopup;
