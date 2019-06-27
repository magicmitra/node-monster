function autocomplete(input, latInput, lngInput) {
    if(!input) return; // skip function from running if there
                       // is no input on the page
    // none of this shit works until we get a valid API key
    // Oh fucking well
    const dropdown = new google.maps.places.Autocomplete(input); 
}

export default autocomplete;