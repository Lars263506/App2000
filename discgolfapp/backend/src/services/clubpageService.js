import ClubPage from '../models/Clubpage.js'

const getAllClubPages = async () => {
  const excludeFields = ['clubOwner', '__v', 'createdAt', 'updatedAt', 'members', 'events', 'memberElements', 'nonmemberElements']

  const clubPages = await ClubPage.find({}).select(`-${excludeFields.join(' -')}`)
  if (!clubPages) throw new Error('No club pages found')
  return clubPages
}

const getClubPage = async (id, role) => {
  const excludeFields = ['__v', 'createdAt', 'updatedAt']

  if (role === 'user') {
    excludeFields.push('members', 'events', 'memberElements')
  } else if (role === 'member') {
    excludeFields.push('nonmemberElements')
  }

  const clubPage = await ClubPage.findById(id).select(`-${excludeFields.join(' -')}`)
  if (!clubPage) throw new Error('Club page not found')
  return clubPage
}

const createNewClubPage = async (name, clubOwner, description, address, zipCode, websiteURL, email, phone) => {
  const newClubPage = {
    name,
    clubOwner,
    description,
    address,
    zipCode,
    websiteURL,
    email,
    phone,
    members: [],
    events: []
  }

  try {
    const createdClubPage = await ClubPage.create(newClubPage)
    return createdClubPage
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Club page with this name already exists')
    } else {
      throw new Error('Error creating club page')
    }
  }
}

const deleteClubPage = async (id) => {
  const clubPage = await ClubPage.findByIdAndDelete(id)
  if (!clubPage) throw new Error('Club page not found')
  return clubPage
}

const updateClubPage = async (id, request) => {
  const clubPage = await ClubPage.findByIdAndUpdate(id, request, { new: true })
  if (!clubPage) throw new Error('Club page not found')

  console.log(clubPage)
}

export { getAllClubPages, getClubPage, createNewClubPage, deleteClubPage, updateClubPage }
