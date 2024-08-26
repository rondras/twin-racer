function loadTelegramWebAppScript() {
    var script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    document.head.appendChild(script);
}

// Call the function to load the script
loadTelegramWebAppScript();


// Initialize the Telegram WebApp
Telegram.WebApp.ready();

// Extract the start parameter which includes the referral code
const urlParams = new URLSearchParams(window.location.search);
const referralParam = urlParams.get('tgWebAppStartParam');
console.log(referralParam)

let referrerTelegramId = 1;

// Check if the referral parameter starts with 'ref'
if (referralParam && referralParam.startsWith('ref')) {
    // Extract the referrer's Telegram ID by stripping the 'ref' prefix
    referrerTelegramId = referralParam.slice(3); // "ref123456" becomes "123456"
}

const user = Telegram.WebApp.initDataUnsafe.user;
if (user) {
    addUser(user.username, user.id);
    // Display the user's name and profile picture
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <span>${user.first_name} ${user.last_name || ''} </span>
    `;
} else {
    // Handle case where user information is not available
    document.getElementById('user-info').innerText = 'User information not available.';
}

// Event occurs whenever theme settings are changed in the user's Telegram app (including switching to night mode).
Telegram.WebApp.onEvent('themeChanged', function() {
    document.documentElement.className = Telegram.WebApp.colorScheme;
});

// Show main button
Telegram.WebApp.MainButton.setParams({
    text: 'Main Button'
});
Telegram.WebApp.MainButton.onClick(function () {
    Telegram.WebApp.showAlert('Main Button was clicked')
});	
Telegram.WebApp.MainButton.show();

// Function to call showPopup API
function showPopup() {
    Telegram.WebApp.showPopup({
        title: 'Title',
        message: 'Some message',
        buttons: [
            {id: 'link', type: 'default', text: 'Open ton.org'},
            {type: 'cancel'},
        ]
    }, function(btn) {
        if (btn === 'link') {
            Telegram.WebApp.openLink('https://ton.org/');
        }
    });
};

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
async function addUser(tgName, tgID) {
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



