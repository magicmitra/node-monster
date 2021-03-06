function autocomplete(input, latInput, lngInput) {
    if(!input) return; // skip function from running if there
                       // is no input on the page
    // none of this shit works until we get a valid API key
    // Oh fucking well
    const dropdown = new google.maps.places.Autocomplete(input); 
    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    });
    // if someone hits enter on the address field, dont submit form
    input.on('keydown', (e) => {
        if(e.keycode === 13) e.preventDefault();
    })
}

export default autocomplete;