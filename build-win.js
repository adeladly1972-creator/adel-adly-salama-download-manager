const builder = require('electron-builder');
const path = require('path');

const Platform = builder.Platform;

builder.build({
  targets: Platform.WINDOWS.createTarget(['nsis', 'portable']),
  config: {
    appId: 'com.adeladly.downloadmanager',
    productName: 'Adel Adly Salama Download Manager',
    files: [
      'main.js',
      'preload.js',
      'index.html',
      'styles.css',
      'script.js',
      'assets/**/*',
      'package.json'
    ],
    win: {
      target: [
        {
          target: 'nsis',
          arch: ['x64', 'ia32']
        },
        {
          target: 'portable',
          arch: ['x64', 'ia32']
        }
      ],
      certificateFile: null,
      certificatePassword: null
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: 'Adel Adly Salama Download Manager',
      installerIcon: path.join(__dirname, 'assets/installer-icon.ico'),
      uninstallerIcon: path.join(__dirname, 'assets/installer-icon.ico'),
      installerHeaderIcon: path.join(__dirname, 'assets/installer-icon.ico')
    },
    portable: {
      artifactName: '${productName}-${version}-portable.exe'
    },
    directories: {
      buildResources: 'assets',
      output: 'dist'
    }
  }
}).catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
