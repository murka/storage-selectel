# storage-selectel [![npm version](https://badge.fury.io/js/storage-selectel.svg)](https://badge.fury.io/js/storage-selectel)

```ts
import StorageSelectel from 'storage-selectel'

const storage = new StorageSelectel({
  user: process.env.USER,
  password: process.env.PASSWORD,
  container: 'master'
})


// upload to main container folder
storage.uploadFile({
  path: 'photo.png'
  body: fs.createReadStream('photo.png')
})

// upload to the folder in container
storage.uploadFile({
  path: 'folder/photo.png'
  body: fs.createReadStream('photo.png')
})

// upload to the subfolder in container
storage.uploadFile({
  path: 'folder/subfolder/photo.png'
  body: fs.createReadStream('photo.png')
})

// upload to the folder in specific container 
storage.uploadFile({
  container: 'slave',
  path: 'photo.png',
  body: fs.createReadStream('photo.png')
})

// get all files in container
storage.getContainerFiles()

// get all files in the folder container
storage.getContainerFiles({
  path: 'folder'
})

// get all files in the subfolder container
storage.getContainerFiles({
  path: 'folder/subfolder'
})

// get all files in the specific container
storage.getContainerFiles({
  container: 'slave'
})

```