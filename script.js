{\rtf1\ansi\ansicpg1252\cocoartf2709
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red240\green240\blue234;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c95335\c95335\c93261;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww30040\viewh17760\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs32 \cf0 \cb2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec3 let autocompleteHome, autocompleteNew;\
\
document.addEventListener('DOMContentLoaded', function() \{\
    initAutocomplete();\
\});\
\
function initAutocomplete() \{\
    try \{\
        const options = \{\
            types: ['(cities)'],\
            fields: ['formatted_address', 'geometry', 'name']\
        \};\
\
        autocompleteHome = new google.maps.places.Autocomplete(\
            document.getElementById('homeLocation'),\
            options\
        );\
        \
        autocompleteNew = new google.maps.places.Autocomplete(\
            document.getElementById('newLocation'),\
            options\
        );\
\
        document.querySelectorAll('.location-input').forEach(input => \{\
            input.addEventListener('keydown', e => \{\
                if (e.key === 'Enter') e.preventDefault();\
            \});\
        \});\
\
    \} catch (error) \{\
        console.error('Error initializing Google Places:', error);\
    \}\
\}\
\
async function calculateHours() \{\
    try \{\
        const homePlace = autocompleteHome.getPlace();\
        const newPlace = autocompleteNew.getPlace();\
        \
        if (!homePlace || !newPlace) \{\
            showResult('Please select valid cities from the dropdown suggestions.');\
            return;\
        \}\
\
        const startTime = document.getElementById('startTime').value;\
        const endTime = document.getElementById('endTime').value;\
\
        // Get timezone data for both locations\
        const homeTz = await getTimezone(\
            homePlace.geometry.location.lat(),\
            homePlace.geometry.location.lng()\
        );\
        \
        const newTz = await getTimezone(\
            newPlace.geometry.location.lat(),\
            newPlace.geometry.location.lng()\
        );\
\
        // Calculate total offset for each location (rawOffset + dstOffset)\
        const homeOffset = (homeTz.rawOffset + homeTz.dstOffset) / 3600; // Convert to hours\
        const newOffset = (newTz.rawOffset + newTz.dstOffset) / 3600;   // Convert to hours\
        \
        // Calculate time difference between locations\
        const hoursDiff = newOffset - homeOffset;\
\
        // Convert times\
        const [startHours, startMinutes] = startTime.split(':').map(Number);\
        const [endHours, endMinutes] = endTime.split(':').map(Number);\
\
        // Add the difference to both times\
        let newStartHours = startHours + hoursDiff;\
        let newEndHours = endHours + hoursDiff;\
\
        // Format the converted times\
        const convertedStart = formatTime(newStartHours, startMinutes);\
        const convertedEnd = formatTime(newEndHours, endMinutes);\
\
        showResult(`\
            <div class="result-text">My working hours will be:</div>\
            <div class="converted-time">$\{convertedStart\} - $\{convertedEnd\}</div>\
        `);\
    \} catch (error) \{\
        console.error('Calculation error:', error);\
        showResult('Error calculating time difference. Please try again.');\
    \}\
\}\
\
function formatTime(hours, minutes) \{\
    // Handle hour wraparound\
    while (hours < 0) hours += 24;\
    while (hours >= 24) hours -= 24;\
    \
    let period = 'AM';\
    if (hours >= 12) \{\
        period = 'PM';\
        if (hours > 12) hours -= 12;\
    \}\
    if (hours === 0) hours = 12;\
    \
    return `$\{Math.floor(hours)\}:$\{minutes.toString().padStart(2, '0')\} $\{period\}`;\
\}\
\
async function getTimezone(lat, lng) \{\
    try \{\
        const timestamp = Math.floor(Date.now() / 1000);\
        const response = await fetch(\
            `https://maps.googleapis.com/maps/api/timezone/json?location=$\{lat\},$\{lng\}&timestamp=$\{timestamp\}&key=AIzaSyDNjIHQsSdFqBYOO0LYkJNluGDXcNw_meU`\
        );\
        \
        if (!response.ok) throw new Error('Timezone API request failed');\
        \
        const data = await response.json();\
        if (data.status !== 'OK') throw new Error(data.status);\
        \
        return data;  // Return the full timezone data object\
    \} catch (error) \{\
        console.error('Timezone fetch error:', error);\
        throw error;\
    \}\
\}\
\
function showResult(message) \{\
    const result = document.getElementById('result');\
    result.innerHTML = message;\
    result.classList.add('active');\
\}}