import { Router } from "express";
import { google } from "googleapis";
import { createFolder, getSharedFilesByCustomProperties, shareFileWithReadOnlyAccess, uploadFileWithMetadata } from "./google-drive.service.js";
import fs from 'fs';
const driveRoutes = Router();

const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';
const ACCESS_TOKEN = 'will-be-getting-once-user-logged-in';

// driveRoutes.get(
//   "/get-files",
//   async (req, res) => {
//     const auth = new google.auth.OAuth2();
//     auth.setCredentials({ access_token: ACCESS_TOKEN });
//     const drive = google.drive({ version: 'v3', auth });

//     const payload = JSON.stringify({
//       type: 'authorized_user',
//       client_id: GOOGLE_CLIENT_ID,
//       client_secret: GOOGLE_CLIENT_SECRET,
//       refresh_token: '',
//     });

//     const driveRes = await drive.files.list({
//       pageSize: 10,
//       fields: 'nextPageToken, files(id, name)',
//     });
    

//     const files = driveRes.data.files;
//     console.log('Drive files :: ', files)
//     if (files.length === 0) {
//       console.log('No files found.');
//       return;
//     }
  
//     console.log('Files:');
//     files.map((file) => {
//       console.log(`${file.name} (${file.id})`);
//     });
//     return res.status(200).json('Got');
//   }
// );

driveRoutes.post('/setup-account', async (req, res) => {
  const rootFolderId = await createFolder(ACCESS_TOKEN, 'PRECIOUS-LIST-APPLICATION'); 
  console.log('rootFolderId :: ', rootFolderId);
  const dataFolderId = await createFolder(ACCESS_TOKEN, 'PRECIOUS-LIST-APPLICATION-DATA', rootFolderId);
  console.log('dataFolderId :: ', dataFolderId);
  const storageFolderId = await createFolder(ACCESS_TOKEN, 'PRECIOUS-LIST-APPLICATION-STORAGE', rootFolderId);
  console.log('storageFolderId :: ', storageFolderId);
  return res.status(200).json({
    rootFolderId: rootFolderId,
    dataFolderId: dataFolderId,
    storageFolderId: storageFolderId,
  });
});
driveRoutes.post('/add-asset', async (req, res) => {
  const jsonData = req.body;
  const fileName = `${(new Date().getTime())}.json`;
  const folderId = 'user-will-send-this-inside-body';
  // Convert JSON to a JSON file
  // await fs.promises.writeFile(fileName, JSON.stringify(jsonData, null, 2));
  // Pass the file to uploadFileWithMetadata
  const fileId = await uploadFileWithMetadata(ACCESS_TOKEN, fileName, folderId, { name: fileName });
  console.log('fileId :: ', fileId);
  // Delete the file after uploading
  // fs.unlinkSync(fileName);
  return res.status(200).json({
    fileName: fileName,
    fileId: fileId,
  });
});
driveRoutes.post('/share-my-asset', async (req, res) => {
  const {fileId, userEmail} = req.body;
  const result = await shareFileWithReadOnlyAccess(ACCESS_TOKEN,fileId,userEmail)
  return res.status(200).json(result);
});
driveRoutes.get('/get-my-shared-assets', async (req, res) => {
  const {accessToken} = req.body;
  const result = await getSharedFilesByCustomProperties(accessToken)
  return res.status(200).json('Got files');
});

export default driveRoutes;