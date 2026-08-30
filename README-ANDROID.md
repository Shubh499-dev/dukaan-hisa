# Khata Saathi — Android APK build

This project is prepared for mobile/cloud building with Capacitor.

## GitHub Actions (recommended)
1. Upload the project files to a GitHub repository.
2. Make sure `.github/workflows/android-apk.yml` is present.
3. Open the repository's **Actions** tab.
4. Select **Build Khata Saathi APK**.
5. Tap **Run workflow** (or push to `main`).
6. When the run completes, open the run and download the artifact **Dukaan-Hisab-debug-apk**.
7. Extract the artifact and install `app-debug.apk` on Android.

The debug APK is for testing/sideloading. For Google Play, create a signed release AAB with a protected keystore/signing setup; do not publish the debug APK.
