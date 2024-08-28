var tgName = ''
var tgID = ''
var referrerTelegramId = ''

async function loadTelegramWebAppScript() {
    var script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    document.head.appendChild(script);
}

// Call the function to load the script
await loadTelegramWebAppScript();


// Initialize the Telegram WebApp
Telegram.WebApp.ready();

const startParam = Telegram.WebApp.initDataUnsafe.start_param;

if (startParam) {
    console.log("Start Param:", startParam);
    if (startParam.startsWith('ref')) {
        // Extract the referrer's Telegram ID by stripping the 'ref' prefix
        referrerTelegramId = startParam.slice(3); // "ref123456" becomes "123456"
    }
} else {
    console.log("No start_param found.");
}


const initData = Telegram.WebApp.initDataUnsafe;

if (initData.user) {
    tgID = initData.user.id
    tgName = initData.user.username

    addUser(initData.user.username, initData.user.id,referrerTelegramId);
    // Display the user's name and profile picture
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <span>${initData.user.first_name} ${initData.user.last_name || ''} </span>
    `;
} else {
    // Handle case where user information is not available
    document.getElementById('user-info').innerText = 'User information not available.';
}

// Event occurs whenever theme settings are changed in the user's Telegram app (including switching to night mode).
Telegram.WebApp.onEvent('themeChanged', function() {
    document.documentElement.className = Telegram.WebApp.colorScheme;
});



// Function to toggle main TWA button
function toggleMainButton() {
    if (Telegram.WebApp.MainButton.isVisible) {
        Telegram.WebApp.MainButton.hide();
    } else {
        Telegram.WebApp.MainButton.show();
    }
};

function setViewportData() {
    var sizeEl = document.getElementById('viewport-params-size');
    sizeEl.innerText = 'width: ' + window.innerWidth + ' x ' + 
        'height: ' + Telegram.WebApp.viewportStableHeight;

    var expandEl = document.querySelector('#viewport-params-expand');
    expandEl.innerText = 'Is Expanded: ' + (Telegram.WebApp.isExpanded ? 'true' : 'false');
}

Telegram.WebApp.setHeaderColor('secondary_bg_color');

setViewportData();
Telegram.WebApp.onEvent('viewportChanged', setViewportData);

Telegram.WebApp.onEvent('themeChanged', function() {
    document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
});

// Function to add a user by calling the /addUser API
async function addUser(tgName, tgID,referrerTelegramId) {
    // API endpoint URL
    const apiUrl = 'https://racer-api.twinfinance.io:8443/addUser';
    
    // Create the payload object
    const data = {
        tgName: tgName,
        tgID: tgID,
        referrerID: referrerTelegramId,
    };

    try {
        // Make the POST request to the API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check if the response is successful
        if (response.ok) {
            // Parse the JSON response
            const result = await response.json();
            console.log('User added successfully:', result);
            
        } else {
            // Handle errors if the response is not successful
            const errorData = await response.json();
            console.error('Error adding user:', errorData);
            
        }
    } catch (error) {
        // Handle any network or other errors
        
        alert('Failed to add user due to network error.');
    }
}



