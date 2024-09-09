import { google } from "googleapis";
import fs from 'fs';
// Function to initialize Google Drive client
export function getDriveClient(accessToken) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth });
}

// Function to create a folder
export async function createFolder(accessToken, folderName, parentFolderId = 'root') {
  const drive = getDriveClient(accessToken);

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentFolderId],
  };

  try {
    const folder = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name',
    });

    console.log(`Folder created: ${folder.data.name} (ID: ${folder.data.id})`);
    return folder.data.id;
  } catch (error) {
    console.error('Error creating folder:', error.message);
    throw error;
  }
}

// Function to upload a file with custom metadata
export async function uploadFileWithMetadata(accessToken, filePath, folderId, customMetadata) {
  const drive = getDriveClient(accessToken);

  const fileMetadata = {
    name: customMetadata.name || 'file.json',
    parents: [folderId],
    // properties: customMetadata.properties || {},
    properties: {
      globalSearchQuery: 'precious-list-application'
    },
  };
console.log('fileMetadata :: ', fileMetadata);
  const media = {
    mimeType: customMetadata.mimeType || 'application/json',
    body: fs.createReadStream(filePath),
  };
  console.log('media :: ', media);

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    });

    console.log(`File uploaded: ${response.data.name}, ID: ${response.data.id}`);
    console.log(`View File: ${response.data.webViewLink}`);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
}

export async function uploadMultipleFilesWithMetadata(accessToken, files, folderId) {
  for (const file of files) {
    await uploadFileWithMetadata(accessToken, file.path, folderId, {
      name: file.customName,
      mimeType: file.mimeType,
      properties: file.customMetadata,
    });
  }
}

// Function to share a file with read-only access
export async function shareFileWithReadOnlyAccess(accessToken, fileId, emailAddress) {
  const drive = getDriveClient(accessToken);

  const permission = {
    type: 'user',
    role: 'reader',
    emailAddress: emailAddress,
  };

  try {
    const response = await drive.permissions.create({
      fileId: fileId,
      resource: permission,
      fields: 'id',
      sendNotificationEmail: true, // This sends an email notification to the user
    });

    console.log(`File shared with ${emailAddress} with read-only access.`);
    return response.data;
  } catch (error) {
    console.error('Error sharing file:', error.message);
    throw error;
  }
}

// Function to get shared files filtered by custom properties
export async function getSharedFilesByCustomProperties(accessToken, propertyKey, propertyValue) {
  const drive = getDriveClient(accessToken);

  const query = `'me' in readers and sharedWithMe = true and properties has { key='globalSearchQuery' and value='precious-list-application' }`;

  try {
    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, owners, properties, webViewLink)',
    });

    if (response.data.files.length === 0) {
      console.log('No shared files found with the specified custom property.');
    } else {
      console.log('Shared files with the specified custom property:');
      response.data.files.forEach(file => {
        console.log(`Name: ${file.name}, ID: ${file.id}, Owner: ${file.owners[0].displayName}`);
        console.log(`Properties: ${JSON.stringify(file.properties)}`);
        console.log(`View File: ${file.webViewLink}`);
      });
    }

    return response.data.files;
  } catch (error) {
    console.error('Error retrieving shared files:', error.message);
    throw error;
  }
}