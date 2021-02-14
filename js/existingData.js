import { TrainingSession } from './createTrainingSession.js';
import { uuidv4 } from './utilityFunctions.js';

/********************
 *
 * Create existing workout data
 *
 *********************/

export let existingWorkouts = [
  {
    athlete: 'cath',
    date: new Date('11, 20, 2020'),
    duration: 0.3,
    workout: 'run',
    distance: 2430,
    effortRating: 5,
    _id: uuidv4(),
  },
  {
    athlete: 'cath',
    date: new Date('11, 21, 2020'),
    duration: 1.2,
    workout: 'run',
    distance: 7140,
    effortRating: 1,
    _id: uuidv4(),
  },
  {
    athlete: 'cath',
    date: new Date('11, 23, 2020'),
    duration: 0.3,
    workout: 'run',
    distance: 2490,
    effortRating: 2,
    _id: uuidv4(),
  },
];
