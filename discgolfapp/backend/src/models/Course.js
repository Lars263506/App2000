/**
 * Course Model
 * Represents a disc golf course with its details, including location, difficulty, and associated pins and lines.
 *
 * @module models/Course
 * @requires mongoose
 * @requires Pin
 * @requires Line
 *
 * @typedef {Object} Course
 * @property {string} name - The name of the course (unique and required).
 * @property {string} courseOwner - The owner of the course (default: 'Unknown').
 * @property {string} location - The specific location of the course (required).
 * @property {string} town - The town where the course is located (required).
 * @property {string} postCode - The postal code of the course's location (required).
 * @property {string} url - The URL for more information about the course.
 * @property {number} latitude - The latitude coordinate of the course.
 * @property {number} longitude - The longitude coordinate of the course.
 * @property {string} difficulty - The difficulty level of the course (enum: ['Easy', 'Medium', 'Hard'], default: 'Medium').
 * @property {boolean} familyFriendly - Indicates if the course is family-friendly.
 * @property {number} holes - The number of holes in the course.
 * @property {Pin[]} pins - The list of pins associated with the course.
 * @property {Line[]} lines - The list of lines connecting pins in the course.
 * @property {ObjectId[]} reviews - References to reviews associated with the course.
 *
 * @author Andreas Nilsen, Lars Andreas & Ibrahim Queeum
 * @description Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors.
 */

import mongoose from 'mongoose';

import Pin from './Pin.js';
import Line from './Line.js';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    courseOwner: {
      type: String,
      default: 'Unknown',
    },
    location: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    postCode: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    familyFriendly: {
      type: Boolean,
    },
    holes: {
      type: Number,
    },
    pins: {
      type: [Pin.schema],
      default: []
    },
    lines: {
      type: [Line.schema],
      default: []
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

const Course = mongoose.model('Course', schema);

export default Course;
