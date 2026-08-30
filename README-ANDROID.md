# Khata Saathi — Mobile APK Build

This project is a React + Vite app wrapped with Capacitor for Android.

## Important: GitHub ZIP upload
GitHub's **Upload files** page stores a ZIP as one file; it does not unpack it into repository files. Therefore, **extract this ZIP on your phone first**, then upload the extracted files/folders to the repository root. Make sure the hidden `.github/workflows/android-apk.yml` file is also uploaded.

## GitHub Actions APK build
1. Create a GitHub repository.
2. Extract this ZIP on your phone.
3. Upload all extracted files and folders to the repository root.
4. Commit to the `main` branch.
5. Open **Actions**.
6. Select **Build Khata Saathi APK**.
7. Tap **Run workflow** if it is not already running.
8. Open the successful workflow run.
9. Under **Artifacts**, download **Khata-Saathi-APK**.
10. Extract the downloaded artifact and install `app-debug.apk` on Android.

## Play Store
The workflow above creates a **debug APK for testing**. A Play Store release should use a signed release AAB. Do not upload the debug APK to Google Play production.
