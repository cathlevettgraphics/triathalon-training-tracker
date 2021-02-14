import { uuidv4 } from './utilityFunctions.js';

/********************
 *
 * Create a training session
 *
 *********************/

export class TrainingSession {
  constructor({ date, duration, workout, distance, _id = uuidv4() }) {
    (this.date = date),
      (this.workout = workout),
      (this.duration = duration), // input added as decimal: 150min / 60 = 2.5hrs
      (this.distance = distance), // input as metres
      (this._id = _id);
  }
}
