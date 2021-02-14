import { triTrainingTrackerApp } from './trainingAppController.js';
import { populate } from './utilityFunctions.js';
import { listMountNode } from './trainingAppController.js';

/********************
 *
 * Create an instance of the app
 *
 *********************/

const trainingApp = new triTrainingTrackerApp();

/********************
 *
 * Input race date and calculate days until race
 *
 *********************/

// select DOM nodes
const raceDate = document.getElementById('race-date');

let daysUntilRace = document.querySelector('.days-until-race-number');

raceDate.addEventListener('input', (e) => {
  const dateOfRace = new Date(raceDate.value).toDateString();
  // Set to storage on input
  localStorage.setItem('dateOfRace', dateOfRace);

  GrowlNotification.notify({
    title: 'Race day set!',
    description: "You'd better get training :)",
    type: 'success',
    position: 'top-right',
    closeTimeout: 2500,
  });

  raceDayCountdown();
});

// Set countdown
function raceDayCountdown() {
  // Pull date from storage
  const date = localStorage.getItem('dateOfRace');
  // Convert to date object
  const daysToTrain = trainingApp.setGoal({ raceDate: new Date(date) })
    .raceCountDown;

  const headlineText = document.querySelector('.headline-text');

  if (date) {
    // Get from variable and assign to node
    headlineText.innerHTML = `
    <span class="days-until-race-number">
    ${+daysToTrain} ${
      +daysToTrain === 1 ? 'day' : 'days'
    } </span> until race day </h1>`;
  } else {
    headlineText.textContent = 'Select race date to set countdown';
  }

  // Get training log input so user cannot enter session after their race date
  const trainingDate = document.getElementById('race-date-session');
  trainingDate.max = raceDate.value;
}
raceDayCountdown();

/********************
 *
 * Populate the header box data
 *
 *********************/

function updateBoxes() {
  swimTotalKm.textContent = trainingApp.workOutReport().swimDist;
  swimTotalDist.textContent = trainingApp.workOutReport().numSwims;
  swimPace.textContent = trainingApp.workOutReport().aveSwimPacePerKM;

  bikePace.textContent = trainingApp.workOutReport().aveCyclePacePerKM;
  bikeTotalKm.textContent = trainingApp.workOutReport().cycleDist;
  bikeTotalDist.textContent = trainingApp.workOutReport().numCycles;

  runTotalKm.textContent = trainingApp.workOutReport().runDist;
  runTotalDist.textContent = trainingApp.workOutReport().numRuns;
  runPace.textContent = trainingApp.workOutReport().aveRunPacePerKM;
}

/********************
 *
 * Populate boxes on DOM load
 *
 *********************/

document.addEventListener('DOMContentLoaded', () => {
  updateBoxes();
});

/********************
 *
 * Get data from the form and display
 *
 *********************/

// Select DOM nodes
const trainingForm = document.forms['training-entry-form'];
const trainingFormUpdate = document.forms['training-entry-form-update'];

// Swim Boxes
const swimPace = document.querySelector('.text-pace-number.swim');
const swimTotalKm = document.querySelector('.text-total-number.swim');
const swimTotalDist = document.querySelector(
  '.text-total-training-number.swim',
);

// Bike Boxes
const bikePace = document.querySelector('.text-pace-number.bike');
const bikeTotalKm = document.querySelector('.text-total-number.bike');
const bikeTotalDist = document.querySelector(
  '.text-total-training-number.bike',
);

// Cycle Boxes
const runPace = document.querySelector('.text-pace-number.run');
const runTotalKm = document.querySelector('.text-total-number.run');
const runTotalDist = document.querySelector('.text-total-training-number.run');

// EventListener – Add a workout
trainingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const target = e.target;
  const formData = new FormData(trainingForm);
  const data = Object.fromEntries(formData);

  if (data.distance !== '' && data.duration !== '') {
    // Passing to the app
    trainingApp.addWorkout(data);
    // Render the workouts
    trainingApp.renderWorkout();

    // Populate header boxes with updated figs
    updateBoxes();
    trainingForm.reset();

    GrowlNotification.notify({
      title: 'Nice one!',
      description: "You've added a training session",
      type: 'success',
      position: 'top-right',
      closeTimeout: 2500,
    });
  } else {
    console.log('object');
    GrowlNotification.notify({
      title: 'Ooops!',
      description: 'Please enter distance and duration',
      type: 'warning',
      position: 'top-right',
      closeTimeout: 2500,
    });
  }
});

trainingApp.renderWorkout();

/********************
 *
 * Delete and Update a workout
 *
 *********************/

// const deleteBtn = document.querySelectorAll(".delete-workout");
// console.log(deleteBtn);

listMountNode.addEventListener('click', (e) => {
  e.preventDefault();
  const target = e.target;
  const deleteID = e.target.closest('button').dataset.id;

  if (target && target.matches('.fas.fa-trash-alt')) {
    // console.log(target);
    target.closest('li').remove();
    trainingApp.deleteWorkout(deleteID);
    // console.log(target.dataset.id);
    trainingApp.save();
    updateBoxes();

    // Notification
    GrowlNotification.notify({
      title: 'Deleted',
      description: 'Training session removed',
      type: 'error',
      position: 'top-right',
      closeTimeout: 2500,
    });
  }

  if (target && target.matches('.fas.fa-user-edit')) {
    // Get workout data
    const workoutID = e.target.closest('button').dataset.id;
    // console.log("id of workout is", workoutID);
    const workoutToUpdate = trainingApp.getById(workoutID);
    // console.log('workout to update', workoutToUpdate);

    // SHOW/HIDE
    const enterContainer = document.querySelector('.main-container-enter');
    const updateContainer = document.querySelector('.main-container-update');
    enterContainer.classList.add('main-container-enter-hide');
    updateContainer.classList.add('main-container-update-show');

    GrowlNotification.notify({
      title: 'Editing workout',
      description: 'Make sure your stats are accurate',
      type: 'warning',
      position: 'top-right',
      closeTimeout: 2500,
    });
    // Populate form update form
    populate(trainingFormUpdate, workoutToUpdate);
    e.preventDefault();
  }
});

trainingFormUpdate.addEventListener('submit', (e) => {
  e.preventDefault();

  // Serialise
  const formData = new FormData(trainingFormUpdate);
  const data = Object.fromEntries(formData);
  // console.log("updated data", data);
  trainingFormUpdate.reset();

  const hiddenInputs = trainingFormUpdate.querySelectorAll(
    'input[type="hidden"]',
  );
  for (const input of hiddenInputs) {
    input.value = '';
  }

  // Find changes
  const original = trainingApp.getById(data._id);
  const changes = {};

  for (const [key, value] of Object.entries(original)) {
    // console.log(key, value);
    if (data[key] !== original[key]) {
      changes[key] = data[key];
    }
  }
  // Update
  trainingApp.updateWorkout(data._id, changes);
  trainingApp.renderWorkout(listMountNode);
  updateBoxes();

  // console.log("changes", changes);
  // SHOW/HIDE
  const enterContainer = document.querySelector('.main-container-enter');
  const updateContainer = document.querySelector('.main-container-update');
  enterContainer.classList.remove('main-container-enter-hide');
  updateContainer.classList.remove('main-container-update-show');
});
