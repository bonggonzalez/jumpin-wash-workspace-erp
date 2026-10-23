// Recursive function to search for the file
function findFileInFolder(targetFileName, folder) {
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (file.getName() === targetFileName) {
      return file.getUrl();
    }
  }

  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    var fileUrl = findFileInFolder(targetFileName, subfolder);
    if (fileUrl !== "File not found") {
      return fileUrl;
    }
  }

  return "File not found";
}
