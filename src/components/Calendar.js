import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EventForm from './EventForm';
import EventCard from './EventCard';
import { updateEvent } from '../store/slices/eventsSlice';

const EVENT_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' },
];

const Calendar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsEventFormOpen(true);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const eventId = result.draggableId;
    const newDate = new Date(result.destination.droppableId);
    const event = events.find(e => e.id === eventId);

    if (event) {
      const updatedEvent = {
        ...event,
        start: newDate,
        end: new Date(newDate.getTime() + (event.end - event.start)),
      };
      dispatch(updateEvent(updatedEvent));
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <Box>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {EVENT_CATEGORIES.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Grid item xs key={day}>
              <Paper
                sx={{
                  p: 1,
                  textAlign: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                }}
              >
                {day}
              </Paper>
            </Grid>
          ))}

          {days.map((day) => {
            const dayEvents = filteredEvents.filter(
              (event) =>
                format(new Date(event.start), 'yyyy-MM-dd') ===
                format(day, 'yyyy-MM-dd')
            );

            return (
              <Grid item xs key={day.toString()}>
                <Droppable droppableId={day.toString()}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        p: 1,
                        minHeight: 120,
                        bgcolor: isToday(day) ? 'action.hover' : 'background.paper',
                        opacity: isSameMonth(day, currentDate) ? 1 : 0.5,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDateClick(day)}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: isToday(day) ? 'primary.main' : 'text.primary',
                          fontWeight: isToday(day) ? 'bold' : 'normal',
                        }}
                      >
                        {format(day, 'd')}
                      </Typography>
                      {dayEvents.map((event, index) => (
                        <Draggable
                          key={event.id}
                          draggableId={event.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <EventCard event={event} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Paper>
                  )}
                </Droppable>
              </Grid>
            );
          })}
        </Grid>
      </DragDropContext>

      <EventForm
        open={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
      />
    </Box>
  );
};

export default Calendar; 
