document.addEventListener('DOMContentLoaded', function () {
    const getInfoBtn = document.getElementById('getInfoBtn');
    const getCategory = document.getElementById('getCategory');
    const searchBtn = document.getElementById('searchBtn');
    const searchCategory = document.getElementById('searchCategory');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    getInfoBtn.addEventListener('click', function () {
        const selectedCategory = getCategory.value;
        if (selectedCategory === 'all') {
            // Call the function to get all places
            getAllPlaces();
        } else if (selectedCategory === 'region') {
            // Call the function to get regions
            getRegions();
        } else if (selectedCategory === 'state') {
            // Call the function to get states
            getStates();
        } else if (selectedCategory === 'lga') {
            // Call the function to get LGAs
            const selectedState = searchInput.value;
            getLGAs(selectedState);
        }
    });

    function fetchWithToken(url, options) {
        const token = localStorage.getItem('x-api-key');
        if (!token) {
            console.error('Error: No token found in localStorage');
            return Promise.reject('No token found');
        }

        if (!options.headers) {
            options.headers = {};
        }
        options.headers['x-api-key'] = token;

        return fetch(url, options);
    }

    function getAllPlaces() {
        fetchWithToken('https://geo-locale.onrender.com/api/places', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch places');
            }
            return response.json();
        })
        .then(data => {
            displayAllPlaces(data);
        })
        .catch(error => console.error('Error fetching all places:', error));
    }

    function displayAllPlaces(places) {
        // Clear previous search results
        searchResults.innerHTML = '';
    
        // Check if places is defined and an array
        if (Array.isArray(places)) {
            // Display all places
            places.forEach(region => {
                const regionDiv = document.createElement('div');
                regionDiv.classList.add('region');
                
                // Display region name
                const regionName = document.createElement('h2');
                regionName.textContent = region.name;
                regionDiv.appendChild(regionName);
    
                // Create a list of states for the region
                const statesList = document.createElement('ul');
                region.states.forEach(state => {
                    const stateItem = document.createElement('li');
                    stateItem.textContent = state.name;
                    const lgasList = document.createElement('ul');
                    state.lgas.forEach(lga => {
                        const lgaItem = document.createElement('li');
                        lgaItem.textContent = `${lga.name} - Population: ${lga.metadata.population}, Area: ${lga.metadata.area}`;
                        lgasList.appendChild(lgaItem);
                    });
                    stateItem.appendChild(lgasList);
                    statesList.appendChild(stateItem);
                });
                regionDiv.appendChild(statesList);
    
                searchResults.appendChild(regionDiv);
            });
        } else {
            // Handle the case where places is not an array or undefined
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Error: Unexpected data format or no data found';
            searchResults.appendChild(errorDiv);
        }
    }
    


    function getRegions() {
        fetchWithToken('https://geo-locale.onrender.com/api/regions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayRegions(data);
        })
        .catch(error => console.error('Error fetching regions:', error));
    }

    function displayRegions(regions) {
        // Clear previous search results
        searchResults.innerHTML = '';

        // Create a list of regions and their states
        regions.forEach(region => {
            const regionDiv = document.createElement('div');
            regionDiv.classList.add('region');
            const regionName = document.createElement('h3');
            regionName.textContent = region.region;
            regionDiv.appendChild(regionName);

            const stateList = document.createElement('ul');
            region.states.forEach(state => {
                const stateItem = document.createElement('li');
                stateItem.textContent = state;
                stateItem.addEventListener('click', () => searchByState(state));
                stateList.appendChild(stateItem);
            });
            regionDiv.appendChild(stateList);

            searchResults.appendChild(regionDiv);
        });
    }

    function getStates() {
        fetchWithToken('https://geo-locale.onrender.com/api/states', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayStates(data);
        })
        .catch(error => console.error('Error fetching states:', error));
    }

    function displayStates(states) {
        // Clear previous search results
        searchResults.innerHTML = '';
    
        // Create a container for displaying states and LGAs
        const container = document.createElement('div');
    
        // Iterate over each state
        states.forEach(state => {
            // Create a heading for the state
            const stateHeading = document.createElement('h2');
            stateHeading.classList.add('state-heading'); // Add class for styling
            stateHeading.textContent = state.state;
            container.appendChild(stateHeading);
    
            // Create a list to hold LGAs
            const lgaList = document.createElement('ul');
            lgaList.classList.add('lga-list'); // Add class for styling
    
            // Iterate over each LGA in the state
            state.lgas.forEach(lga => {
                // Create list item for each LGA
                const lgaItem = document.createElement('li');
                lgaItem.classList.add('lga-list-item'); // Add class for styling
                lgaItem.textContent = lga;
                lgaList.appendChild(lgaItem);
            });
    
            // Append the list of LGAs to the container
            container.appendChild(lgaList);
        });
    
        // Append the container to the search results
        searchResults.appendChild(container);
    }
    
    function getLGAs(state) {
        fetchWithToken('https://geo-locale.onrender.com/api/lgas' + state, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayLGAs(data);
        })
        .catch(error => console.error('Error fetching LGAs:', error));
    }
    

    function displayLGAs(lgas) {
        // Clear previous search results
        searchResults.innerHTML = '';
    
        // Check if the data is an array and not empty
        if (Array.isArray(lgas) && lgas.length > 0) {
            // Create a list of LGAs
            const lgaList = document.createElement('ul');
            lgaList.classList.add('lga-list'); // Add class for styling
            lgas.forEach(lga => {
                const lgaItem = document.createElement('li');
                lgaItem.classList.add('lga-list-item'); // Add class for styling
                // Display LGA details
                lgaItem.textContent = `${lga.lga} - Population: ${lga.metadata.population}, Area: ${lga.metadata.area}`;
                lgaList.appendChild(lgaItem);
            });
            searchResults.appendChild(lgaList);
        } else {
            // Display a message if no LGAs are found
            const message = document.createElement('p');
            message.classList.add('lga-details'); // Add class for styling
            message.textContent = 'No LGAs found for this state.';
            searchResults.appendChild(message);
        }
    }
    // Add event listener for search button
    searchBtn.addEventListener('click', function () {
        const selectedCategory = searchCategory.value;
        if (selectedCategory === 'state') {
            const selectedState = searchInput.value;
            searchByState(selectedState);
        } else if (selectedCategory === 'lga') {
            const selectedLGA = searchInput.value;
            searchByLGA(selectedLGA);
        } else if (selectedCategory === 'region') {
            const selectedRegion = searchInput.value;
            searchByRegion(selectedRegion);
        }
    });

    function searchByState(state) {
        fetchWithToken('https://geo-locale.onrender.com/api/search?category=state&query=' + state, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displaySearchResultByState(data);
        })
        .catch(error => console.error('Error searching by state:', error));
    }

    function searchByLGA(lga) {
        fetchWithToken('https://geo-locale.onrender.com/api/search?category=lga&query=' + lga, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displaySearchResultsByLGA(data);
        })
        .catch(error => console.error('Error searching by LGA:', error));
    }

    function searchByRegion(region) {
        fetchWithToken('https://geo-locale.onrender.com/api/search?category=region&query=' + region, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displaySearchResultsByRegion(data);
        })
        .catch(error => console.error('Error searching by region:', error));
    }
    
    function displaySearchResultByState(results) {
        // Clear previous search results
        searchResults.innerHTML = '';
    
        // Iterate over each result
        results.forEach(result => {
            // Create a container for the result
            const resultContainer = document.createElement('div');
            resultContainer.classList.add('result-container');
    
            // Display region
            const regionHeading = document.createElement('h2');
            regionHeading.textContent = `Region: ${result.region}`;
            resultContainer.appendChild(regionHeading);
    
            // Display states and their LGAs
            const statesList = document.createElement('ul');
            result.states.forEach(state => {
                const stateItem = document.createElement('li');
                stateItem.textContent = `State: ${state.name}, LGAs: ${state.lgas.join(', ')}`;
                statesList.appendChild(stateItem);
            });
            resultContainer.appendChild(statesList);
    
            // Append the result container to the search results
            searchResults.appendChild(resultContainer);
        });
    }
    

    // by region
    function displaySearchResultsByRegion(results) {
        // Clear previous search results
        searchResults.innerHTML = '';
    
        // Iterate over each result
        results.forEach(result => {
            // Create a container for the result
            const resultContainer = document.createElement('div');
            resultContainer.classList.add('result-container');
    
            // Display region
            const regionHeading = document.createElement('h2');
            regionHeading.textContent = `Region: ${result.region}`;
            resultContainer.appendChild(regionHeading);
    
            // Display states and their LGAs
            const statesList = document.createElement('ul');
            result.states.forEach(state => {
                const stateItem = document.createElement('li');
                stateItem.textContent = `State: ${state}`;
                statesList.appendChild(stateItem);
            });
            resultContainer.appendChild(statesList);
    
            // Append the result container to the search results
            searchResults.appendChild(resultContainer);
        });
    }
    
    
