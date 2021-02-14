import { TrainingSession } from './createTrainingSession.js';

/********************
 *
 * Create training sessions data
 *
 *********************/

export const morningRun = new TrainingSession({
  athlete: 'cath',
  date: new Date('11, 25, 2020'),
  duration: 0.5,
  workout: 'run',
  distance: 2000,
  effortRating: 2,
});

export const afternoonSwim = new TrainingSession({
  athlete: 'cath',
  date: new Date('11, 28, 2020'),
  duration: 0.5,
  workout: 'swim',
  distance: 1500,
  effortRating: 3,
});

export const nightSwim = new TrainingSession({
  athlete: 'cath',
  date: new Date('10, 28, 2020'),
  duration: 0.8,
  workout: 'swim',
  distance: 2233,
  effortRating: 5,
});

export const afternoonCycle = new TrainingSession({
  athlete: 'cath',
  date: new Date('11, 01, 2020'),
  duration: 0.5,
  workout: 'cycle',
  distance: 6500,
  effortRating: 3,
});

// Test cases for bad data entry
export const testBadData = new TrainingSession({
  athlete: 'cath', // checked using null and number
  date: new Date('11, 01, 2020'), // checked using null and string
  duration: 0.5, // checked using null and string
  workout: 'run', // checked using kayak, null and number
  distance: 6500, // checked using null and string
  effortRating: 3, // checked using null and string
});

export const eveningRun = new TrainingSession({
  athlete: 'cath',
  date: new Date('12, 7, 2020'),
  duration: 1,
  workout: 'run',
  distance: 5500,
  effortRating: 3,
});

export const diffUser = new TrainingSession({
  athlete: 'ed',
  date: new Date('12, 7, 2020'),
  duration: 1,
  workout: 'run',
  distance: 5500,
  effortRating: 3,
});
