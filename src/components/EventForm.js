import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { v4 as uuidv4 } from 'uuid';
import { addEvent, updateEvent, clearError } from '../store/slices/eventsSlice';

const EVENT_CATEGORIES = [
  { value: 'meeting', label: 'Meeting', color: '#1976d2' },
  { value: 'task', label: 'Task', color: '#2e7d32' },
  { value: 'reminder', label: 'Reminder', color: '#ed6c02' },
  { value: 'personal', label: 'Personal', color: '#9c27b0' },
  { value: 'other', label: 'Other', color: '#757575' },
];

const EventForm = ({ open, onClose, selectedDate, event }) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.events.error);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    recurrence: 'none',
    category: 'other',
    color: '#757575',
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        start: selectedDate,
        end: new Date(selectedDate.getTime() + 60 * 60 * 1000), // 1 hour later
      }));
    }
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        recurrence: event.recurrence || 'none',
        category: event.category || 'other',
        color: event.color || '#757575',
      });
    }
  }, [selectedDate, event]);

  useEffect(() => {
    if (!open) {
      dispatch(clearError());
    }
  }, [open, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      id: event?.id || uuidv4(),
      ...formData,
    };

    if (event) {
      dispatch(updateEvent(eventData));
    } else {
      dispatch(addEvent(eventData));
    }
    
    if (!error) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && {
        color: EVENT_CATEGORIES.find(cat => cat.value === value)?.color || '#757575',
      }),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Start"
                  value={formData.start}
                  onChange={(newValue) => {
                    setFormData(prev => ({ ...prev, start: newValue }));
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="End"
                  value={formData.end}
                  onChange={(newValue) => {
                    setFormData(prev => ({ ...prev, end: newValue }));
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    {EVENT_CATEGORIES.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: category.color,
                              mr: 1,
                            }}
                          />
                          {category.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Recurrence</InputLabel>
                  <Select
                    name="recurrence"
                    value={formData.recurrence}
                    onChange={handleChange}
                    label="Recurrence"
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {event ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm; 
