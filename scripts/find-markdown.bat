@echo off
setlocal enabledelayedexpansion

echo Recursive Markdown File Search
echo ==============================
echo Looking for files that contain: "published: true"
echo But do NOT contain: "/enneagram-corner/enneagram-type-"
echo.

:: Set the search directory (use current directory if not specified)
set "search_dir=%~1"
if "%search_dir%"=="" set "search_dir=%cd%"

echo Searching in: %search_dir%
echo.

:: Create output file
set "output_file=%cd%\matching-files.txt"
if exist "%output_file%" del "%output_file%"
echo Files matching criteria:> "%output_file%"

:: Counter for matching files
set count=0

:: Recursively search for .md files
for /r "%search_dir%" %%f in (*.md) do (
    set "file=%%f"
    set "match_include=false"
    set "match_exclude=true"
    
    :: Search for include criteria
    findstr /c:"published: true" "%%f" >nul 2>&1
    if !errorlevel! equ 0 (
        set "match_include=true"
        
        :: Search for exclude criteria
        findstr /c:"/enneagram-corner/enneagram-type-" "%%f" >nul 2>&1
        if !errorlevel! equ 0 (
            set "match_exclude=false"
        )
        
        :: If both criteria are met, add to results
        if "!match_include!"=="true" if "!match_exclude!"=="true" (
            set /a count+=1
            echo !count!. %%f
            echo %%f>> "%output_file%"
        )
    )
)

echo.
if %count% equ 0 (
    echo No matching files found.
    echo No matching files found.> "%output_file%"
) else (
    echo Found %count% matching files.
    echo Results saved to: %output_file%
)

endlocal