// lga
function displaySearchResultsByLGA(results) {
    // Clear previous search results
    searchResults.innerHTML = '';

    // Iterate over each result
    results.forEach(result => {
        // Create a container for the result
        const resultContainer = document.createElement('div');
        resultContainer.classList.add('result-container');

        // Display LGA and metadata
        const lgaHeading = document.createElement('h2');
        lgaHeading.textContent = `LGA: ${result.lga}`;
        const metadataParagraph = document.createElement('p');
        metadataParagraph.textContent = `Population: ${result.metadata.population}, Area: ${result.metadata.area}`;
        resultContainer.appendChild(lgaHeading);
        resultContainer.appendChild(metadataParagraph);

        // Display state
        const stateParagraph = document.createElement('p');
        stateParagraph.textContent = `State: ${result.state}`;
        resultContainer.appendChild(stateParagraph);

        // Append the result container to the search results
        searchResults.appendChild(resultContainer);
    });
}
          
        
});
    

// signout section
// Select the Sign Out link
const signOutLink = document.getElementById('signout');

// Add click event listener to the Sign Out link
signOutLink.addEventListener('click', function(event) {
    // Prevent the default action of the link
    event.preventDefault();

    // Clear the authentication token from localStorage
    localStorage.removeItem('x-api-key');

    // Redirect the user to the sign-in page or any other desired page
    window.location.href = 'https://client-locale-app.onrender.com/index.html'; // Replace with your sign-in page URL
});





