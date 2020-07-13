const socket = io();

//Elements

const $messageForm = document.querySelector('#submit');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationForm = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    
    //visible height

    const visibleHeight = $messages.offsetHeight

    //height of messages container

    const containerHeight = $messages.scrollHeight

    // how far have i scrolled

    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('messagePrint', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationMessageTemplate, {
    username: url.username,
    url: url.location,
    createdAt: moment(url.createdAt).format('h:mm a')
    }) 
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //diabled
    $messageFormButton.setAttribute('disabled', 'disabled');
    //done diabling

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
       
        //enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        //done  enabling

        if(error) {
            return console.log(error);
        } else {
            console.log('Delivered');
        }
    })
});

$locationForm.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geo location is not supported by your browser');
    }

    //diabling
    $locationForm.setAttribute('disabled', 'disabled');
    //done disabling


    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {

            //enabling
            $locationForm.removeAttribute('disabled');
            //done enabling

             console.log('Location Shared');

        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
});