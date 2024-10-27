// Import the necessary Firebase modules
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration object
// const firebaseConfig = {
//   apiKey: "AIzaSyCE0ZnL73k7axDs2jYrnnHiVKadSzbvxIM",
//   authDomain: "otp-poc-8deab.firebaseapp.com",
//   projectId: "otp-poc-8deab",
//   storageBucket: "otp-poc-8deab.appspot.com",
//   messagingSenderId: "767813172484",
//   appId: "1:767813172484:web:551e4cf5ed01ec89206451",
//   measurementId: "G-5VSMFMXELK",
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyCjEhWcQPmiHoZhlq5A1SnVRTDFMIw1EnQ",

//   authDomain: "otp-poc-project-1fin.firebaseapp.com",

//   projectId: "otp-poc-project-1fin",

//   storageBucket: "otp-poc-project-1fin.appspot.com",

//   messagingSenderId: "893121171800",

//   appId: "1:893121171800:web:b2941519e0ffb42eac152d",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCpjnRPtEZmmZHyPEUMvwUVq_ALjNSm_Sc",
  authDomain: "otp-demo-251d1.firebaseapp.com",
  projectId: "otp-demo-251d1",
  storageBucket: "otp-demo-251d1.appspot.com",
  messagingSenderId: "1043467791624",
  appId: "1:1043467791624:web:82448fc5653a8442de90bd",
};
// Initialize Firebase if it hasn’t been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
