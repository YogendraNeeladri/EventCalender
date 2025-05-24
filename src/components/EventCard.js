import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { deleteEvent } from '../store/slices/eventsSlice';

const EventCard = ({ event, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteEvent(event.id));
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(event);
  };

  return (
    <Card
      sx={{
        mb: 1,
        cursor: 'pointer',
        borderLeft: `4px solid ${event.color || '#757575'}`,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2" noWrap>
            {event.title}
          </Typography>
          <Box>
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          {event.category && (
            <Chip
              label={event.category}
              size="small"
              sx={{
                bgcolor: event.color,
                color: 'white',
                '& .MuiChip-label': {
                  textTransform: 'capitalize',
                },
              }}
            />
          )}
          {event.recurrence !== 'none' && (
            <Chip
              label={event.recurrence}
              size="small"
              variant="outlined"
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'capitalize',
                },
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard; 
