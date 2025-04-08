$soundsPath = "assets/sounds"
if (-not (Test-Path $soundsPath)) {
    New-Item -ItemType Directory -Path $soundsPath
}

# 高质量自然声音下载链接
$urls = @{
    "nature.mp3" = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    "rain.mp3" = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    "forest.mp3" = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
}

foreach ($file in $urls.Keys) {
    $outputFile = Join-Path $soundsPath $file
    Write-Host "Downloading $file..."
    try {
        Invoke-WebRequest -Uri $urls[$file] -OutFile $outputFile
        Write-Host "Downloaded $file successfully"
    } catch {
        Write-Host "Failed to download $file"
    }
} 