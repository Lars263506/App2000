const storage = multer.memoryStorage(); 
const upload = multer({ storage });

app.post('/users/updateProfileImage', upload.single('profileImage'), async (req, res) => {
  const displayName = req.body.displayName; // Henter displayName fra request body

  if (!displayName || !req.file) {
    return res.status(400).json({ error: 'Display name and profile image are required' });
  }

  try {
    const user = await User.findOne({ displayName }); // Finn bruker basert på displayName
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

    const filename = `${displayName}-${Date.now()}`; // Bruk displayName i filnavnet
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      user.profileImage = filename; // Lagre filnavnet i databasen
      await user.save();
      res.json({ message: 'Profile image updated!', profileImage: filename });
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for fetching the profile image
app.get('/profileImage/:displayName', async (req, res) => {
  const displayName = req.params.displayName;

  try {
    const user = await User.findOne({ displayName });
    if (!user || !user.profileImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

    const downloadStream = bucket.openDownloadStreamByName(user.profileImage);
    downloadStream.pipe(res);
    
    downloadStream.on('error', (err) => {
      res.status(404).json({ error: 'Image not found' });
    });

  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
