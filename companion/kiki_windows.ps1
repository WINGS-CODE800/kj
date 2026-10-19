<#
 ==============================================================================
  KIKI AI — Windows Native Automation & Universal App Launcher
  Supports native Windows desktop application discovery, URI schemes, and keystrokes
 ==============================================================================
#>

param (
    [string]$Action = "launch",
    [string]$Target = "notepad"
)

function Launch-App([string]$AppName) {
    Write-Host "🤖 [KIKI Windows Bridge] Attempting to launch: $AppName"

    # 1. Check known URI Schemes
    $UriMap = @{
        "instagram" = "instagram:"
        "whatsapp"  = "whatsapp:"
        "spotify"   = "spotify:"
        "facebook"  = "fb:"
        "calculator"= "calculator:"
        "settings"  = "ms-settings:"
        "camera"    = "microsoft.windows.camera:"
        "photos"    = "ms-photos:"
        "word"      = "ms-word:"
        "excel"     = "ms-excel:"
        "powerpoint"= "ms-powerpoint:"
    }

    $Key = $AppName.ToLower().Trim()
    if ($UriMap.ContainsKey($Key)) {
        Start-Process $UriMap[$Key]
        Write-Host "✅ Launched URI scheme: $($UriMap[$Key])"
        return
    }

    # 2. Check executable in Path or Program Files
    try {
        Start-Process $AppName -ErrorAction Stop
        Write-Host "✅ Launched executable: $AppName"
        return
    } catch {
        # Try through explorer shell
        Start-Process "explorer.exe" "shell:AppsFolder\$AppName" -ErrorAction SilentlyContinue
    }
}

if ($Action -eq "launch") {
    Launch-App -AppName $Target
}
