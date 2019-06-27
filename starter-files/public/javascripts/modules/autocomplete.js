function autocomplete(input, latInput, lngInput) {
    if(!input) return; // skip function from running if there
                       // is no input on the page
    const dropdown = new google.maps.places.Autocomplete(input);
}

export default autocomplete;