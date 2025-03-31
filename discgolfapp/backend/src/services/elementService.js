import ClubPage from '../models/Clubpage.js'

/**
 * @author Lars Andreas Strand og Adrian Johansen
 * @description This service contains functions for managing elements in the database.
 * @disclaimer The MQL queries in this file are somewhat inspired by Copilot's suggestions.
 */

/**
 * @param req
 * @param res
 * @description Gets elements from the database by club id and role
 * @throws Error if no elements were found
 */

const getElements = async (id, role) => {
  const clubpage = await ClubPage.findById(id)
  if (!clubpage) throw new Error('Invalid club id')

  const elements = {
    nonmemberElements: [],
    memberElements: []
  }

  if (role === 'clubowner') {
    elements.memberElements = clubpage.memberElements
    elements.nonmemberElements = clubpage.nonmemberElements
  } else if (role === 'member') elements.memberElements = clubpage.memberElements

  else elements.nonmemberElements = clubpage.nonmemberElements

  return elements
}

/**
 * @param req
 * @param res
 * @description Creates a new element in the database
 * @throws Error if there was an error creating the element in the database
 * @disclosure $push was suggested by Copilot
 */

const createNewElement = async (id, type, uniqueId, x, y, width, height, view) => {
  const newElement = { type, uniqueId, x, y, width, height }

  if (view === 'member') {
    await ClubPage.updateOne(
      { _id: id },
      { $push: { memberElements: newElement } }
    )
  } else {
    await ClubPage.updateOne(
      { _id: id },
      { $push: { nonmemberElements: newElement } }
    )
  }
}

/**
 * @param req
 * @param res
 * @description Deletes an element from the database by club id, view and element id
 * @throws Error if there was an error deleting the element from the database
 * @disclosure $pull was suggested by Copilot
 */

const deleteElement = async (clubId, view, uniqueId) => {
  let success = false
  if (view === 'member') {
    success = await ClubPage.updateOne(
      { _id: clubId },
      { $pull: { memberElements: { uniqueId } } }
    )
  } else {
    success = await ClubPage.updateOne(
      { _id: clubId },
      { $pull: { nonmemberElements: { uniqueId } } }
    )
  }

  if (!success) throw new Error('Failed to delete element')
}

const updateText = async (text, view, clubId, uniqueId) => {
  let success

  if (view === 'member') {
    success = await ClubPage.updateOne(
      { _id: clubId, 'memberElements.uniqueId': uniqueId },
      { $set: { 'memberElements.$.text': text } }
    )
  } else {
    success = await ClubPage.updateOne(
      { _id: clubId, 'nonmemberElements.uniqueId': uniqueId },
      { $set: { 'nonmemberElements.$.text': text } }
    )
  }

  if (!success || success.modifiedCount === 0) {
    throw new Error('Failed to update text')
  }
}

export { getElements, createNewElement, deleteElement, updateText }
