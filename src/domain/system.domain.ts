export const getCommandLine = () => {
  switch (process.platform) {
    case 'darwin':
      return 'open "$1"';
    case 'win32':
      return 'start "" "$1"';
    default:
      return 'xdg-open "$1"';
  }
};
