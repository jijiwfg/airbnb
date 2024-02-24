import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import dayjs from 'dayjs';

function FilterModule () {
  const [filter, setFilter] = useState({
    keyWord: '',
    bedrooms: { min: 1, max: 1 },
    dateRange: { startDate: null, endDate: null },
    price: { min: 0, max: 0 },
  });

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
    console.log('search', filter);
  };

  return (
    <Grid container spacing={ 2 }>
      <Grid item xs={ 6 }>
        <TextField label="key" value={ filter.keyWord } onChange={ handleKeywordChange } fullWidth />
      </Grid>
      <Grid item xs={ 6 }>
        <Button variant="contained" onClick={ handleSearch } fullWidth>
          search
        </Button>
      </Grid>
      <Grid item xs={ 6 }>
        <p>bed: { filter.bedrooms.min } - { filter.bedrooms.max }</p>
        <Slider
          value={ [filter.bedrooms.min, filter.bedrooms.max] }
          onChange={ handleBedroomsChange }
          min={ 1 }
          max={ 10 }
          valueLabelDisplay="auto"
          fullWidth
        />
      </Grid>
      <Grid item xs={ 6 }>
        <p>price: { filter.price.min } - { filter.price.max }</p>
        <Slider
          value={ [filter.price.min, filter.price.max] }
          onChange={ handlePriceChange }
          min={ 0 }
          max={ 1000 }
          valueLabelDisplay="auto"
          fullWidth
        />
      </Grid>
      <Grid item xs={ 12 }>
        <p>date</p>
        <LocalizationProvider dateAdapter={ AdapterDayjs }>
          <DatePicker
            label='Start date'
            value={ filter.startDate }
            onChange={ (date) => handleDateChange('startDate', date) }
          />
          <DatePicker
            label='End date'
            value={ filter.endDate }
            onChange={ (date) => handleDateChange('endDate', date) }
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
}

export default FilterModule;
