import { existingWorkouts } from "./existingData.js";
import { uuidv4 } from "./utilityFunctions.js";
import * as userData from "./userData.js";
import { TrainingSession } from "./createTrainingSession.js";

export const listMountNode = document.querySelector(".target");

/********************
 *
 * Create the app controler
 *
 *********************/

export const { _id: id } = userData.afternoonSwim; // afternoonSwim.id
// export const { _id: id } = userData.nightSwim; // nightSwim.id
// export const { _id: id } = userData.afternoonCycle; // afternoonCycle.id

export class triTrainingTrackerApp {
  allWorkouts = [];

  constructor(nodeMount) {
    this.nodeMount = nodeMount;

    // Load from storage
    let allWorkouts = JSON.parse(localStorage.getItem("allWorkouts"));
    if (allWorkouts) {
      this.allWorkouts = allWorkouts;
    } else {
      allWorkouts = [];
    }
  }

  // API
  setGoal({ raceDate = new Date() }) {
    // Calculate time difference in milliseconds
    const today = new Date();
    const daysToGo = raceDate.getTime() - today.getTime();

    // Calculate time in days until race day
    const daysUntilRace = Math.round(daysToGo / (1000 * 3600 * 24));

    const trainingGoals = {
      raceDate: raceDate.toDateString(),
      raceCountDown: `${daysUntilRace}`,
    };
    return trainingGoals;
  }
  addWorkout(workout) {
    this.allWorkouts.push(new TrainingSession(workout));
    this.save();
  }
  getAllWorkouts() {
    return this.allWorkouts;
  }
  updateWorkout(id, changes) {
    const session = this.getById(id);

    if (session == null) {
      throw new Error(`Session name ${workout} has not been found`);
    }

    for (const item in changes) {
      if (changes.hasOwnProperty(item)) {
        session[item] = changes[item];
      }
    }
    this.save();
    return session;
  }
  deleteWorkout(id) {
    const index = this.getByIndex(id);

    this.allWorkouts.splice(index, 1);
    return this.allWorkouts;
  }
  getById(id) {
    return this.allWorkouts.find((athlete) => athlete._id === id);
  }
  getByIndex(id) {
    return this.allWorkouts.findIndex((workout) => workout._id === id);
  }
  workOutReport() {
    const swims = this.allWorkouts.filter((item) => item.workout === "swim");
    const runs = this.allWorkouts.filter((item) => item.workout === "run");
    const cycles = this.allWorkouts.filter((item) => item.workout === "cycle");

    function getTotalKm(data) {
      return data
        .map((swim) => +(swim.distance / 1000).toFixed(2))
        .reduce((curr, acc) => curr + acc, 0);
    }

    const swimTotalKm = getTotalKm(swims);
    const runTotalKm = getTotalKm(runs);
    const cycleTotalKm = getTotalKm(cycles);

    const pace = this.allWorkouts.map((item) => {
      return {
        workout: item.workout,
        pacePerKM: (item.duration * 60) / (item.distance / 1000),
      };
    });

    function getPace(data, sport) {
      return data
        .filter((ex) => ex.workout === sport)
        .map((ex) => +ex.pacePerKM.toFixed(2))
        .reduce((curr, acc) => curr + acc, 0);
    }

    const runPace = getPace(pace, "run");
    const swimPace = getPace(pace, "swim");
    const cyclePace = getPace(pace, "cycle");

    const workoutBreakdown = {
      numRuns: runs.length,
      runDist: runTotalKm.toFixed(2),
      aveRunPacePerKM: runPace,
      // aveRunDist: runTotalKm / runs.length,
      numSwims: swims.length,
      swimDist: swimTotalKm,
      aveSwimPacePerKM: swimPace / 10,
      // aveSwimDist: swimTotalKm / swims.length,
      numCycles: cycles.length,
      cycleDist: cycleTotalKm,
      aveCyclePacePerKM: cyclePace,
      // aveCycleDist: cycleTotalKm / cycles.length,
    };
    return workoutBreakdown;
  }
  pace() {
    const pace = this.allWorkouts.map((item) => {
      return {
        workout: item.workout,
        // date: item.date.toDateString(),
        pacePerKM: ((item.duration * 60) / (item.distance / 1000)).toFixed(2),
      };
    });
    return pace;
  }
  removeAthlete() {
    return this.allWorkouts.filter((name) => name.athlete !== "cath");
  }
  save() {
    localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
  }
  getFromStorage() {
    JSON.parse(localStorage.getItem(this.allWorkouts));
  }
  renderWorkout() {
    // console.log('mount node ...', listMountNode);
    const list = document.createElement("ul");

    if (!this.allWorkouts.length) {
      listMountNode.innerHTML = `<p>No workouts logged so far – get training!</p>`;
    } else {
      list.classList.add("workout-entry");
      list.id = "workout-entry";

      let addWorkout;
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      for (const { date, workout, duration, distance, _id } of this
        .allWorkouts) {
        addWorkout = document.createElement("li");
        addWorkout.classList.add("workout-date");

        addWorkout.innerHTML = `
        <li class="workout-main-content">
  <div class="workout-date">
    <p class="workout-date-time">${new Date(date).toLocaleDateString(
      undefined,
      options,
    )}</p>
  </div>


  <div class="workout-icon">
    <i class="fas fa-${
      workout === "run"
        ? "running running-workout"
        : workout === "swim"
        ? "swimmer swimmer-workout"
        : "biking cycle-workout"
    }"><span class="sr-only">Swim</span></i>
  </div>

  <div class="workout-distance">
    <p class="workout-distance-number">${distance / 1000}</p>
    <p class="text-workout-distance ">kilometers</p>
  </div>

  <div class="workout-duration">
    <p class="workout-duration-number">${duration}</p>
    <p class="text-workout-duration">hours</p>
  </div>

  <div class="workout-pace">
    <p class="workout-pace-number">${(
      (duration * 60) /
      (distance / 1000)
    ).toFixed(2)}</p>
    <p class="text-workout-pace">pace/km</p>
  </div>

  <div class="workout-edit-delete">
    <button data-id="${_id}" class="btn edit-workout">
      <i class="fas fa-user-edit"><span class="sr-only">Edit workout</span></i>
    </button>

    <button data-id="${_id}" class="btn delete-workout"><i class="fas fa-trash-alt"></i><span class="sr-only">Edit workout</span></i></button>
  </div>

</li>
`;
        list.append(addWorkout);
      }
      listMountNode.innerHTML = "";
      listMountNode.append(list);
    }
  }
}
