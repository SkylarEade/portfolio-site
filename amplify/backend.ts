import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { digitPredictFunction } from './functions/digit-predict/resource.js';

defineBackend({
  auth,
  data,
  digitPredictFunction,
});
