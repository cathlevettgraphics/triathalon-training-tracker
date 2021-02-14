import { uuidv4 } from './utilityFunctions.js';

/********************
 *
 * Create a training session
 *
 *********************/

export class TrainingSession {
  // static uuidv4() {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
  //     /[xy]/g,
  //     function (c) {
  //       let r = (Math.random() * 16) | 0,
  //         v = c == 'x' ? r : (r & 0x3) | 0x8;
  //       return v.toString(16);
  //     },
  //   );
  // }
  constructor({ date, duration, workout, distance, _id = uuidv4() }) {
    // defensive checks
    // if (date == null || typeof date !== 'object') {
    //   throw new Error(
    //     `We were expecting a date, you entered ${date} which is a ${typeof date}`,
    //   );
    // }

    // if (duration == null || typeof duration !== 'number') {
    //   throw new Error(
    //     `We were expecting a number, you entered ${duration} which is a ${typeof duration}`,
    //   );
    // }

    if (workout == null || typeof workout !== 'string') {
      throw new Error(
        `We were expecting a number, you entered ${workout} which is a ${typeof workout}`,
      );
    }

    // // TODO – convert input to lower case
    // if (workout !== 'run' && workout !== 'swim' && workout !== 'cycle') {
    //   throw new Error(
    //     `You are training for a triathalon! Please enter a 'run', 'swim' or 'cycle' training session. You entered ${workout}`,
    //   );
    // }

    (this.date = date),
      (this.workout = workout),
      (this.duration = duration), // input added as decimal: 150min / 60 = 2.5hrs
      (this.distance = distance), // input as metres
      (this._id = _id);
  }
}
