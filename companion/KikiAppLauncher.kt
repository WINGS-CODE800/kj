package com.kiki.ai.assistant

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri

/**
 * KIKI AI — Android Universal Package Discovery and Intent Launcher
 * Handles package visibility, intent launching, and web fallback for Android devices
 */
class KikiAppLauncher(private val context: Context) {

    private val packageManager: PackageManager = context.packageManager

    // Discover all installed launchable applications dynamically
    fun getInstalledAppPackages(): List<String> {
        val intent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }
        val resolveInfoList = packageManager.queryIntentActivities(intent, 0)
        return resolveInfoList.map { it.activityInfo.packageName }
    }

    // Launch app by package name or URL scheme
    fun launchApplication(packageName: String, webFallbackUrl: String? = null): Boolean {
        try {
            val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(launchIntent)
                return true
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Fallback to official web URL if installed app is unavailable
        if (!webFallbackUrl.isNullOrEmpty()) {
            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(webFallbackUrl)).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(browserIntent)
            return true
        }

        return false
    }
}
