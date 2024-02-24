import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { apiRequest } from '../utils/api/listing';

const CommentDialog = ({ bookingId, listingId }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    const review = {
      rating, comment
    }
    apiRequest(`/listings/${listingId}/review/${bookingId}`, 'PUT', { review }, false)
      .then((response) => {
        setSnackbarOpen(true)
        window.location.reload()
      })
      .catch((error) => {
        console.log(error)
      });
    handleClose()
  };

  return (
    <div>
      <Button onClick={ handleOpen } color="primary" variant="contained">Comment</Button>
      <Dialog open={ open } onClose={ handleClose }>
        <DialogTitle>Leave a Comment</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Rating: { rating }</Typography>
          <Slider
            value={ rating }
            onChange={ handleRatingChange }
            valueLabelDisplay="auto"
            step={ 1 }
            min={ 1 }
            max={ 5 }
          />
          <TextField
            label="Comment"
            multiline
            rows={ 4 }
            variant="outlined"
            fullWidth
            value={ comment }
            onChange={ handleCommentChange }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleClose } color="primary">
            Cancel
          </Button>
          <Button onClick={ handleSubmit } color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={ snackbarOpen } autoHideDuration={ 3000 } onClose={ handleSnackbarClose }>
        <Alert onClose={ handleSnackbarClose } severity="success">
          Comment successfully!
        </Alert>
      </Snackbar>
    </div>

  );
};

export default CommentDialog;
