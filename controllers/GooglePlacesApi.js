import dotenv from "dotenv";
dotenv.config();

const APIKEY = process.env.GOOGLE_PLACES_API;

async function fetchCityImage(cityName) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cityName}&key=${APIKEY}`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const place = data.results[0];
      const photoReference = place.photos
        ? place.photos[0].photo_reference
        : null;

      if (photoReference) {
        const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoReference}&key=${APIKEY}`;

        return imageUrl;
      } else {
        console.log("No photos available for this place.");
        return null;
      }
    } else {
      console.log("No results found for this city.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching city images:", error);
  }
}

export { fetchCityImage };
