
class UrlDB {
    #map;
    #counter;

    // Initialize attributes
    constructor() {
        this.#map = new Map();
        this.#counter = 1;
    }


    // Adds the URL to the map and returns its key;
    addURL(url) {
        this.#map.set(this.#counter, url);
        return this.#counter++;
    }

    // Wrapper to the Map.get(key) method
    getURL(key) {
        // Specifically for Map we want to look by integers, if not, throw an error
        return this.#map.get(parseInt(key));
    }
}

module.exports.DB = new UrlDB();